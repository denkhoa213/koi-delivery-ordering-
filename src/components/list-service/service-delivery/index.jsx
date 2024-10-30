import React from "react";
import { Table, Tag, Space } from "antd";
import "./index.scss";

const DeliveryServiceList = () => {
  const data = [
    {
      key: "1",
      method: "Giao hàng trong ngày",
      description:
        "Nhận hàng trong cùng ngày với dịch vụ giao hàng nhanh chóng.",
      cost: "50.000 VNĐ",
      deliveryTime: "2-4 giờ",
    },
    {
      key: "2",
      method: "Giao hàng tiết kiệm",
      description:
        "Dịch vụ giao hàng tiết kiệm với thời gian giao hàng từ 3 đến 5 ngày.",
      cost: "30.000 VNĐ",
      deliveryTime: "3-5 ngày",
    },
    {
      key: "3",
      method: "Giao hàng qua đêm",
      description:
        "Giao hàng đến tay khách hàng trong đêm với tốc độ nhanh nhất.",
      cost: "70.000 VNĐ",
      deliveryTime: "Trước 9 giờ sáng hôm sau",
    },
    {
      key: "4",
      method: "Giao hàng hẹn giờ",
      description: "Chọn thời gian giao hàng theo yêu cầu của khách hàng.",
      cost: "100.000 VNĐ",
      deliveryTime: "Theo yêu cầu",
    },
    {
      key: "5",
      method: "Giao hàng quốc tế",
      description:
        "Dịch vụ giao hàng đến các quốc gia khác với thời gian và chi phí khác nhau.",
      cost: "Tùy thuộc vào điểm đến",
      deliveryTime: "Tùy thuộc vào điểm đến",
    },
  ];

  const columns = [
    {
      title: "Phương thức",
      dataIndex: "method",
      key: "method",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Chi phí",
      dataIndex: "cost",
      key: "cost",
    },
    {
      title: "Thời gian giao hàng",
      dataIndex: "deliveryTime",
      key: "deliveryTime",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a href="#">Xem chi tiết</a>
        </Space>
      ),
    },
  ];

  return (
    <div className="delivery-service-list" style={{ padding: "20px" }}>
      <h2>Danh sách Dịch vụ Giao hàng</h2>
      <Table dataSource={data} columns={columns} />
    </div>
  );
};

export default DeliveryServiceList;
