import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userAuthSlice";
import productsReducer from "./productsSlice";
import productReducer from "./productSlice";
import cartReducer from "./cartSlice";
const store = configureStore({
  reducer: {
    user: userReducer,
    products: productsReducer,
    product: productReducer,
    cart: cartReducer,
  },
});

export default store;
