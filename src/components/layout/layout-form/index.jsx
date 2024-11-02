import React from "react";
import { Layout } from "antd";
import "./index.scss";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const FormLayout = ({ title, children }) => {
  return (
    <Layout className="form-layout">
      <Content className="form-layout-content">
        {title && <h1 className="form-layout-title">{title}</h1>}
        {children}
        <Outlet />
      </Content>
    </Layout>
  );
};

export default FormLayout;
