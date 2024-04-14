import React from "react";
import Slider from "../../components/Slider/Slider";
import "./Home.scss";
import ProductCategory from "../../components/Home/ProductCategory";
import FooterLinks from "../../components/Footer/FooterLinks";

const Home = () => {
  return (
    <>
      <Slider />
      <section className="--bt-grey">
        <div className="container-center">
          <h3>Categories</h3>
          <ProductCategory />
        </div>
      </section>
      <FooterLinks />
    </>
  );
};

export default Home;
