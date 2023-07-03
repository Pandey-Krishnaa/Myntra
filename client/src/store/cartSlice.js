import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addToCart(state, action) {
      let cart = localStorage.getItem("cart");
      if (!cart) {
        cart = [action.payload.item];
        localStorage.setItem("cart", JSON.stringify([action.payload.item]));
      } else {
        cart = JSON.parse(cart);
        console.log(cart);
        const data = cart.filter(
          (item) => item._id === action.payload.item._id
        );
        if (data.length === 0) {
          cart.push(action.payload.item);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
      }
      return [...cart];
    },
    updateQuantity(state, action) {
      //   console.log("updating cart");
      console.log(action.payload);
      const cart = JSON.parse(localStorage.getItem("cart"));
      for (let i = 0; i < cart.length; i++) {
        if (cart[i]._id === action.payload.id) {
          cart[i].quantity = action.payload.quantity;
          break;
        }
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      return [...cart];
    },
    loadCart(state) {
      const cart = localStorage.getItem("cart");

      if (!cart) return [];
      else {
        const data = JSON.parse(cart);
        return [...data];
      }
    },
    removeItem(state, action) {
      let cart = JSON.parse(localStorage.getItem("cart"));
      cart = cart.filter((item) => item._id !== action.payload.id);
      localStorage.setItem("cart", JSON.stringify(cart));
      return [...cart];
    },
  },
});

export const { addToCart, updateQuantity, loadCart, removeItem } =
  slice.actions;
export default slice.reducer;
