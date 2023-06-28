import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Nav from "./navbar/Nav";
import { Toaster } from "react-hot-toast";

function MainPage() {
  return (
    <div>
      <Nav />
      <Outlet />

      <Toaster position="top-center" />
    </div>
  );
}

export default MainPage;
