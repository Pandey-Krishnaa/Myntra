import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./ProfileDetails.css";
function ProfileDetails() {
  const user = useSelector((state) => state?.user);

  return (
    <div className="profile_detail_wrapper">
      <table className="table">
        <tr className="profile_avatar_cell">
          <img
            src={user?.user?.avatar?.url}
            width="100px"
            className="profile_avatar"
          />
        </tr>
        <tr className="profile_details_record_row">
          <td>Name</td>
          <td>{user.user.name}</td>
        </tr>
        <tr className="profile_details_record_row">
          <td>Email</td>
          <td>{user.user.email}</td>
        </tr>
        <tr className="profile_details_record_row">
          <td>Verified Email</td>
          <td>
            {user.user.isEmailVarified ? (
              "Yes"
            ) : (
              <Link to="/verify">Click Here to verify</Link>
            )}
          </td>
        </tr>
      </table>
    </div>
  );
}

export default ProfileDetails;
