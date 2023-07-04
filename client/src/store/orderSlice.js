import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
const slice = createSlice({
  name: "order",
  initialState: {
    status: "IDLE",
    orders: [],
  },
  reducers: {
    setOrders(state, action) {
      return { ...state, orders: action.payload.orders };
    },
    setStatus(state, action) {
      return { ...state, status: action.payload.status };
    },
  },
});

export const { setOrders, setStatus } = slice.actions;
export default slice.reducer;

export const getMyOrdersThunk = () => {
  return async function (dispatch) {
    dispatch(setStatus({ status: "LOADING" }));
    try {
      const res = await fetch(process.env.REACT_APP_ORDER_URL, {
        method: "get",
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      console.log(data);
      dispatch(setOrders({ orders: data.myOrders }));
    } catch (err) {
      console.log(err);
    }
    dispatch(setStatus({ status: "IDLE" }));
  };
};

export const placeOrderThunk = (body, navigateToPayment) => {
  return async function (dispatch) {
    const toastId = toast.loading("placing your order...");
    dispatch(setStatus({ status: "LOADING" }));
    try {
      const res = await fetch(process.env.REACT_APP_ORDER_URL, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      dispatch(getMyOrdersThunk());
      localStorage.setItem("cart", JSON.stringify([]));
      toast.dismiss(toastId);
      toast.success("order placed");
      navigateToPayment(data.order._id);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.message);
    }
    dispatch(setStatus({ status: "IDLE" }));
  };
};

export const summurizeOrder = (id) => {
  return async function (dispatch) {
    try {
    } catch (err) {}
  };
};
