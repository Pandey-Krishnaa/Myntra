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
import {
  getAllProductThunk,
  getFeaturedProductsThunk,
} from "./store/productsSlice";
import ProductDetails from "./components/products/ProductDetails";
import Cart from "./components/cart/Cart";

import OtpVarification from "./components/auth/OtpVarification";
import ProfileUpdate from "./components/Profile/ProfileUpdate";
import ChangePassword from "./components/Profile/ChangePassword";
import ForgetPassword from "./components/Profile/ForgetPassword";
import RemoveProduct from "./components/admin/RemoveProduct";
// import Checkout from "./components/cart/Checkout";
import { loadCart } from "./store/cartSlice";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Payment from "./components/cart/Payment";
import Orders from "./components/orders/Orders";
import PlaceOrder from "./components/cart/PlaceOrder";
import OrderDetail from "./components/orders/OrderDetail";
import UpdateProduct from "./components/admin/UpdateProduct";
import UpdateProductIdForm from "./components/admin/UpdateProductIdForm";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
    children: [
      { path: "", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },
      {
        path: "/orders",
        element: <Orders />,
      },
      {
        path: "/orders/:orderId",
        element: <OrderDetail />,
      },
      {
        path: "place-order",
        element: <PlaceOrder />,
      },
      {
        path: "place-order/payment/:orderId",
        element: <Payment />,
      },

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
      },
      {
        path: "bag",
        element: <Cart />,
      },
    ],
  },
  {
    path: "/admin",
    element: <Admin />,
    children: [
      { path: "all-orders", element: <AllOrders /> },
      { path: "all-orders/order/:orderId", element: <OrderDetail /> },
      { path: "add-product", element: <ProductForm /> },
      { path: "products", element: <AllProducts /> },
      { path: "products/update", element: <UpdateProductIdForm /> },
      { path: "products/update/:productId", element: <UpdateProduct /> },
      { path: "remove-product", element: <RemoveProduct /> },
    ],
  },
]);
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserByTokenThunk());
    dispatch(getAllProductThunk());
    dispatch(getFeaturedProductsThunk());
    dispatch(loadCart());
  }, [dispatch]);

  return (
    <Elements stripe={stripePromise}>
      <RouterProvider router={router} />
    </Elements>
  );
}

export default App;
