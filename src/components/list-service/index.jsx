import React, { useState } from "react";
import "./index.scss";
import { Card, Col, Row } from "antd";

function ServiceList() {
  const services = [
    {
      id: 1,
      title: "Dịch vụ vận chuyển Koi",
      description: "Dịch vụ chuyên vận chuyển cá Koi an toàn, nhanh chóng.",
      image:
        "https://plus.unsplash.com/premium_photo-1723672584731-52b5f1a67543?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8a29pfGVufDB8fDB8fHww",
    },
    {
      id: 2,
      title: "Dịch vụ chăm sóc Koi",
      description:
        "Cung cấp dịch vụ chăm sóc cá Koi với các chuyên gia hàng đầu.",
      image:
        "https://plus.unsplash.com/premium_photo-1723672584731-52b5f1a67543?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8a29pfGVufDB8fDB8fHww",
    },
    {
      id: 3,
      title: "Dịch vụ bảo hành Koi",
      description: "Bảo hành cá Koi, đảm bảo sức khỏe và sinh trưởng.",
      image:
        "https://plus.unsplash.com/premium_photo-1723672584731-52b5f1a67543?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8a29pfGVufDB8fDB8fHww",
    },
  ];

  return (
    <>
      <div className="services-list" style={{ padding: "20px" }}>
        <h2>Danh sách dịch vụ</h2>
        <Row gutter={16}>
          {services.map((service) => (
            <Col key={service.id} xs={24} sm={12} md={8}>
              <Card
                hoverable
                cover={<img alt={service.title} src={service.image} />}
                style={{ marginBottom: "20px" }}
              >
                <Card.Meta
                  title={service.title}
                  description={service.description}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
}

export default ServiceList;
