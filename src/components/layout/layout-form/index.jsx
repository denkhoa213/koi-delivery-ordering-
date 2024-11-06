import React from "react";
import { Layout, Row, Col } from "antd";
import { Outlet } from "react-router-dom";
import Header from "../../header";
import AppFooter from "../../footer";
const { Content } = Layout;
const FormLayout = () => {
  return (
    <>
      <Header />
      <Layout style={{ minHeight: "100vh" }}>
        <Row gutter={16}>
          <Col span={18}>
            <Content
              style={{
                margin: "20px",
                padding: "20px",
                background: "#fff",
                minHeight: "100%",
                borderRadius: "12px",
              }}
            >
              <Outlet />
            </Content>
          </Col>

          <Col span={6}>
            <Content
              style={{
                padding: "20px",
                background: "#f0f2f5",
                minHeight: "100%",
              }}
            ></Content>
          </Col>
        </Row>
      </Layout>
      <AppFooter />
    </>
  );
};

export default FormLayout;
