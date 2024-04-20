import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import styles from "./ProductFilter.module.scss";
import {
  FILTER_PRODUCTS,
  SET_FILTER_STATE,
} from "../../../redux/features/product/filterSlice";

const ProductFilter = ({ categoryTitle }) => {
  const { products, minPrice, maxPrice } = useSelector(
    (state) => state.product
  );
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.filter.filter);
  const allCategories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];
  const allBrands = [
    "All",
    ...new Set(products.map((product) => product.brand)),
  ];

  useEffect(() => {
    dispatch(FILTER_PRODUCTS({ products, filter }));
  }, [dispatch, products, filter]);

  const filterProducts = (cat) => {
    dispatch(SET_FILTER_STATE({ ...filter, category: cat }));
  };

  const handleBrandChange = (e) => {
    dispatch(SET_FILTER_STATE({ ...filter, brand: e.target.value }));
  };

  const handlePriceChange = (newPrice) => {
    dispatch(SET_FILTER_STATE({ ...filter, price: newPrice }));
  };

  const clearFilters = () => {
    dispatch(
      SET_FILTER_STATE({
        category: "All",
        brand: "All",
        price: [minPrice, maxPrice],
      })
    );
  };

  return (
    <div className={styles.filter}>
      <h4>Categories</h4>
      <div className={styles.category}>
        {allCategories.map((cat, index) => (
          <button
            key={index}
            type="button"
            className={`${filter.category === cat ? styles.active : ""}`}
            style={{ minWidth: "max-content" }}
            onClick={() => filterProducts(cat)}
          >
            &#8250; {cat}
          </button>
        ))}
      </div>
      <h4>Brand</h4>
      <div className={styles.brand}>
        <select value={filter.brand} onChange={handleBrandChange}>
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
            [minPrice]: `$${filter.price[0]}`,
            [maxPrice]: `$${filter.price[1]}`,
          }}
          min={minPrice}
          max={maxPrice}
          value={filter.price}
          onChange={handlePriceChange}
          tipFormatter={(value) => `$${value}`}
          tipProps={{
            placement: "top",
            visible: true,
          }}
        />
      </div>
      <button
        className={`${styles.clearFilterBtn} --btn-danger`}
        onClick={clearFilters}
      >
        Clear Filter
      </button>
    </div>
  );
};

export default ProductFilter;
