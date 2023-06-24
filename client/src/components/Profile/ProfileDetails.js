import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
function ProfileDetails() {
  const user = useSelector((state) => state?.user);

  return (
    <div className="profile_detail">
      <table>
        <tr className="profile_avatar_cell">
          <img
            src={user.user.avatar.url}
            width="100px"
            className="profile_avatar"
          />
        </tr>
        <tr>
          <td>Name</td>
          <td>{user.user.name}</td>
        </tr>
        <tr>
          <td>Email</td>
          <td>{user.user.email}</td>
        </tr>
        <tr>
          <td>Gender</td>
          <td>Male</td>
        </tr>
        <tr>
          <td>Verified Email</td>
          <td>{user.user.isEmailVarified ? "Yes" : <Link>Varify It</Link>}</td>
        </tr>
      </table>
    </div>
  );
}

export default ProfileDetails;
