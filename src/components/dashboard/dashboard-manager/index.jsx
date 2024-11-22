import React, { useState } from "react";
import { PieChartOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Link, Outlet } from "react-router-dom";
import Header from "../../header";

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
  getItem("Profile", "profile", <PieChartOutlined />),
  getItem("Overview Total", "over-view", <PieChartOutlined />),
  getItem("Manage Users", "manage-user", <PieChartOutlined />),
  getItem(
    "Manage Health Service Category",
    "health-service-category",
    <PieChartOutlined />
  ),

  getItem("Manage Fish Categories", "fish-category", <PieChartOutlined />),
  getItem("Manage Delivery", "manage-delivery", <PieChartOutlined />),
  getItem("Manage Feedback", "manage-feedback", <PieChartOutlined />),
  getItem("Manage Report", "manage-report", <PieChartOutlined />),

];
const DashboarManager = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <>
      <Header />
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
