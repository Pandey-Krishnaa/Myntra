import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
const slice = createSlice({
  name: "product",
  initialState: {
    status: "IDLE",
    product: null,
    err: null,
  },
  reducers: {
    setProduct(state, action) {
      return { ...state, product: action.payload.product };
    },
    setStatus(state, action) {
      return { ...state, status: action.payload.status };
    },
    setError(state, action) {
      return { ...state, err: action.payload.err };
    },
    removeProduct(state) {
      return { ...state, product: null };
    },
    removeErr(state) {
      return { ...state, err: null };
    },
    loop(state) {
      state.product.reviews.forEach((r) => console.log(r));
      return state;
    },
  },
});

export const {
  setProduct,
  setStatus,
  setError,
  removeProduct,
  removeErr,
  loop,
} = slice.actions;
export default slice.reducer;
export const fetchProductThunk = (productId) => {
  return async function (dispatch) {
    dispatch(setStatus({ status: "LOADING" }));
    try {
      const res = await fetch(
        `${process.env.REACT_APP_GET_ALL_PRODUCTS_URL}/${productId}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      dispatch(setProduct({ product: data.product }));
    } catch (err) {
      dispatch(setError({ err }));
    }
    dispatch(setStatus({ status: "IDLE" }));
  };
};

export const postReviewThunk = (info, product_id, onClickHandler) => {
  return async function (dispatch) {
    dispatch(setStatus({ status: "LOADING" }));
    const toastId = toast.loading("posting review...");
    try {
      const res = await fetch(
        `${process.env.REACT_APP_REVIEW_ROOT_URL}/${product_id}`,
        {
          method: "post",

          headers: {
            "x-auth-token": localStorage.getItem("token"),
            "Content-Type": "application/json",
          },

          body: JSON.stringify(info),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw Error(data.message);
      }
      dispatch(fetchProductThunk(product_id));
      toast.dismiss(toastId);
      toast.success("review posted...");
      onClickHandler();
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.message);
    }
  };
};

export const deleteReviewThunk = (productId, reviewId) => {
  return async function (dispatch) {
    const toastId = toast.loading("deleting review");
    try {
      const res = await fetch(
        `${process.env.REACT_APP_REVIEW_ROOT_URL}/${reviewId}`,
        {
          method: "delete",
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      const data = await res.json();
      if (!res.ok) throw Error(data.message);
      dispatch(fetchProductThunk(productId));
      toast.dismiss(toastId);
      toast.success("review deleted");
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.message);
    }
  };
};
