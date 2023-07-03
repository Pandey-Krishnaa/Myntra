import React from "react";
import { useSelector } from "react-redux";
import CartCard from "./CartCard";
import "./Cart.css";
function Cart() {
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
        <h1>SUMMARY</h1>
        <h3>Total {products.length} item</h3>
        <h3>Total Amount : ₹{totalAmount}</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Total Price</th>
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
        <button className="btn btn-success">
          Secure Your Order By Payment
        </button>
      </div>
    </div>
  ) : (
    <h1>Cart is empty</h1>
  );
}

export default Cart;
