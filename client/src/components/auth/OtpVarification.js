import React, { useState } from "react";
import "./OtpVarification.css";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
function OtpVarification() {
  const userState = useSelector((state) => state.user);
  const [otp, setOtp] = useState(0);
  const navigate = useNavigate();
  const otpSubmitHandler = async (otp) => {
    try {
      console.log(otp);
      const res = await fetch(
        `${process.env.REACT_APP_EMAIL_VARIFICATION}${userState?.user?._id}`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      toast.success("Email varified");
      navigate("/profile/overview");
      window.location.reload();
      console.log(data);
    } catch (err) {
      toast.error(err.message || "something went wrong");
    }
  };
  return (
    <div className="otp_validation_wrapper">
      <div className="otp_validation_container">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            otpSubmitHandler(otp);
          }}
        >
          <input
            placeholder="Enter Your OTP..."
            onChange={(e) => {
              setOtp(e.target.value);
            }}
          />
          <button type="submit">Verify</button>
        </form>
      </div>
    </div>
  );
}

export default OtpVarification;
