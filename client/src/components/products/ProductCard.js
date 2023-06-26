import React from "react";
import "./ProductCard.css";
import { Link } from "react-router-dom";
function ProductCard({ product }) {
  return (
    <Link to={product._id}>
      <div className="card" style={{ width: "18rem" }}>
        <img
          className="card-img-top"
          src={product.images[0].url}
          alt="Card image cap"
        />
        <div className="card-body">
          <h5 className="card-title">{product?.name}</h5>
          <p className="card-text">{product?.description}</p>
          <p className="card-text">{product?.price}</p>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
