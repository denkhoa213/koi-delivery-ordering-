import React from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Button, Rate, Table } from "antd";
import "./index.scss"; // Tạo file SCSS cho styling

const services = [
  {
    id: 1,
    name: "Vận chuyển hàng không",
    description:
      "Dịch vụ vận chuyển quốc tế bằng đường hàng không nhanh chóng.",
    image:
      "https://plus.unsplash.com/premium_photo-1679758630055-99ebb2df7d77?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=MXwxMjA3fDB8MHxzZWFyY2h8NXx8diVFMSVCQSVBRG4lMjBjaHV5JUUxJUJCJTgzbiUyMGIlRTElQkElQjFuZyUyMG0lQzMlQTF5JTIwYmF5fGVufDB8fDB8fHww",
    details:
      "Chi tiết dịch vụ hàng không: thời gian vận chuyển nhanh chóng, đảm bảo an toàn cho các lô hàng cá Koi quý hiếm. Phù hợp với những khách hàng cần vận chuyển cá Koi quốc tế trong thời gian ngắn.",
    features: [
      "Thời gian giao hàng nhanh chóng.",
      "Đảm bảo an toàn và chất lượng.",
      "Theo dõi đơn hàng trực tuyến.",
    ],
    rating: 4.5,
    pricing: [
      {
        type: "Hàng nhẹ (dưới 10kg)",
        price: "$100/đơn",
      },
      {
        type: "Hàng trung (10kg - 50kg)",
        price: "$250/đơn",
      },
      {
        type: "Hàng nặng (trên 50kg)",
        price: "$500/đơn",
      },
    ],
  },
  {
    id: 2,
    name: "Vận chuyển đường biển",
    description: "Vận chuyển với chi phí thấp hơn, thích hợp cho lô hàng lớn.",
    image:
      "https://images.unsplash.com/photo-1713845693883-b9005544b257?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=MXwxMjA3fDB8MHxzZWFyY2h8M3x8dCVDMyVBMHV8ZW58MHx8MHx8fDA%3D",
    details:
      "Chi tiết dịch vụ đường biển: thích hợp cho vận chuyển số lượng lớn cá Koi với chi phí tiết kiệm. Thời gian vận chuyển lâu hơn so với hàng không nhưng đảm bảo an toàn và chất lượng.",
    features: [
      "Chi phí thấp hơn so với vận chuyển hàng không.",
      "Thích hợp cho số lượng lớn.",
      "Đảm bảo an toàn và chất lượng trong quá trình vận chuyển.",
    ],
    rating: 4.0,
    pricing: [
      {
        type: "Hàng nhẹ (dưới 50kg)",
        price: "$200/đơn",
      },
      {
        type: "Hàng trung (50kg - 200kg)",
        price: "$500/đơn",
      },
      {
        type: "Hàng nặng (trên 200kg)",
        price: "$1,000/đơn",
      },
    ],
  },
  {
    id: 3,
    name: "Vận chuyển đường bộ",
    description: "Dịch vụ vận chuyển nội địa an toàn và tiện lợi.",
    image:
      "https://images.unsplash.com/photo-1695654390723-479197a8c4a3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTB8fGRlbGl2ZXJ5fGVufDB8fDB8fHww",
    details:
      "Chi tiết dịch vụ đường bộ: phù hợp cho vận chuyển trong nước, giúp giao hàng nhanh chóng và chi phí thấp. Đảm bảo an toàn tuyệt đối cho cá Koi trong suốt quá trình vận chuyển.",
    features: [
      "Dịch vụ giao hàng nhanh chóng.",
      "Chi phí hợp lý cho nội địa.",
      "Theo dõi đơn hàng dễ dàng.",
    ],
    rating: 4.7,
    pricing: [
      {
        type: "Hàng nhẹ (dưới 30kg)",
        price: "$50/đơn",
      },
      {
        type: "Hàng trung (30kg - 100kg)",
        price: "$150/đơn",
      },
      {
        type: "Hàng nặng (trên 100kg)",
        price: "$300/đơn",
      },
    ],
  },
];

const ServiceDetail = () => {
  const { id } = useParams(); // Lấy id từ URL
  const service = services.find((service) => service.id === parseInt(id));
  if (!service) {
    return <h2>Dịch vụ không tồn tại!</h2>;
  }

  const columns = [
    {
      title: "Loại hàng",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Giá (USD)",
      dataIndex: "price",
      key: "price",
    },
  ];

  return (
    <div className="service-detail">
      <Card
        title={service.name}
        bordered={false}
        cover={<img alt={service.name} src={service.image} />}
        className="detail-card"
      >
        <p className="description">{service.description}</p>
        <p className="details">{service.details}</p>

        <h3>Tính năng nổi bật</h3>
        <ul className="features-list">
          {service.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>

        <h3>Bảng giá dịch vụ</h3>
        <Table
          columns={columns}
          dataSource={service.pricing}
          pagination={false}
          rowKey="type"
        />

        <div className="rating">
          <h4>Đánh giá dịch vụ:</h4>
          <Rate allowHalf defaultValue={service.rating} disabled />
          <span className="rating-value"> {service.rating}</span>
        </div>

        <div className="button-group">
          <Button type="primary" className="back-button">
            <Link to="/services">Quay lại danh sách dịch vụ</Link>
          </Button>
          <Button type="danger" className="order-button">
            Đặt dịch vụ
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ServiceDetail;
