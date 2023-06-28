import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userAuthSlice";
import productReducer from "./productsSlice";
import cartReducer from "./cartSlice";
const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    cart: cartReducer,
  },
});

export default store;
