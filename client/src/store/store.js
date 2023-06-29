import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userAuthSlice";
import productsReducer from "./productsSlice";
import cartReducer from "./cartSlice";
import productReducer from "./productSlice";
const store = configureStore({
  reducer: {
    user: userReducer,
    products: productsReducer,
    cart: cartReducer,
    product: productReducer,
  },
});

export default store;
