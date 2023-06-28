import React from "react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./SignUp.css";
import { signupThunk } from "../../store/userAuthSlice";
function SignUp() {
  const [user, setUser] = useState({
    email: "",
    password: "",
    name: "",
    avatar: null,
  });
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state?.user?.isAuthenticated);
  const navigate = useNavigate();
  const navigateToVarificationPageHandler = () => {
    navigate("/verification");
  };
  return isLoggedIn ? (
    <Navigate to="/profile" />
  ) : (
    <div className="signup_wrapper">
      <form
        className="signup_form "
        onSubmit={(e) => {
          e.preventDefault();
          dispatch(signupThunk(user, navigateToVarificationPageHandler));
        }}
      >
        <h1 className="signup_heading">SIGNUP</h1>
        <input
          onChange={(e) => {
            e.preventDefault();
            setUser({ ...user, name: e.target.value });
          }}
          placeholder="Name"
          className="signup_input"
        />
        <input
          onChange={(e) => {
            e.preventDefault();
            setUser({ ...user, email: e.target.value });
          }}
          placeholder="Email"
          className="signup_input"
        />
        <input
          onChange={(e) => {
            e.preventDefault();
            setUser({ ...user, password: e.target.value });
          }}
          placeholder="Password"
          className="signup_input"
        />
        <input
          type="file"
          onChange={(e) => {
            e.preventDefault();
            setUser({ ...user, avatar: e.target.files[0] });
          }}
        />

        <button type="submit" className="signup_btn">
          signup
        </button>

        <Link to="/login" className="login_link">
          Already have a account ? Login
        </Link>
      </form>
    </div>
  );
}

export default SignUp;
