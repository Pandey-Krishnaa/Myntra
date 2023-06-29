import "./App.css";
import Login from "./components/auth/Login";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUserByTokenThunk } from "./store/userAuthSlice";

import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainPage from "./components/MainPage";
import Home from "./components/home/Home";
import Profile from "./components/Profile/Profile";
import SignUp from "./components/auth/SignUp";
import ProfileDetails from "./components/Profile/ProfileDetails";
import ChangeProfile from "./components/Profile/ChangeProfile";
import Admin from "./components/admin/Admin";
import AllOrders from "./components/admin/AllOrders";
import ProductForm from "./components/admin/ProductForm";
import AllProducts from "./components/admin/AllProducts";

import Products from "./components/products/Products";
import { getAllProductThunk } from "./store/productsSlice";
import ProductDetails from "./components/products/ProductDetails";
import { loadCart } from "./store/cartSlice";
import Cart from "./components/cart/Cart";
import SearchResult from "./components/searchResults/SearchResult";
import OtpVarification from "./components/auth/OtpVarification";
import ProfileUpdate from "./components/Profile/ProfileUpdate";
import ChangePassword from "./components/Profile/ChangePassword";
import ForgetPassword from "./components/Profile/ForgetPassword";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
    children: [
      { path: "", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },

      {
        path: "profile",
        element: <Profile />,
        children: [
          {
            path: "overview",
            element: <ProfileDetails />,
          },
          {
            path: "change-profile",
            element: <ChangeProfile />,
          },
          {
            path: "edit-profile",
            element: <ProfileUpdate />,
          },
        ],
      },
      {
        path: "/verify",
        element: <OtpVarification />,
      },
      { path: "/change-password", element: <ChangePassword /> },
      { path: "/forget", element: <ForgetPassword /> },
      {
        path: "products/",
        element: <Products />,
        errorElement: <h1>oops something went wrong</h1>,
      },
      {
        path: "products/:id",
        element: <ProductDetails />,
        errorElement: <h1>error</h1>,
      },
      {
        path: "bag",
        element: <Cart />,
      },
      {
        path: "search/:keyword",
        element: <SearchResult />,
      },
    ],
  },
  {
    path: "/admin",
    element: <Admin />,
    children: [
      { path: "all-orders", element: <AllOrders /> },
      { path: "add-product", element: <ProductForm /> },
      { path: "products", element: <AllProducts /> },
    ],
  },
]);
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserByTokenThunk());
    dispatch(getAllProductThunk());
    dispatch(loadCart());
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App;
