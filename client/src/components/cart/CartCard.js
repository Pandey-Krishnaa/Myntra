import React, { useEffect, useState } from "react";
import "./CartCard.css";
import { useDispatch } from "react-redux";
import { loadCart, removeItem, updateQuantity } from "../../store/cartSlice";
function CartCard({ item }) {
  const dispatch = useDispatch();

  const [productQuantity, setProductQuantity] = useState(item.quantity);
  useEffect(() => {
    dispatch(updateQuantity({ id: item._id, quantity: productQuantity }));
  }, [productQuantity]);
  const quantites = [];
  for (let i = 1; i <= item?.countInStock; i++) quantites.push(i);
  return (
    <div className="cart_card">
      <div className="cart_card_image">
        <img src={item?.images[0]?.url} />
      </div>
      <div className="cart_card_details">
        <h5>{item?.name}</h5>
        <h4>₹{item?.price}</h4>
        <div className="product_quatity_wrapper">
          <select
            aria-label="Default select example"
            className=" form-select quantity_selector"
            onChange={(e) => {
              setProductQuantity(e.target.value);
            }}
          >
            {quantites.map((quan) => (
              <option value={quan} selected={quan == productQuantity}>
                {quan}
              </option>
            ))}
          </select>
        </div>
      </div>
      <i
        className="fa fa-times remove_cart_item"
        onClick={(e) => {
          dispatch(removeItem({ id: item._id }));
          //   dispatch(loadCart());
        }}
      ></i>
    </div>
  );
}

export default CartCard;
