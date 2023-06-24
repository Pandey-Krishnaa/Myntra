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
    ],
  },
]);
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserByTokenThunk());
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App;
