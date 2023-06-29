import React from "react";
import { useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import "./Products.css";
import Loader from "../Loader";
function Products() {
  const productState = useSelector((state) => state.products);
  return productState.status === "LOADING" ? (
    <Loader />
  ) : (
    <div className="products">
      {productState.products.length === 0 ? (
        <h1>No Products</h1>
      ) : (
        productState.products.map((product) => (
          <ProductCard product={product} />
        ))
      )}
    </div>
  );
}

export default Products;
