import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./ProfileDetails.css";
function ProfileDetails() {
  const user = useSelector((state) => state?.user);

  return (
    <div className="profile_detail_wrapper">
      <table className="table">
        <thead>
          <th>
            <td>
              <img
                src={user?.user?.avatar?.url}
                className="profile_avatar"
                alt={user?.user?.avatar?.public_id}
              />
            </td>
          </th>
        </thead>
        <tbody>
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
        </tbody>
      </table>
    </div>
  );
}

export default ProfileDetails;
