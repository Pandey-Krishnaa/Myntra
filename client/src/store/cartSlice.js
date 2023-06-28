import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addToCart(state, action) {
      const cart = localStorage.getItem("cart");
      if (!cart) {
        action.payload.product.quantity = action.payload.quantity;
        localStorage.setItem("cart", JSON.stringify([action.payload.product]));
        // console.log(cart);
      } else {
        const data = JSON.parse(localStorage.getItem("cart"));
        let isPresent = false;
        for (let i = 0; i < data.length; i++) {
          if (data[i]._id === action.payload.product._id) {
            isPresent = true;
            data[i].quantity =
              data[i].quantity + action.payload.quantity >
              action.payload.product.countInStock
                ? action.payload.product.countInStock
                : data[i].quantity + action.payload.quantity;
            console.log(data[i]);
            break;
          }
        }
        if (!isPresent) {
          action.payload.product.quantity = action.payload.quantity;
          data.push(action.payload.product);
        }
        localStorage.setItem("cart", JSON.stringify(data));
      }
    },
    loadCart() {
      const data = JSON.parse(localStorage.getItem("cart")) || [];
      return [...data];
    },
    removeItemFromCart(state, action) {
      const data = state.filter((item) => item._id !== action.payload.id);
      localStorage.setItem("cart", JSON.stringify(data));
      return [...data];
    },
    increaseQuantity(state, action) {
      const data = JSON.parse(localStorage.getItem("cart")) || [];
      let el = -1;
      for (let i = 0; i < data.length; i++) {
        if (data[i]._id === action.payload.id) {
          el = i;
          break;
        }
      }
      if (el !== -1 && data[el].quantity < data[el].countInStock) {
        data[el].quantity += 1;
      }
      localStorage.setItem("cart", JSON.stringify(data));
    },
    decreaseQuantity(state, action) {
      const data = JSON.parse(localStorage.getItem("cart")) || [];
      let el = -1;
      for (let i = 0; i < data.length; i++) {
        if (data[i]._id === action.payload.id) {
          el = i;
          break;
        }
      }
      if (el !== -1 && data[el].quantity > 1) {
        data[el].quantity -= 1;
      }
      localStorage.setItem("cart", JSON.stringify(data));
    },
  },
});

export const {
  addToCart,
  loadCart,
  removeItemFromCart,
  increaseQuantity,
  decreaseQuantity,
} = slice.actions;
export default slice.reducer;
