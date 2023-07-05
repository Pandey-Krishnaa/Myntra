import React from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Nav from "../navbar/Nav";
import "./Admin.css";
import { Toaster } from "react-hot-toast";
function Admin() {
  const user = useSelector((state) => state.user);
  if (user?.isAuthenticated && user?.user?.role)
    return (
      <>
        <Nav />
        <div className="admin">
          <div className="admin_sidebar">
            <div className="admin_sidebar_item admin_sidebar_products ">
              <h5 className="admin_sidebar_item_heading">Products</h5>
              <Link className="admin_sidebar_links" to="products">
                All Products
              </Link>
              <Link className="admin_sidebar_links" to="add-product">
                Add Product
              </Link>

              <Link className="admin_sidebar_links" to="remove-product">
                Remove Product
              </Link>
              <Link className="admin_sidebar_links" to={"products/update"}>
                Update Product
              </Link>
            </div>
            <div className="admin_sidebar_item admin_sidebar_products">
              <h5 className="admin_sidebar_item_heading">Orders</h5>
              <Link className="admin_sidebar_links" to="all-orders">
                All Orders
              </Link>
              <Link className="admin_sidebar_links">Update Order</Link>
            </div>
          </div>
          <div className="admin_main">{<Outlet />}</div>
        </div>
        <Toaster position="top-center" />
      </>
    );
  else return <Navigate to="/" />;
}

export default Admin;
