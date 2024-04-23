const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logout,
  getUser,
  getLoginStatus,
  updateUser,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getCart,
  saveCart,
  clearCart,
  updatePhoto,
  changePassword,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUser,
  changeStatus,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { sendContactMail } = require("../controllers/contactController");
// comment

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/getUser", protect, getUser);
router.get("/getUsers", protect, getUsers);
router.post("/deleteUser", protect, deleteUser);
router.post("/changeStatus", protect, changeStatus);
router.get("/getLoginStatus", getLoginStatus);
router.patch("/updateUser", protect, updateUser);
router.patch("/updatePhoto", protect, updatePhoto);
router.patch("/changePassword", protect, changePassword);
router.post("/forgotpassword", forgotPassword);
router.patch("/resetPassword/:resetToken", resetPassword);

// wishlist
router.post("/addToWishlist", protect, addToWishlist);
router.get("/getWishlist", protect, getWishlist);
router.put("/wishlist/:productId", protect, removeFromWishlist);

// cart
router.get("/getCart", protect, getCart);
router.patch("/saveCart", protect, saveCart);
router.patch("/clearCart", protect, clearCart);
router.post("/contactus", sendContactMail);
module.exports = router;
