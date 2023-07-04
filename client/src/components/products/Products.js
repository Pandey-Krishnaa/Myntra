import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import "./Products.css";
import Loader from "../Loader";
import { PRODUCT_CATEGORIES, FOR_WHOM } from "../../constant";
import {
  filteredProductThunk,
  setCategory,
  setForWhom,
  setPriceRange,
  setRatingRange,
} from "../../store/productsSlice";

import Slider from "@mui/material/Slider";
function valuetext(value) {
  return value;
}

function Products() {
  const [range, setRange] = useState([0, 25000]);
  const [rating, setRating] = useState([0, 5]);
  const handlePriceChange = (event, newValue) => {
    setRange(newValue);
    dispatch(setPriceRange({ range: newValue }));
  };
  const handleRatingChange = (e, newValue) => {
    setRating(newValue);
    dispatch(setRatingRange({ range: newValue }));
  };
  const productState = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const clearAllFilters = () => {
    dispatch(setCategory({ category: "" }));
    dispatch(setForWhom({ forWhom: "" }));
    dispatch(setPriceRange({ range: [0, 25000] }));
    dispatch(setRatingRange({ range: [0, 5] }));
  };

  useEffect(() => {
    dispatch(
      filteredProductThunk(
        productState?.searchQuery,
        productState?.category,
        productState?.forWhom,
        productState?.priceRange,
        productState?.ratingRange
      )
    );
    // console.log("useEffe");
  }, [
    dispatch,
    productState?.category,
    productState?.searchQuery,
    productState?.forWhom,
    productState?.priceRange,
    productState?.ratingRange,
  ]);

  return (
    <div className="products">
      <div className="products_sidebar">
        <button
          className="btn btn-success"
          onClick={(e) => {
            e.preventDefault();
            clearAllFilters();
          }}
        >
          Clear Filters
        </button>
        <div className="product_categories">
          <h3>Category</h3>
          {PRODUCT_CATEGORIES.map((cat) => (
            <div className="category_container">
              <input
                type="radio"
                name="category"
                value={cat}
                onClick={() => {
                  dispatch(setCategory({ category: cat }));
                }}
                checked={productState?.category === cat}
              />
              <label>{cat}</label>
            </div>
          ))}
        </div>
        <div className="product_for">
          <h3>For</h3>
          {FOR_WHOM.map((forWhom) => (
            <div className="forWhom_container">
              <input
                type="radio"
                name="for"
                value={forWhom}
                onClick={() => {
                  dispatch(setForWhom({ forWhom }));
                }}
                checked={productState?.forWhom === forWhom}
              />
              <label>{forWhom}</label>
            </div>
          ))}
        </div>
        <div className="price_slider">
          <label>Price</label>
          <Slider
            getAriaLabel={() => "Price Range"}
            value={range}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            getAriaValueText={valuetext}
            aria-labelledby="range-slider"
            min={0}
            max={25000}
          />
        </div>
        <div className="rating_slider">
          <label>Rating</label>
          <Slider
            getAriaLabel={() => "Rating Range"}
            value={rating}
            onChange={handleRatingChange}
            valueLabelDisplay="auto"
            getAriaValueText={valuetext}
            aria-labelledby="range-slider"
            min={0}
            max={5}
          />
        </div>
      </div>

      <div className="product_wrapper">
        {productState.status === "LOADING" ? (
          <Loader />
        ) : (
          <>
            {productState?.products.length === 0 ? (
              <h1>No Products</h1>
            ) : (
              <div className="products_container">
                {productState.products.map((product) => (
                  <ProductCard product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Products;
