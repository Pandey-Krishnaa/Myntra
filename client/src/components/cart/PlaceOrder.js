import React, { useEffect, useState } from "react";
import "./PlaceOrder.css";
import { useDispatch } from "react-redux";
import { placeOrderThunk } from "../../store/orderSlice";
import { useNavigate } from "react-router-dom";
function calculateTotalAmount() {
  let amount = 0;
  const items = JSON.parse(localStorage.getItem("cart"));
  items.forEach((item) => (amount += item.price * item.quantity));
  return amount;
}
function PlaceOrder() {
  const [landmark, setLandmark] = useState("");
  const [district, setDistrict] = useState("");
  const [userState, setUserState] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();
  const navigateToPayment = (id) => {
    navigate(`/place-order/payment/${id}`);
  };
  const [items, setItems] = useState([]);
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const items = cart.map((item) => {
      return { product_id: item._id, quantity: item.quantity };
    });
    setItems(items);
    setTotalAmount(calculateTotalAmount());
  }, []);
  const dispatch = useDispatch();

  const submitHandler = async () => {
    const address = {
      landmark,
      district,
      state: userState,
    };
    const body = { address, items, totalAmount };
    dispatch(placeOrderThunk(body, navigateToPayment));
  };
  return (
    <div className="place_order_wrapper">
      {items.length === 0 ? (
        <h1>Nothing is selected to place order</h1>
      ) : (
        <>
          <h3>Fill Your Address Details</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitHandler();
            }}
            className="place_order_form"
          >
            <input
              placeholder="enter your landmark..."
              required
              value={landmark}
              onChange={(e) => {
                setLandmark(e.target.value);
              }}
            />
            <input
              placeholder="enter your district..."
              value={district}
              required
              onChange={(e) => {
                setDistrict(e.target.value);
              }}
            />
            <input
              value={userState}
              placeholder="enter your state..."
              required
              onChange={(e) => {
                setUserState(e.target.value);
              }}
            />
            <button className="place_order_btn">Confirm Order</button>
          </form>
        </>
      )}
    </div>
  );
}

export default PlaceOrder;
