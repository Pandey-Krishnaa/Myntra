import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  resetPasswordThunk,
  sendOtpEmailHandler,
} from "../../store/userAuthSlice";
import { useNavigate } from "react-router-dom";
import "./ForgetPassword.css";
function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState();
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const status = useSelector((state) => state.user.status);
  const navigateToLoginPageHandler = () => {
    navigate("/login");
  };
  const sendOtpHandler = (email) => {
    if (email.length < 3 || !email.includes("@") || !email.includes("."))
      return toast.error("invalid email, please enter a proper email...");
    dispatch(sendOtpEmailHandler(email, "resetPassword", lockEmailHandler));
  };
  const [lockEmail, setLockEmail] = useState(false);
  const lockEmailHandler = (value) => {
    setLockEmail(value);
  };

  return (
    <div className="forget_password_wrapper">
      <form>
        <input
          type="email"
          placeholder="enter your email..."
          required
          value={email}
          disabled={lockEmail}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        {lockEmail ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              lockEmailHandler(false);
            }}
            disabled={status === "LOADING"}
          >
            Change Email
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              sendOtpHandler(email, lockEmailHandler);
            }}
            disabled={status === "LOADING"}
          >
            Send OTP
          </button>
        )}
        <input
          type="number"
          placeholder="enter otp..."
          required
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="enter new password..."
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            if (otp?.length < 6 || password?.length < 8)
              return toast.error("please fill proper input..");
            dispatch(
              resetPasswordThunk(
                { otp, password },
                email,
                navigateToLoginPageHandler
              )
            );
          }}
          disabled={status === "LOADING"}
        >
          Change Password
        </button>
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            sendOtpHandler(email);
          }}
          disabled={status === "LOADING"}
        >
          Resend OTP
        </button>
      </form>
    </div>
  );
}

export default ForgetPassword;
