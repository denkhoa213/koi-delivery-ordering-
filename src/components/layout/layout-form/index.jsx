import React from "react";
import { Layout } from "antd";
import "./index.scss";
import { Outlet } from "react-router-dom";

const { Header, Content, Footer } = Layout;

const FormLayout = ({ title, children }) => {
  return (
    <Layout className="form-layout">
      <Content className="form-layout-content">
        {children} {/* Nội dung của form hoặc bất kỳ thành phần nào khác */}
        <Outlet />
      </Content>
    </Layout>
  );
};

export default FormLayout;
