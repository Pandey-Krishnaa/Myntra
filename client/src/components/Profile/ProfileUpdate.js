import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import "./ProfileUpdate.css";
import { toast } from "react-hot-toast";
import { updateProfileInfo } from "../../store/userAuthSlice";
function ProfileUpdate() {
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [editName, setEditName] = useState(true);
  const [name, setName] = useState(userState?.user?.name);
  const [loading, setLoading] = useState(false);
  if (!userState?.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    if (name?.length < 3)
      return toast.error("name should have atleast 3 character");
    if (name && name === userState?.user?.name)
      return toast.error("new name should be different than previous one.");
    dispatch(updateProfileInfo({ name }));
  };

  return (
    <div className="profile_update_wrapper">
      <table>
        <tbody>
          <tr className="profile_update_record">
            <td>Name</td>
            <td>
              <input
                value={name}
                disabled={editName}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </td>
            <td>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setEditName(!editName);
                }}
                className="edit_done_btn"
              >
                {editName ? (
                  <i className="fa-solid fa-pen-to-square"></i>
                ) : (
                  <i className="fa-sharp fa-solid fa-square-check"></i>
                )}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <button
        className="btn btn-success"
        onClick={(e) => {
          submitHandler(e);
        }}
        disabled={loading}
      >
        Update
      </button>
    </div>
  );
}

export default ProfileUpdate;
