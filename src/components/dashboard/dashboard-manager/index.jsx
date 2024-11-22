import React, { useState } from "react";
import { PieChartOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Link, Outlet } from "react-router-dom";

const { Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={`/dashboard-manager/${key}`}>{label}</Link>,
  };
}
const items = [
  getItem("Thông tin cá nhân", "profile", <PieChartOutlined />),
  getItem("Doanh thu", "over-view", <PieChartOutlined />),
  getItem("Quản lí người dùng", "manage-user", <PieChartOutlined />),
  getItem(
    "Quản lí doanh mục dịch vụ",
    "health-service-category",
    <PieChartOutlined />
  ),

  getItem("Quản lí doanh mục cá", "fish-category", <PieChartOutlined />),
  getItem(
    "Quản lí doanh mục vận chuyển",
    "manage-delivery",
    <PieChartOutlined />
  ),
  getItem("Quản lí phản hồi", "manage-feedback", <PieChartOutlined />),
  getItem("Quản lí báo cáo", "manage-report", <PieChartOutlined />),
];
const DashboarManager = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <>
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Sider
          width={290}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={items}
          />
        </Sider>
        <Layout>
          <Content
            style={{
              margin: "0 16px",
            }}
          >
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Outlet />
            </div>
          </Content>
          <Footer
            style={{
              textAlign: "center",
            }}
          >
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </>
  );
};
export default DashboarManager;
