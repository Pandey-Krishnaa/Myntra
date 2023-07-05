import React, { useEffect, useState } from "react";
import "./OtpVarification.css";
import { useDispatch, useSelector } from "react-redux";

import { Navigate } from "react-router-dom";
import {
  emailVerificationThunk,
  sendOtpEmailHandler,
} from "../../store/userAuthSlice";

function OtpVarification() {
  const userState = useSelector((state) => state.user);
  const [otp, setOtp] = useState(0);
  const dispatch = useDispatch();
  const [showResendBtn, setShowResendBtn] = useState(
    !(userState?.status === "LOADING")
  );

  const setTimoutHandlerForShowResendBtn = () => {
    setTimeout(() => {
      setShowResendBtn(true);
    }, 30000);
  };

  useEffect(() => {
    setTimoutHandlerForShowResendBtn();
  }, []);

  if (!userState?.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return userState?.user?.isEmailVarified ? (
    <>
      <h1>You are already verified user</h1>
      <Navigate to="/profile/overview" />
    </>
  ) : (
    <>
      <div className="otp_validation_wrapper">
        <div className="otp_validation_container">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              dispatch(emailVerificationThunk(otp, userState?.user?._id));
            }}
          >
            <input
              placeholder="Enter Your OTP..."
              onChange={(e) => {
                setOtp(e.target.value);
              }}
              type="number"
              className="otp_input"
            />
            <div className="otp_validation_btns">
              <button
                type="submit"
                className="btn btn-success my-3"
                disabled={userState?.status === "LOADING"}
              >
                {userState?.status === "LOADING" ? "Verifying..." : "Verify"}
              </button>
              <button
                className="btn btn-primary "
                disabled={!showResendBtn}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(
                    sendOtpEmailHandler(
                      userState?.user?.email,
                      "emailVerification"
                    )
                  );
                  setShowResendBtn(false);
                  setTimoutHandlerForShowResendBtn();
                }}
              >
                Send Otp
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default OtpVarification;
