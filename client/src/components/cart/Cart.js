import React from "react";
import { useSelector } from "react-redux";
import CartCard from "./CartCard";
import "./Cart.css";
import { Link, useNavigate } from "react-router-dom";
function Cart() {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const products = useSelector((state) => state.cart);
  let totalAmount = 0;
  products?.forEach(
    (product) => (totalAmount += product?.price * product?.quantity)
  );
  return products.length > 0 ? (
    <div className="cart">
      <div className="cart_items">
        {products.map((product) => (
          <CartCard item={product} />
        ))}
      </div>
      <div className="cart_checkout">
        <h4>SUMMARY</h4>
        <h5>Total {products.length} item</h5>
        <h5>Total Amount : ₹{totalAmount}</h5>
        <table className="table">
          <thead>
            <tr>
              <th className="table_head">Item</th>
              <th className="table_head">Quantity</th>
              <th className="table_head">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => {
              return (
                <tr>
                  <td>{product?.name}</td>
                  <td>x{product?.quantity}</td>
                  <td>₹{product?.quantity * product?.price}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button
          className="btn btn-success"
          onClick={(e) => {
            e.preventDefault();
            navigate("/place-order");
          }}
        >
          Place Order
        </button>
      </div>
    </div>
  ) : (
    <div className="empty_cart">
      <div className="empty_cart_container">
        <h1>Cart is empty :(</h1>
        <Link
          to={"/products"}
          style={{
            backgroundColor: "#ff3f6c",
            borderRadius: 0,
            padding: "10px 20px",
            color: "white",
            textDecoration: "none",
          }}
        >
          Find Something for you
        </Link>
      </div>
    </div>
  );
}

export default Cart;
