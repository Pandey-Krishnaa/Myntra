import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, Outlet } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const user = useSelector((state) => state?.user);
  const [showSidebar, setShowSidebar] = useState(true);
  const profile_sidebar_btn_class = showSidebar
    ? "fa fa-times profile_sidebar_btn"
    : "fa fa-bars profile_sidebar_btn";
  if (!user?.isAuthenticated) return <Navigate to="/login" />;
  else
    return (
      <div className="profile">
        <header>
          <h1>Account</h1>
          <p className="header_user_name">{user?.user?.name}</p>
          <i
            className={profile_sidebar_btn_class}
            onClick={() => {
              setShowSidebar(!showSidebar);
            }}
          ></i>
        </header>
        <hr />
        <section className="profile_main">
          {showSidebar && (
            <div className="profile_sidebar">
              <Link className="profile_sidebar_links" to="overview">
                <span className="desktop_view_profile">Overview</span>
              </Link>
              <Link className="profile_sidebar_links" to="/orders">
                <span className="desktop_view_profile">Orders</span>
              </Link>
              <Link className="profile_sidebar_links" to="edit-profile">
                <span className="desktop_view_profile">Edit Profile</span>
                <span className="mobile_view_profile">
                  <i class="fa fa-user-edit"></i>
                </span>
              </Link>
              <Link className="profile_sidebar_links" to="change-profile">
                <span className="desktop_view_profile">Change Profile</span>
              </Link>
              <Link className="profile_sidebar_links" to="/change-password">
                <span className="desktop_view_profile">Change Password</span>
              </Link>
            </div>
          )}
          <div className="profile_outlet_wrapper">
            <Outlet />
          </div>
        </section>
      </div>
    );
}

export default Profile;
