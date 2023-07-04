import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePasswordThunk } from "../../store/userAuthSlice";
import "./ChangePassword.css";
function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.status);
  const onSubmitHandler = (info) => {
    dispatch(changePasswordThunk(info, clearFeilds));
  };
  const clearFeilds = () => {
    setNewPassword("");
    setOldPassword("");
  };
  return (
    <div className="change_password_wrapper">
      <form
        className="change_password_container"
        value={oldPassword}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitHandler({ newPassword, oldPassword });
        }}
      >
        <input
          type="text"
          placeholder="OLD PASSWORD..."
          value={oldPassword}
          onChange={(e) => {
            setOldPassword(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="NEW PASSWORD..."
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
          }}
        />
        <button type="submit" disabled={isLoading === "LOADING"}>
          Change Password
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
