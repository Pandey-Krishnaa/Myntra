import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
const productSlice = createSlice({
  name: "products",
  initialState: {
    status: "IDLE",
    products: [],
  },
  reducers: {
    setStatus(state, action) {
      return { ...state, status: action.payload.status };
    },
    addProduct(state, action) {
      return {
        ...state,
        products: [...state.products, action.payload.product],
      };
    },
    addProducts(state, action) {
      return {
        ...state,
        products: [...action.payload.products],
      };
    },
  },
});
export const { addProduct, addProducts, setStatus } = productSlice.actions;
export default productSlice.reducer;
export function addProductThunk(product) {
  return async function (dispatch) {
    dispatch(setStatus({ status: "LOADING" }));
    const toastId = toast.loading("Adding Product...", {
      position: "bottom-center",
    });
    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("countInStock", product.countInStock);
      formData.append("brand", product.brand);
      formData.append("forWhom", product.forWhom);
      formData.append("category", product.category);

      const images = [];
      for (let i = 0; i < product.images.length; i++)
        images.push(product.images[i]);
      images.forEach((file, index) => {
        formData.append("images", file);
      });

      const res = await fetch(process.env.REACT_APP_ADD_PRODUCT_URL, {
        method: "post",
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
        body: formData,
      });
      console.log(res);
      const data = await res.json();
      console.log(data);
      dispatch(addProduct({ product: data.product }));
      toast.dismiss(toastId);
      toast.success("Product Added Successfully");
    } catch (err) {
      toast.error(err.messsage);
    }

    toast.dismiss(toastId);
    dispatch(setStatus({ status: "IDLE" }));
  };
}
export function getAllProductThunk() {
  return async function (dispatch) {
    dispatch(setStatus({ status: "LOADING" }));
    try {
      const res = await fetch(process.env.REACT_APP_GET_ALL_PRODUCTS_URL, {
        method: "get",
      });
      const data = await res.json();
      console.log(data);
      dispatch(addProducts({ products: data.products }));
    } catch (err) {
      console.log(err);
    }
    dispatch(setStatus({ status: "IDLE" }));
  };
}
