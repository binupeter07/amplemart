import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filteredProducts: [],
  filter:{
    category: "All",
    brand: "All",
    price: [0, 1000],
  }
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    FILTER_BY_SEARCH(state, action) {
      const { products, search } = action.payload;
      const tempProducts = state.filteredProducts.filter(
        (product) =>
          product.name?.toLowerCase().includes(search.toLowerCase()) ||
          product.category?.toLowerCase().includes(search.toLowerCase())
      );

      state.filteredProducts = tempProducts;
    },
    SORT_PRODUCTS(state, action) {
      const {  sort } = action.payload;
      let tempProducts = [];
      if (sort === "latest") {
        tempProducts = state.filteredProducts;
      }

      if (sort === "lowest-price") {
        tempProducts = state.filteredProducts.slice().sort((a, b) => {
          return a.price - b.price;
        });
      }

      if (sort === "highest-price") {
        tempProducts = state.filteredProducts.slice().sort((a, b) => {
          return b.price - a.price;
        });
      }

      if (sort === "a-z") {
        tempProducts = state.filteredProducts.slice().sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
      }
      if (sort === "z-a") {
        tempProducts = state.filteredProducts.slice().sort((a, b) => {
          return b.name.localeCompare(a.name);
        });
      }

      state.filteredProducts = tempProducts;
    },   
    FILTER_PRODUCTS(state, action) {
      const { products, filter } = action.payload;
      let tempProducts = products;
      if (filter.category && filter.category !== 'All') {
        state.filter.category = filter.category
        tempProducts = tempProducts.filter(
          (product) => product.category === state.filter.category
        );
      } 
      if (filter.brand && filter.brand !== "All") {
        state.filter.brand = filter.brand
        tempProducts = tempProducts.filter((product) => product.brand === state.filter.brand);
       
      }
      console.log(state.filter.price)
      if (filter.price && filter.price[0] !== Infinity && filter.price[1] !== -Infinity) {
        state.filter.price = filter.price
        tempProducts = tempProducts.filter(
          (product) => product.price >= state.filter.price[0] && product.price <= state.filter.price[1]
        );
      }
      state.filteredProducts = tempProducts;
    },
    SET_FILTER_STATE(state, action) {
      state.filter = action.payload
    }

  },
});

export const {
  FILTER_BY_SEARCH,
  SORT_PRODUCTS,
  SET_FILTER_STATE,
  FILTER_PRODUCTS
} = filterSlice.actions;

export const selectFilteredProducts = (state) => state.filter.filteredProducts;

export default filterSlice.reducer;