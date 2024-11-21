import React, { useState } from "react";
import { HistoryOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Link, Outlet } from "react-router-dom";
import Header from "../header";

const { Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label: <Link to={`/customer/${key}`}>{label}</Link>,
    };
}
const items = [
    getItem("Hồ sơ của tôi", "customer-profile", <UserOutlined />),
    getItem("Danh sách đơn hàng", "customer-order", <ShoppingCartOutlined />),
    getItem("Lịch sử giao dịch", "transaction-history", <HistoryOutlined />),


];
const CustomerTemplate = () => {
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
                    width={200}
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                    style={{ background: '#fff' }}
                >
                    <div className="demo-logo-vertical" />
                    <Menu
                        theme="light"
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
export default CustomerTemplate;
