const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const { calculateTotalPrice } = require("../utils");
const Product = require("../models/productModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const axios = require("axios");
const User = require("../models/userModel");
const { orderSuccessEmail } = require("../emailTemplates/orderTemplate");
const sendOrderEmail = require("../utils/sendOrderEmail");

const createOrder = asyncHandler(async (req, res) => {
  const {
    orderDate,
    orderTime,
    orderAmount,
    orderStatus,
    cartItems,
    shippingAddress,
    paymentMethod,
    coupon,
  } = req.body;

  //   Validation
  if (!cartItems || !orderStatus || !shippingAddress || !paymentMethod) {
    res.status(400);
    throw new Error("Order data missing!!!");
  }

  const updatedProduct = await updateProductQuantity(cartItems);
  // console.log("updated product", updatedProduct);

  // Create Order
  await Order.create({
    user: req.user.id,
    orderDate,
    orderTime,
    orderAmount,
    orderStatus,
    cartItems,
    shippingAddress,
    paymentMethod,
    coupon,
  });

  // Send Order Email to the user
  const subject = "Amplemart Order Placed";
  const send_to = req.user.email;
  const template = orderSuccessEmail(req.user.name, cartItems);
  const reply_to = "amplemart07@gmail.com";

  await sendOrderEmail(subject, send_to, template, reply_to);

  res.status(201).json({ message: "Order Created" });
});

// Get all Orders
const getOrders = asyncHandler(async (req, res) => {
  let orders;

  if (req.user.role === "admin") {
    orders = await Order.find().sort("-createdAt");
  } else {
    orders = await Order.find({ user: req.user._id }).sort("-createdAt");
  }

  // Format orderAmount to two decimal places
  const formattedOrders = orders.map(order => ({
    ...order.toObject(),
    orderAmount: parseFloat(order.orderAmount).toFixed(2)
  }));

  res.status(200).json(formattedOrders);
});

// Get single Order
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  // if product doesnt exist
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (req.user.role === "admin") {
    return res.status(200).json(order);
  }
  // Match Order to its user
  if (order.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  res.status(200).json(order);
});

// Update Product
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body;
  const { id } = req.params;

  const order = await Order.findById(id);

  // if product doesnt exist
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Update Product
  await Order.findByIdAndUpdate(
    { _id: id },
    {
      orderStatus: orderStatus,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ message: "Order status updated" });
});

// Pay with stripe
// Pay with stripe
const payWithStripe = asyncHandler(async (req, res) => {
  const { items, shipping, description, coupon } = req.body;
  const products = await Product.find();

  let orderAmount = calculateTotalPrice(products, items);

  if (coupon !== null && coupon?.name !== "nil") {
    let totalAfterDiscount = orderAmount - (orderAmount * coupon.discount) / 100;
    orderAmount = Math.round(totalAfterDiscount); // Ensure the total amount is rounded to an integer
  } else {
    orderAmount = Math.round(orderAmount); // Ensure rounding even without coupon
  }

  // Convert the order amount from dollars to cents for Stripe
  const amountInCents = orderAmount * 100; // Assuming orderAmount is in dollars. Adjust if in other currency

  // Create a PaymentIntent with the order amount and currency
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      description,
      shipping: {
        address: {
          line1: shipping.line1,
          line2: shipping.line2,
          city: shipping.city,
          country: shipping.country,
          postal_code: shipping.postal_code,
        },
        name: shipping.name,
        phone: shipping.phone,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating Stripe payment intent:', error);
    res.status(500).send({ error: error.message });
  }
});




// pAYWith Wallet
// Pay with Wallet
const payWithWallet = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { items, cartItems, shippingAddress, coupon } = req.body;
  // console.log(coupon);
  const products = await Product.find();
  const today = new Date();

  let orderAmount;
  orderAmount = calculateTotalPrice(products, items);
  if (coupon !== null && coupon?.name !== "nil") {
    let totalAfterDiscount =
      orderAmount - (orderAmount * coupon.discount) / 100;
    orderAmount = totalAfterDiscount;
  }
  // console.log(orderAmount);
  // console.log(user.balance);

  if (user.balance < orderAmount) {
    res.status(400);
    throw new Error("Insufficient balance");
  }

  const newTransaction = await Transaction.create({
    amount: orderAmount,
    sender: user.email,
    receiver: "Amplemart store",
    description: "Payment for products.",
    status: "success",
  });

  // decrease the sender's balance
  const newBalance = await User.findOneAndUpdate(
    { email: user.email },
    {
      $inc: { balance: -orderAmount },
    }
  );

  const newOrder = await Order.create({
    user: user._id,
    orderDate: today.toDateString(),
    orderTime: today.toLocaleTimeString(),
    orderAmount,
    orderStatus: "Order Placed...",
    cartItems,
    shippingAddress,
    paymentMethod: "Amp Wallet",
    coupon,
  });

  // Update Product quantity
  const updatedProduct = await updateProductQuantity(cartItems);
  // console.log("updated product", updatedProduct);

  // Send Order Email to the user
  const subject = "Amplemart Order Placed";
  const send_to = user.email;
  const template = orderSuccessEmail(user.name, cartItems);
  const reply_to = "@gmail.com";

  await sendEmail(subject, send_to, template, reply_to);

  if (newTransaction && newBalance && newOrder) {
    return res.status(200).json({
      message: "Payment successful",
      url: `${process.env.FRONTEND_URL}/checkout-success`,
    });
  }
  res
    .status(400)
    .json({ message: "Something went wrong, please contact admin" });
});

const updateProductQuantity = async (cartItems) => {
  // Update Product quantity
  let bulkOption = cartItems.map((product) => {
    return {
      updateOne: {
        filter: { _id: product._id }, // IMPORTANT item.product
        update: {
          $inc: {
            quantity: -product.cartQuantity,
            sold: +product.cartQuantity,
          },
        },
      },
    };
  });
  let updatedProduct = await Product.bulkWrite(bulkOption, {});
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  payWithStripe,
  payWithWallet,
};