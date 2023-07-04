import React from "react";
import "./ProductCard.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { addToCart, loadCart } from "../../store/cartSlice";
import toast from "react-hot-toast";
import { addToCart, loadCart } from "../../store/cartSlice";
function ProductCard({ product }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  return (
    <Link to={`/products/${product?._id}`} style={{ textDecoration: "none" }}>
      <div className="card" style={{ width: "18rem" }}>
        <img
          className="card-img-top product_card_img"
          src={product?.images[0]?.url}
          alt={product?.name}
        />
        <div className="card-body">
          <p className="card-text">
            {product?.countInStock > 0 ? "In Stock" : "Out Of Stock"}
          </p>
          <h5 className="card-title">{product?.name}</h5>
          <p className="card-text">{product?.description}</p>
          <p className="card-text">₹{product?.price}</p>
        </div>
        {user?.isAuthenticated && user?.user?.role !== "admin" ? (
          <button
            className="product_card_add_to_cart_btn"
            onClick={(e) => {
              e.preventDefault();
              const item = { ...product };
              item.quantity = 1;

              dispatch(addToCart({ item }));
              dispatch(loadCart());
              toast.success("Added To Cart..");
            }}
          >
            ADD TO CART
          </button>
        ) : (
          ""
        )}
      </div>
    </Link>
  );
}

export default ProductCard;
