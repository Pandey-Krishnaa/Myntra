import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userAuthSlice";
import productReducer from "./productsSlice";
const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
  },
});

export default store;
