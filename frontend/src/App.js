import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/header/Header.js";
import Home from "./pages/Home/Home.js";
import Login from "./pages/Auth/Login.js";
import Register from "./pages/Auth/Register.js";
import Footer from "./components/Footer/Footer.js";
import { useDispatch, useSelector } from "react-redux";
import {
  getLoginStatus,
  getUser,
  selectIsLoggedIn,
  selectUser,
} from "./redux/features/auth/authSlice";
import { useEffect } from "react";
import Profile from "./pages/Profile/Profile.js";
import AdminOnlyRoute from "./components/adminOnlyRoute/AdminOnlyRoute.js";
import Admin from "./pages/Admin/Admin.js";
import NotFound from "./pages/404/notFound.js";
import Product from "./pages/shop/Shop.js";
import ProductDetails from "./components/product/productDetails/productDetails.js";
import Cart from "./pages/cart/Cart.js";
import CheckoutDetails from "./pages/checkout/CheckoutDetails.js";
import Checkout from "./pages/checkout/Checkout.js";
import CheckoutSuccess from "./pages/checkout/CheckoutSuccess.js";
import OrderHistory from "./pages/orderHistory/OrderHistory.js";
import OrderDetails from "./pages/orderDetails/Order.js";
import ReviewProducts from "./pages/reviewProducts/ReviewProducts.js";
import CheckoutPaypal from "./pages/checkout/CheckoutPaypal.js";
import { AnimatePresence } from "framer-motion";
import ChangePassword from "./pages/ChangePassword/ChangePassword.js";
import ResetPassword from "./pages/resetPassword/ResetPassword.js";
import ContactPage from "./pages/Contact/Contact.js";

axios.defaults.withCredentials = true;
// Deploy

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(getLoginStatus());
    // console.log("Get Login Status App");
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn && user === null) {
      dispatch(getUser());
    }
  }, [dispatch, isLoggedIn, user]);

  return (
    <>
      <ToastContainer />
      <Header />
      <AnimatePresence>
      <div style={{minHeight:"calc(100vh - 8.8rem)"}}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/profile" element={<Profile />} />

          <Route
            path="/admin/*"
            element={
              <AdminOnlyRoute>
                <Admin />
              </AdminOnlyRoute>
            }
          />

          <Route path="/shop" element={<Product />} />
          <Route path="/product-details/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />

          <Route path="/checkout-details" element={<CheckoutDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout-paypal" element={<CheckoutPaypal />} />
          <Route path="/checkout-success" element={<CheckoutSuccess />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/order-details/:id" element={<OrderDetails />} />

          <Route path="/review-product/:id" element={<ReviewProducts />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        </ div >
      </AnimatePresence>
      <Footer />
    </>
  );
}

export default App;
