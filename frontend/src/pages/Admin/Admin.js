import React from "react";
import { Route, Routes } from "react-router-dom";
import styles from "./Admin.module.scss";
import Navbar from "../../components/Admin/Navbar/Navbar";
import AdminHome from "../../components/Admin/AdminHome/AdminHome";
import Category from "../../components/Admin/category/Category";
import Brand from "../../components/Admin/brand/Brand";
import AddProduct from "../../components/Admin/addProduct/AddProduct";
import ViewProducts from "../../components/Admin/viewProducts/ViewProducts";
import EditProduct from "../../components/Admin/editProduct/EditProduct";
import Coupon from "../../components/Admin/coupon/Coupon";
import OrderDetails from "../../components/Admin/orderDetails/OrderDetails";
import Orders from "../../components/Admin/orders/Orders";
import Home from "../../components/Admin/home/Home";
import ViewUsers from "../../components/Admin/viewUsers/ViewUsers";

const Admin = () => {
  return (
    <div className={styles.admin}>
      <div className={styles.navbar}>
        <Navbar />
      </div>
      <div className={styles.content}>
        <Routes>
          <Route path="home" element={<Home />} />
          <Route path="all-products" element={<ViewProducts />} />
          <Route path="all-users" element={<ViewUsers />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="orders" element={<Orders />} />
          <Route path="order-details/:id" element={<OrderDetails />} />
          <Route path="coupon" element={<Coupon />} />
          <Route path="category" element={<Category />} />
          <Route path="brand" element={<Brand />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
