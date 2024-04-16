import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './Shop.module.scss';
import { useLocation } from 'react-router-dom';

import { FaCogs } from 'react-icons/fa';
import {
  GET_PRICE_RANGE,
  getProducts,
  selectIsLoading,
  selectProducts,
} from '../../redux/features/product/productSlice';
import { Spinner } from '../../components/Loader/Loader';
import ProductList from '../../components/product/productList/ProductList';
import ProductFilter from '../../components/product/productFilter/ProductFilter';

const Product = () => {
  const products = useSelector(selectProducts);
  const dispatch = useDispatch();

  const [showFilter, setShowFilter] = useState(false);
  const isLoading = useSelector(selectIsLoading);

  const location = useLocation();
  const [categoryTitle, setCategoryTitle] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const title = searchParams.get('title');

    setCategoryTitle(title);
  }, [location.search]);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      GET_PRICE_RANGE({
        products: products,
      })
    );
  }, [dispatch, products]);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  return (
    <section>
      <div className={`${styles.container} ${styles.product}`}>
        <aside
          className={
            showFilter ? `${styles.filter} ${styles.show}` : styles.filter
          }
        >
          {isLoading ? null : <ProductFilter categoryTitle={categoryTitle} />}
        </aside>
        <div className={styles.content}>
          {isLoading ? <Spinner /> : <ProductList products={products} />}
          <div className={styles.icon} onClick={toggleFilter}>
            <FaCogs size={20} color="orangered" />
            <p>
              <b>{showFilter ? 'Hide Filter' : 'Show Filter'}</b>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Product;
