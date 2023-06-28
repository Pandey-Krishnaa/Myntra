import React from "react";
import "./CartItem.css";
import { useDispatch } from "react-redux";
import {
  decreaseQuantity,
  increaseQuantity,
  loadCart,
  removeItemFromCart,
} from "../../store/cartSlice";
function CartItem({ item }) {
  const dispatch = useDispatch();
  return (
    <div className="cart_item_wrapper">
      <div className="cart_item_image_wrapper">
        <img
          src={item?.images[0]?.url}
          className="cart_item_image"
          alt={item?.name}
        />
      </div>
      <div className="cart_item_details">
        <p>₹{item?.price}</p>
        <h3>{item?.name}</h3>
        <p>{item?.description}</p>
        <div className="product_quatity_wrapper">
          <button
            className="product_quantity_btn"
            onClick={(e) => {
              e.preventDefault();
              dispatch(decreaseQuantity({ id: item._id }));
              dispatch(loadCart());
            }}
          >
            -
          </button>
          <input
            value={item?.quantity}
            min={1}
            max={item?.countInStock}
            disabled
            className="product_quantity_input"
          />
          <button
            className="product_quantity_btn"
            onClick={(e) => {
              e.preventDefault();
              dispatch(increaseQuantity({ id: item._id }));
              dispatch(loadCart());
            }}
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          dispatch(removeItemFromCart({ id: item._id }));
        }}
        className="cart_item_remove_btn"
      >
        <i class="fa fa-times" aria-hidden="true"></i>
      </button>
    </div>
  );
}

export default CartItem;
