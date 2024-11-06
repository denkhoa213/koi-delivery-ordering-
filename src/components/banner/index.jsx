import React from "react";
import { Button, Col, Row, Typography } from "antd";

import "./index.scss";
import { Link } from "react-router-dom";

const Banner = () => {
  const { Title, Paragraph } = Typography;
  return (
    <div className="banner">
      <Row justify="center" align="middle" style={{ height: "100vh" }}>
        <Col span={12} style={{ textAlign: "center", color: "white" }}>
          <Title level={1}>Giao Hàng Koi Nhanh Chóng</Title>
          <Paragraph style={{ color: "#fff" }}>
            Khám phá dịch vụ giao hàng cá Koi tiện lợi và nhanh chóng! Chúng tôi
            cung cấp cá Koi chất lượng cao từ các trang trại uy tín. Đặt hàng dễ
            dàng và nhận cá Koi tận nhà với sự chăm sóc chu đáo và bảo đảm an
            toàn.
          </Paragraph>
          <Link to="fish-profile">
            <Button type="primary" size="large">
              Đặt Hàng Ngay
            </Button>
          </Link>
        </Col>
      </Row>
    </div>
  );
};

export default Banner;
