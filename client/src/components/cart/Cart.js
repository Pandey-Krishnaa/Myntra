import React from "react";
import { useSelector } from "react-redux";
import CartItem from "./CartItem";
import { Link } from "react-router-dom";
import "./Cart.css";
function Cart() {
  const cart = useSelector((state) => state.cart);
  let cartTotal = 0;
  cart.forEach((item) => (cartTotal += item.price * item.quantity));
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
          <button className="btn btn-success">CheckOut</button>
        </div>
      )}
    </div>
  );
}

export default Cart;
