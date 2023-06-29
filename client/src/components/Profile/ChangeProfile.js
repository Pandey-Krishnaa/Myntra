import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { changeProfieThunk } from "../../store/userAuthSlice";
import { useSelector } from "react-redux";
function ChangeProfile() {
  const [profileImage, setProfileImage] = useState(null);
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const submitHandler = async () => {
    const formData = new FormData();
    formData.append("avatar", profileImage);
    dispatch(changeProfieThunk(formData));
  };
  return (
    <div className="change_profile_picture_wrapper">
      <div className="change_profile_picture_container">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitHandler();
          }}
        >
          <input
            className="form-control form-control-lg"
            id="formFileLg"
            type="file"
            required
            onChange={(e) => {
              setProfileImage(e.target.files[0]);
            }}
          ></input>
          <button
            className="btn btn-success change_profile_btn my-4"
            type="submit"
            disabled={userState?.user?.status}
          >
            Update Profile Picture
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangeProfile;
