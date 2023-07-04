import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userAuthSlice";
import productsReducer from "./productsSlice";
import productReducer from "./productSlice";
import cartReducer from "./cartSlice";
import orderReducer from "./orderSlice";
const store = configureStore({
  reducer: {
    user: userReducer,
    products: productsReducer,
    product: productReducer,
    cart: cartReducer,
    order: orderReducer,
  },
});

export default store;
