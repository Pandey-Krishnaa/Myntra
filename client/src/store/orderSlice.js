import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
const slice = createSlice({
  name: "order",
  initialState: {
    status: "IDLE",
    orders: [],
    allOrders: [],
  },
  reducers: {
    setOrders(state, action) {
      return { ...state, orders: action.payload.orders };
    },
    setStatus(state, action) {
      return { ...state, status: action.payload.status };
    },
    setAllOrders(state, action) {
      return { ...state, allOrders: action.payload.orders };
    },
  },
});

export const { setOrders, setStatus, setAllOrders } = slice.actions;
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

export const getAllOrderAdminThunk = () => {
  return async function (dispatch) {
    dispatch(setStatus({ status: "LOADING" }));
    try {
      const res = await fetch(
        `${process.env.REACT_APP_ORDER_URL}/get-all-orders`,
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "something went wrong");
      dispatch(setAllOrders({ orders: data.orders }));
    } catch (err) {
      toast.error(err.message);
    }
    dispatch(setStatus({ status: "IDLE" }));
  };
};

export const updateOrderStatusThunk = (orderId, orderStatus) => {
  return async function (dispatch) {
    dispatch(setStatus({ status: "LOADING" }));
    try {
      const res = await fetch(
        `${process.env.REACT_APP_ORDER_URL}/update-order-status/${orderId}`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({ orderStatus }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "something went wrong");
      dispatch(getAllOrderAdminThunk());
      toast.success("order updated successfully...");
    } catch (err) {
      toast.error(err.message);
    }

    dispatch(setStatus({ status: "IDLE" }));
  };
};
