import React from "react";
import { Table, Space } from "antd";
import "./index.scss"; // Đường dẫn đến file SCSS

const HealthServiceList = () => {
  const data = [
    {
      key: "1",
      service: "Kiểm tra sức khỏe cá Koi trước khi vận chuyển",
      description:
        "Đảm bảo cá Koi trong tình trạng sức khỏe tốt trước khi vận chuyển, bao gồm kiểm tra ký sinh trùng và phân tích nước.",
      cost: "200.000 VNĐ",
      duration: "1-2 ngày",
    },
    {
      key: "2",
      service: "Chuẩn bị môi trường vận chuyển",
      description:
        "Thiết lập môi trường tối ưu cho cá Koi trong quá trình vận chuyển để giảm căng thẳng và đảm bảo an toàn.",
      cost: "150.000 VNĐ",
      duration: "1 ngày",
    },
    {
      key: "3",
      service: "Kiểm tra nước vận chuyển",
      description:
        "Phân tích chất lượng nước trong thùng vận chuyển để đảm bảo an toàn cho cá Koi.",
      cost: "100.000 VNĐ",
      duration: "1 ngày",
    },
    {
      key: "4",
      service: "Theo dõi sức khỏe trong quá trình vận chuyển",
      description:
        "Theo dõi tình trạng sức khỏe của cá Koi trong suốt quá trình vận chuyển, xử lý kịp thời các vấn đề phát sinh.",
      cost: "300.000 VNĐ",
      duration: "Theo lịch",
    },
    {
      key: "5",
      service: "Khám sức khỏe sau vận chuyển",
      description:
        "Kiểm tra sức khỏe cá Koi sau khi vận chuyển để phát hiện kịp thời các bệnh có thể xảy ra.",
      cost: "250.000 VNĐ",
      duration: "1-3 ngày",
    },
  ];

  const columns = [
    {
      title: "Dịch vụ",
      dataIndex: "service",
      key: "service",
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
      title: "Thời gian thực hiện",
      dataIndex: "duration",
      key: "duration",
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
    <div className="health-service-list">
      <h2>Danh sách Dịch vụ Kiểm tra Sức khỏe trong Vận chuyển Cá Koi</h2>
      <Table dataSource={data} columns={columns} />
    </div>
  );
};

export default HealthServiceList;
