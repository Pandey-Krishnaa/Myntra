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
import ProductCard from "./components/products/ProductCard";
import Products from "./components/products/Products";
import { getAllProductThunk } from "./store/productsSlice";
import ProductDetails from "./components/products/ProductDetails";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
    children: [
      { path: "", element: <Home /> },
      { path: "login", element: <Login /> },
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
        ],
      },
      { path: "signup", element: <SignUp /> },
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
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App;
