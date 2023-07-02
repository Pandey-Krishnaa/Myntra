import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../../store/userAuthSlice";
import { Link, Navigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [user, setUser] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state?.user?.isAuthenticated);
  if (isLoggedIn) return <Navigate to="/" />;
  else
    return (
      <div className="login_wrapper">
        <form
          className="login_form "
          onSubmit={(e) => {
            e.preventDefault();
            dispatch(loginThunk(user.email, user.password));
          }}
        >
          <h1 className="login_heading">LOGIN</h1>
          <input
            onChange={(e) => {
              e.preventDefault();
              setUser({ ...user, email: e.target.value });
            }}
            placeholder="Email"
            className="login_input"
          />
          <input
            onChange={(e) => {
              e.preventDefault();
              setUser({ ...user, password: e.target.value });
            }}
            placeholder="Password"
            className="login_input"
          />
          <button type="submit" className="login_btn">
            LOGIN
          </button>

          <Link to="/forget" className="forget_password_link">
            Forget Password
          </Link>
          <Link to="/signup" className="forget_password_link">
            Don't have an account ?
          </Link>
        </form>
      </div>
    );
}

export default Login;
