const asyncHandler = require("express-async-handler");
const Coupon = require("../models/couponModel");

// Create Coupon
const createCoupon = asyncHandler(async (req, res) => {
  const { name, expiresAt, discount } = req.body;

  if (!name || !expiresAt || !discount) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  // Check if the coupon already exists
  const existingCoupon = await Coupon.findOne({ name });
  if (existingCoupon) {
    return res.status(400).json({ message: "Coupon name already exists" });
  }

  const coupon = await Coupon.create({
    name,
    expiresAt,
    discount,
  });

  res.status(201).json(coupon);
});

// Get Coupons
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({ expiresAt: { $gt: Date.now() } }).sort("-createdAt");
  res.status(200).json(coupons);
});

// Get Single Coupon
const getCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({
    name: req.params.couponName,
    expiresAt: { $gt: Date.now() },
  });

  if (!coupon) {
    return res.status(404).json({ message: "Coupon not found or has expired" });
  }

  res.status(200).json(coupon);
});

// Delete Coupon
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) {
    return res.status(404).json({ message: "Coupon not found" });
  }
  res.status(200).json({ message: "Coupon deleted." });
});

module.exports = {
  createCoupon,
  getCoupon,
  getCoupons,
  deleteCoupon,
};
