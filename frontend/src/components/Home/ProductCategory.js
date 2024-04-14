import React from "react";
import "./ProductCategory.scss";
import Category from "./Category";

const ProductCategory = () => {
  const categories = [
    {
      id: 1,
      title: "Mobile Phones",
      image:
        "https://m.media-amazon.com/images/I/51UuPZLMaCL._AC_UY327_FMwebp_QL65_.jpg",
    },
    {
      id: 2,
      title: "Laptops",
      image:
        "https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1697018907/Croma%20Assets/Computers%20Peripherals/Laptop/Images/272253_0_r84tjq.png?tr=w-1000",
    },
    {
      id: 3,
      title: "Gaming Console",
      image:
        "https://techneek.ie/cdn/shop/files/Untitleddesign_aa225b3d-824e-4212-b70e-9e2873ad3f5b_2048x2048.png?v=1699446573",
    },
  ];

  return (
    <div className="categories">
      {categories.map((cat) => (
        <div key={cat.id} className="--flex-center">
          <Category title={cat.title} image={cat.image} />
        </div>
      ))}
    </div>
  );
};

export default ProductCategory;
