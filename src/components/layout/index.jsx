import React from "react";
import Header from "../header";

import { Outlet } from "react-router-dom";
import AppFooter from "../footer";

function Layout() {
  return (
    <div>
      <Header />
      <div
        className="main-content"
        style={{
          padding: "0",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </div>
      <AppFooter />
    </div>
  );
}

export default Layout;
