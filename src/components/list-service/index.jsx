import React from "react";
import { Card, Button, Row, Col } from "antd";
import { Link } from "react-router-dom";
import "./index.scss";

const services = [
  {
    id: 1,
    name: "Vận chuyển hàng không",
    description:
      "Dịch vụ vận chuyển quốc tế bằng đường hàng không nhanh chóng.",
    image:
      "https://plus.unsplash.com/premium_photo-1679758630055-99ebb2df7d77?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8diVFMSVCQSVBRG4lMjBjaHV5JUUxJUJCJTgzbiUyMGIlRTElQkElQjFuZyUyMG0lQzMlQTF5JTIwYmF5fGVufDB8fDB8fHww", // URL hình ảnh hàng không
  },
  {
    id: 2,
    name: "Vận chuyển đường biển",
    description: "Vận chuyển với chi phí thấp hơn, thích hợp cho lô hàng lớn.",
    image:
      "https://images.unsplash.com/photo-1713845693883-b9005544b257?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dCVDMyVBMHV8ZW58MHx8MHx8fDA%3D", // URL hình ảnh đường biển
  },
  {
    id: 3,
    name: "Vận chuyển đường bộ",
    description: "Dịch vụ vận chuyển nội địa an toàn và tiện lợi.",
    image:
      "https://images.unsplash.com/photo-1695654390723-479197a8c4a3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRlbGl2ZXJ5fGVufDB8fDB8fHww", // URL hình ảnh đường bộ
  },
];

const ServiceList = () => {
  return (
    <div className="service-list">
      <h2>Danh sách dịch vụ vận chuyển cá Koi</h2>
      <Row gutter={[16, 16]}>
        {services.map((service) => (
          <Col key={service.id} xs={24} sm={12} md={8}>
            <Card
              title={service.name}
              bordered={false}
              cover={<img alt={service.name} src={service.image} />} // Thêm hình ảnh
            >
              <p>{service.description}</p>
              <Link to={`/services/${service.id}`}>
                <Button type="primary">Chi tiết</Button>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ServiceList;
