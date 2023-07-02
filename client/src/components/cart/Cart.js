import React from "react";
import { useSelector } from "react-redux";
import CartItem from "./CartItem";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  let cartTotal = 0;

  cart.forEach((item) => (cartTotal += item.price * item.quantity));
  const checkoutHandler = async (e) => {
    e.preventDefault();
    navigate("/bag/checkout");
    // const toastId = toast.loading("redirecting you to payment page");
    // try {
    //   fetch();
    // } catch (err) {}
  };
  return (
    <div className="cart_wrapper">
      {cart.length === 0 && (
        <>
          <h1>Cart is Empty</h1>
          <Link to="/products">Find Something for you</Link>
        </>
      )}
      {cart.map((item) => (
        <CartItem item={item} />
      ))}
      {cart.length > 0 && (
        <div className="cart_total_feild">
          <h3>Grand Total : ₹{cartTotal}</h3>
          <button
            className="btn btn-success"
            onClick={(e) => {
              checkoutHandler(e);
            }}
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
