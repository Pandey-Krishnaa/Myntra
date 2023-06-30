import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
const productSlice = createSlice({
  name: "products",
  initialState: {
    status: "IDLE",
    searchQuery: "",
    category: "",
    forWhom: "",
    priceRange: [0, 25000],
    ratingRange: [0, 5],
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
      console.log(action.payload.products);
      return {
        ...state,
        products: [...action.payload.products],
      };
    },
    setSearchQuery(state, action) {
      return { ...state, searchQuery: action.payload.query };
    },
    setCategory(state, action) {
      return { ...state, category: action.payload.category };
    },
    setForWhom(state, action) {
      return { ...state, forWhom: action.payload.forWhom };
    },
    setPriceRange(state, action) {
      return { ...state, priceRange: action.payload.range };
    },
    setRatingRange(state, action) {
      return { ...state, ratingRange: action.payload.range };
    },
  },
});
export const {
  addProduct,
  addProducts,
  setStatus,
  setSearchQuery,
  setCategory,
  setForWhom,
  setPriceRange,
  setRatingRange,
} = productSlice.actions;
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

      dispatch(addProducts({ products: data.products }));
    } catch (err) {
      console.log(err);
    }
    dispatch(setStatus({ status: "IDLE" }));
  };
}

export const filteredProductThunk = (
  search,
  category,
  forWhom,
  priceRange,
  ratingRange
) => {
  return async function (dispatch) {
    dispatch(setStatus({ status: "LOADING" }));
    try {
      let url = `${process.env.REACT_APP_GET_ALL_PRODUCTS_URL}?`;
      if (search) url = `${url}keyword=${search}`;
      if (category.length > 0) url += `&category=${category}`;
      if (forWhom.length > 0) url += `&forWhom=${forWhom}`;
      if (priceRange)
        url += `&price[gte]=${priceRange[0]}&price[lte]=${priceRange[1]}`;
      if (ratingRange)
        url += `&ratings[gte]=${ratingRange[0]}&ratings[lte]=${ratingRange[1]}`;
      console.log(url);
      const res = await fetch(url, { method: "get" });
      const data = await res.json();
      console.log(data);
      if (!res.ok) throw new Error(data.messsage);
      dispatch(addProducts({ products: data.products }));
    } catch (err) {}
    dispatch(setStatus({ status: "IDLE" }));
  };
};

export const removeProductThunk = (productId) => {
  return async function (dispatch) {
    const toastId = toast.loading("removing product...");
    dispatch(setStatus({ status: "LOADING" }));
    try {
      const res = await fetch(
        `${process.env.REACT_APP_PRODUCTS_BASE_URL}/${productId}`,
        {
          method: "delete",
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.messsage);
      toast.dismiss(toastId);
      toast.success(data.message);
      console.log(data);
      dispatch(getAllProductThunk());
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(err.messsage);
    }
    dispatch(setStatus({ status: "IDLE" }));
  };
};
