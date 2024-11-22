import React, { useState } from "react";
import { PieChartOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu, Space, Avatar, Button, theme } from "antd";
import { Link, Outlet } from "react-router-dom";
import { AiOutlineLogout, AiOutlineLogin } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/features/userSlice";

const { Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={`/dashboard-delivery-staff/${key}`}>{label}</Link>,
  };
}

const items = [
  getItem("Thông tin cá nhân", "profile", <PieChartOutlined />),
  getItem("Kiểm tra sức khỏe", "check-health-fish", <PieChartOutlined />),
  getItem("Quản lí đóng gói", "create-package", <PieChartOutlined />),
  getItem(
    "Lịch sử vận chuyển",
    "manage-health-care-history",
    <PieChartOutlined />
  ),
];

const DashboardDeliveryStaff = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
  };

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          width={200}
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

          {/* User Avatar and Logout Button */}
          {user ? (
            <Space style={{ position: "absolute", bottom: 20, left: 20 }}>
              <Avatar icon={<UserOutlined />} style={{ cursor: "pointer" }} />
              <Button
                type="link"
                icon={<AiOutlineLogout fontSize={18} />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Space>
          ) : (
            <Button type="link" icon={<AiOutlineLogin fontSize={18} />}>
              <Link to="/login">Đăng nhập</Link>
            </Button>
          )}
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

export default DashboardDeliveryStaff;
