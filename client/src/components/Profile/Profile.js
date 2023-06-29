import React from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, Outlet } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const user = useSelector((state) => state?.user);
  if (!user?.isAuthenticated) return <Navigate to="/login" />;
  else
    return (
      <div className="profile">
        <header>
          <h1>Account</h1>
          <p className="header_user_name">{user?.user?.name}</p>
        </header>
        <hr />
        <section className="profile_main">
          <div className="profile_sidebar">
            <Link className="profile_sidebar_links" to="overview">
              Overview
            </Link>
            <Link className="profile_sidebar_links">Orders and return</Link>
            <Link className="profile_sidebar_links" to="edit-profile">
              Edit Profile
            </Link>
            <Link className="profile_sidebar_links" to="change-profile">
              Change Profile Picture
            </Link>
            <Link className="profile_sidebar_links" to="/change-password">
              Change Password
            </Link>
          </div>
          <div className="profile_outlet_wrapper">
            <Outlet />
          </div>
        </section>
      </div>
    );
}

export default Profile;
