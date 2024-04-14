import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Slider.scss"; // Your custom styles

import { sliderData } from "./Slider-data";
import { useNavigate } from "react-router-dom";

const SimpleSlider = () => {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <button className="arrow next">›</button>,
    prevArrow: <button className="arrow prev">‹</button>,
    appendDots: dots => (
      <div>
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
  };

  return (
    <Slider {...settings}>
      {sliderData.map((slide, index) => (
     <div className="slide-wrapper">
         <div key={index} className="slide">
          <div className="slide-image">
            <img src={slide.image} />
          </div>
          <div className="content">
            <button className="button" onClick={() => navigate("/shop")}>Shop Now</button>
          </div>
        </div>
     </div>
      ))}
    </Slider>
  );
};

export default SimpleSlider;