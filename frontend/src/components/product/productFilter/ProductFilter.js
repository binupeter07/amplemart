import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import styles from "./ProductFilter.module.scss";
import {
  FILTER_BY_BRAND,
  FILTER_BY_CATEGORY,
  FILTER_BY_PRICE,
} from "../../../redux/features/product/filterSlice";
import { GET_PRICE_RANGE } from "../../../redux/features/product/productSlice";

const ProductFilter = ({ categoryTitle }) => {
  const { products, minPrice, maxPrice } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const [category, setCategory] = useState(categoryTitle || "All");
  const [brand, setBrand] = useState("All");
  const [price, setPrice] = useState([minPrice, maxPrice]);

  // Dynamically extract categories and brands for filtering options
  const allCategories = ["All", ...new Set(products.map((product) => product.category))];
  const allBrands = ["All", ...new Set(products.map((product) => product.brand))];

  // Dispatch actions on component mount and when dependencies change
  useEffect(() => {
    dispatch(GET_PRICE_RANGE({ products }));
  }, [dispatch, products]);

  useEffect(() => {
    dispatch(FILTER_BY_BRAND({ products, brand }));
  }, [dispatch, products, brand]);

  useEffect(() => {
    dispatch(FILTER_BY_PRICE({ products, price }));
  }, [dispatch, products, price]);

  // Filter products based on selected category
  const filterProducts = (cat) => {
    setCategory(cat);
    dispatch(FILTER_BY_CATEGORY({ products, category: cat }));
  };

  // Reset filters to their initial states
  const clearFilters = () => {
    setCategory("All");
    setBrand("All");
    setPrice([minPrice, maxPrice]);
  };

  return (
    <div className={styles.filter}>
      <h4>Categories</h4>
      <div className={styles.category}>
        {allCategories.map((cat, index) => (
          <button
            key={index}
            type="button"
            className={`${category === cat ? styles.active : ""}`}
            onClick={() => filterProducts(cat)}
          >
            &#8250; {cat}
          </button>
        ))}
      </div>
      <h4>Brand</h4>
      <div className={styles.brand}>
        <select value={brand} onChange={(e) => setBrand(e.target.value)}>
          {allBrands.map((brand, index) => (
            <option key={index} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>
      <h4>Price</h4>
      <div className={styles.price}>
        <Slider
          range
          marks={{
            [minPrice]: `$${price[0]}`,
            [maxPrice]: `$${price[1]}`,
          }}
          min={minPrice}
          max={maxPrice}
          value={price}
          onChange={(newPrice) => setPrice(newPrice)}
          tipFormatter={(value) => `$${value}`}
          tipProps={{
            placement: "top",
            visible: true,
          }}
        />
      </div>
      <button className={`${styles.clearFilterBtn} --btn-danger`} onClick={clearFilters}>
        Clear Filter
      </button>
    </div>
  );
};

export default ProductFilter;
