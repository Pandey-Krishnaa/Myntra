import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  resetPasswordThunk,
  sendOtpEmailHandler,
} from "../../store/userAuthSlice";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState();
  const [password, setPassword] = useState("");
  const [isVerifiedEmail, setIsVerifiedEmail] = useState(false);
  const dispatch = useDispatch();
  const sendOtpHandler = (email) => {
    if (email.length < 3 || !email.includes("@") || !email.includes("."))
      return toast.error("invalid email, please enter a proper email...");
    dispatch(sendOtpEmailHandler(email, "resetPassword"));
  };
  const verifyOtpHandler = (otp) => {};
  return (
    <div className="forget_password_wrapper">
      <form>
        <input
          type="email"
          placeholder="enter your email..."
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            sendOtpHandler(email);
          }}
        >
          Send OTP
        </button>
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
            dispatch(resetPasswordThunk({ otp, password }, email));
          }}
        >
          Change Password
        </button>
      </form>
    </div>
  );
}

export default ForgetPassword;
