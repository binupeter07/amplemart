const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');
const dotenv = require('dotenv').config();

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};
const generateResetPasswordToken = (id) => {
  return jwt.sign({ id, type: 'reset-password' }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};
// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be up to 6 characters');
  }

  // Check if user email already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('Email has already been registered');
  }
  // Create new user
  const user = await User.create({
    name,
    email,
    password,
  });

  //   Generate Token
  const token = generateToken(user._id);

  if (user) {
    const { _id, name, email, phone, role } = user;
    // Send HTTP-only cookie
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      // sameSite: "none",
      // secure: true,
    });

    res.status(201).json({
      _id,
      name,
      email,
      phone,
      role,
      token,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate Request
  if (!email || !password) {
    res.status(400);
    throw new Error('Please add email and password');
  }

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error('User not found, please signup');
  }
  if (user.isBlocked) {
    res.status(400).json({ message: 'Blocked' });
  }

  // User exists, check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  //   Generate Token
  const token = generateToken(user._id);

  if (passwordIsCorrect) {
    // Send Login cookie
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      // expires: new Date(Date.now() + 1000 * 86400), // 1 day
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'none',
      secure: true,
    });
  }

  if (user && passwordIsCorrect) {
    const { _id, name, email, phone, address } = user;
    const newUser = await User.findOne({ email }).select('-password');

    res.status(200).json(newUser);
  } else {
    res.status(400);
    throw new Error('Invalid email or password');
  }
});

// Logout User
const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    path: '/',
    httpOnly: true,
    expires: new Date(0),
    sameSite: 'none',
    secure: true,
  });
  return res.status(200).json({ message: 'Successfully Logged Out' });
});

// Get User Data
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'customer' }).select('-password');

  if (users) {
    res.status(200).json(users);
  } else {
    res.status(400);
    throw new Error('Users Not Found');
  }
});
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.id);
  // if User doesnt exist
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.remove();
  res.status(200).json({ message: 'User deleted.' });
});
const changeStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.id);

  // If user doesn't exist
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Toggle the blocked status
  user.isBlocked = !user.isBlocked;

  // Save the updated user
  await user.save();

  res.status(200).json({ message: 'User status changed.' });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.find(req.user._id).select('-password');

  if (user) {
    // const { _id, name, email, phone, address } = user;
    res.status(200).json(user);
  } else {
    res.status(400);
    throw new Error('User Not Found');
  }
});

// Get Login Status
const getLoginStatus = asyncHandler(async (req, res) => {
  // console.log("getLoginStatus Fired");
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  // Verify Token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});

// Update User
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { name, email, phone, address } = user;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.address = req.body.address || address;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      photo: updatedUser.photo,
      address: updatedUser.address,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Update Photo
const updatePhoto = asyncHandler(async (req, res) => {
  const { photo } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  user.photo = photo;
  const updatedUser = await user.save();
  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    photo: updatedUser.photo,
    address: updatedUser.address,
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { oldPassword, password } = req.body;

  if (!user) {
    res.status(400);
    throw new Error('User not found, please signup');
  }
  //Validate
  if (!oldPassword || !password) {
    res.status(400);
    throw new Error('Please add old and new password');
  }

  // check if old password matches password in DB
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  // Save new password
  if (user && passwordIsCorrect) {
    user.password = password;
    let response = await user.save();
    res.status(200).json({ message: 'Password change successful' });
  } else {
    res.status(400).json({ message: 'Old password is incorrect' });
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User does not exist');
  }

  // Generate JWT token
  const token = generateResetPasswordToken(user._id);
  // Construct Reset URL with JWT token
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword?token=${token}`;

  // Reset Email
  const message = `
    <h2>Hello ${user.name}</h2>
    <p>Please use the button below to reset your password.</p>  
    <p>This reset link is valid for only 30 minutes.</p>

    <p style="text-align: left;">
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
    </p>

    <p>Regards...</p>
    <p>Amplemart Team</p>
  `;
  const subject = 'Password Reset Request';
  const send_to = user.email;

  try {
    let response = await sendEmail(subject, message, send_to);
    res.status(200).json({ success: true, message: 'Reset Email Sent' });
  } catch (error) {
    res.status(500);
    throw new Error('Email not sent, please try again');
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  try {
    // Verify the JWT token
    const verified = jwt.verify(resetToken, process.env.JWT_SECRET);

    // Find user by ID obtained from the token
    const user = await User.findById(verified.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Update user password
    user.password = password;
    let response = await user.save();

    res.status(200).json({
      success: true,
      message:
        'Password reset successful. Please login with your new password.',
    });
  } catch (error) {
    // Handle token verification errors
    if (error.name === 'TokenExpiredError') {
      res.status(400);
      throw new Error('Token expired. Please request a new password reset.');
    } else if (error.name === 'JsonWebTokenError') {
      res.status(400);
      throw new Error('Invalid token. Please request a new password reset.');
    } else {
      res.status(500);
      throw new Error('Internal server error');
    }
  }
});

// Add product to wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  await User.findOneAndUpdate(
    { email: req.user.email },
    { $addToSet: { wishlist: productId } }
  );

  res.json({ message: 'Product added to wishlist' });
});

//
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { wishlist: productId } }
  );

  res.json({ message: 'Product removed to wishlist' });
});

// Get Wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const list = await User.findOne({ email: req.user.email })
    .select('wishlist')
    .populate('wishlist');

  res.json(list);
});

// Save Cart
const saveCart = asyncHandler(async (req, res) => {
  const { cartItems } = req.body;

  const user = await User.findById(req.user._id);

  if (user) {
    user.cartItems = cartItems;
    user.save();
    res.status(200).json({ message: 'Cart saved' });
  } else {
    res.status(400);
    throw new Error('User Not Found');
  }
});

// Get Cart
const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // const { _id, name, email, phone, address } = user;
    res.status(200).json(user.cartItems);
  } else {
    res.status(400);
    throw new Error('User Not Found');
  }
});

// Clear Cart
const clearCart = asyncHandler(async (req, res) => {
  const { cartItems } = req.body;

  const user = await User.findById(req.user._id);

  if (user) {
    user.cartItems = [];
    user.save();
    res.status(200).json({ message: 'Cart cleared' });
  } else {
    res.status(400);
    throw new Error('User Not Found');
  }
});

module.exports = {
  registerUser,
  loginUser,
  deleteUser,
  logout,
  getUser,
  getLoginStatus,
  updateUser,
  updatePhoto,
  changePassword,
  forgotPassword,
  resetPassword,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  saveCart,
  getCart,
  clearCart,
  getUsers,
  changeStatus,
};
