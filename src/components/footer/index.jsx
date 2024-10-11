import React from "react";
import { Layout, Row, Col, Typography, Space } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  TikTokOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Footer } = Layout;
const { Text, Title } = Typography;

const AppFooter = () => {
  return (
    <Footer
      style={{
        backgroundColor: "#001529",
        color: "#fff",
        padding: "40px 50px",
      }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Title level={3} style={{ color: "#fff" }}>
            Koi Delivery
          </Title>
          <Text style={{ color: "#d9d9d9" }}>
            Hệ thống vận chuyển cá Koi hàng đầu, đảm bảo an toàn và chuyên
            nghiệp trong mọi khâu vận chuyển.
          </Text>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Title level={4} style={{ color: "#fff" }}>
            Liên Kết Nhanh
          </Title>
          <Space direction="vertical">
            <Link to="/about" style={{ color: "#d9d9d9" }}>
              Giới Thiệu
            </Link>
            <Link to="/support" style={{ color: "#d9d9d9" }}>
              Hỗ Trợ
            </Link>
            <Link to="/contact" style={{ color: "#d9d9d9" }}>
              Liên Hệ
            </Link>
            <Link to="/faq" style={{ color: "#d9d9d9" }}>
              Câu Hỏi Thường Gặp
            </Link>
          </Space>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Title level={4} style={{ color: "#fff" }}>
            Thông Tin Liên Hệ
          </Title>
          <Text style={{ color: "#d9d9d9" }}>
            Địa chỉ: 123 Đường Koi, Phường Cá, Quận Hồ Cá, TP. Cá Koi
          </Text>
          <br />
          <Text style={{ color: "#d9d9d9" }}>
            Email: support@koidelivery.com
          </Text>
          <br />
          <Text style={{ color: "#d9d9d9" }}>SĐT: (123) 456-7890</Text>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Title level={4} style={{ color: "#fff" }}>
            Theo Dõi Chúng Tôi
          </Title>
          <Space size="middle">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#fff" }}
            >
              <FacebookOutlined style={{ fontSize: "24px" }} />
            </a>
            <a
              href="https://www.tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#fff" }}
            >
              <TikTokOutlined style={{ fontSize: "24px" }} />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#fff" }}
            >
              <InstagramOutlined style={{ fontSize: "24px" }} />
            </a>
          </Space>
        </Col>
      </Row>

      <Row style={{ marginTop: "30px", textAlign: "center" }}>
        <Col span={24}>
          <Text style={{ color: "#d9d9d9" }}>
            © {new Date().getFullYear()} Koi Delivery. Tất cả các quyền được bảo
            lưu.
          </Text>
        </Col>
      </Row>
    </Footer>
  );
};

export default AppFooter;
