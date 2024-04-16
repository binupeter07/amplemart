import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/header/Header";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Footer from "./components/Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import {
  getLoginStatus,
  getUser,
  selectIsLoggedIn,
  selectUser,
} from "./redux/features/auth/authSlice";
import { useEffect } from "react";
import Profile from "./pages/Profile/Profile";
import AdminOnlyRoute from "./components/adminOnlyRoute/AdminOnlyRoute";
import Admin from "./pages/Admin/Admin";
// import NotFound from "./pages/404/NotFound.js";
import Product from "./pages/shop/Shop";
import ProductDetails from "./components/product/productDetails/ProductDetails";
import Cart from "./pages/cart/Cart";
import CheckoutDetails from "./pages/checkout/CheckoutDetails";
import Checkout from "./pages/checkout/Checkout";
import CheckoutSuccess from "./pages/checkout/CheckoutSuccess";
import OrderHistory from "./pages/orderHistory/OrderHistory";
import OrderDetails from "./pages/orderDetails/Order";
import ReviewProducts from "./pages/reviewProducts/ReviewProducts";
import CheckoutPaypal from "./pages/checkout/CheckoutPaypal";
import { AnimatePresence } from "framer-motion";
import ChangePassword from "./pages/ChangePassword/ChangePassword.js";
import ResetPassword from "./pages/resetPassword/ResetPassword.js";

axios.defaults.withCredentials = true;
// Deploy

function App() {
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

          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  );
}

export default App;
