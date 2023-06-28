import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../Loader";
import ProductCard from "../products/ProductCard";
import "./SearchResult.css";
function SearchResult() {
  const params = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_GET_ALL_PRODUCTS_URL}/?keyword=${params.keyword}`
        );
        const data = await res.json();
        setFilteredProducts(data.products);
      } catch (err) {
        setErr(err);
      }
      setLoading(false);
    }
    fetchProducts();
  }, [params.keyword]);
  if (loading) return <Loader />;
  if (err) return <h1>Something went wrong...</h1>;
  if (filteredProducts.length === 0)
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1>No Product Found.</h1>
      </div>
    );
  return (
    <div className="search_results_wrapper">
      <div className="search_results_filter"></div>
      <div className="search_results_container">
        {filteredProducts.map((product) => (
          <ProductCard product={product} key={product._id} />
        ))}
      </div>
    </div>
  );
}

export default SearchResult;
