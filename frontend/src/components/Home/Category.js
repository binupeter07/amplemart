import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FILTER_PRODUCTS,
  SET_FILTER_STATE,
} from "../../redux/features/product/filterSlice";

const Category = (props) => {
  const { title, image } = props;
  const { products, minPrice, maxPrice } = useSelector(
    (state) => state.product
  );
  const filter = useSelector((state) => state.filter.filter);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCategorySelect = (title) => {
    dispatch(
      FILTER_PRODUCTS({
        products,
        filter: {
          ...filter,
          category: title,
        },
      })
    );
  };

  return (
    <div className="category">
      <h3>{title}</h3>
      <img src={image} alt={`Image for ${title}`} />
      <button
        className="--btn"
        onClick={() => {
          navigate(`/shop?title=${title}`);
          handleCategorySelect(title);
        }}
      >
        Shop Now
      </button>
    </div>
  );
};

export default Category;
