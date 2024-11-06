import React, { useState, useEffect } from "react";
import { Spin, Row, Col, Typography, Card, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../config/axios";

const { Title, Text } = Typography;

function TotalOrder() {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderTotal = async () => {
    setLoading(true);
    const orderId = localStorage.getItem("orderId");

    if (!orderId) {
      toast.error("Không có ID đơn hàng!");
      navigate("/form-order");
      return;
    }

    try {
      const response = await api.put(`/order/calculate/${orderId}`);
      if (response.data.code === 200) {
        setOrderDetails(response.data.result);
      } else {
        toast.error("Không thể tính toán tổng số tiền cho đơn hàng!");
      }
      setLoading(false);
    } catch (error) {
      toast.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderTotal();
  }, []);

  // Hiển thị khi đang tải dữ liệu
  if (loading) {
    return <Spin size="large" tip="Đang tải..." />;
  }

  return (
    <Card title="Thông tin tổng đơn hàng" bordered={false}>
      {orderDetails && (
        <>
          <Row gutter={16} style={{ marginBottom: 20 }}>
            <Col span={12}>
              <Title level={3}>Đơn Hàng #{orderDetails.orderCode}</Title>
              <Text>Phương Thức Vận Chuyển: {orderDetails.deliveryMethod}</Text>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <Text strong>
                Tổng Tiền: {orderDetails.totalAmount.toLocaleString()} VND
              </Text>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Text>Địa Chỉ Khởi Hành: {orderDetails.departure}</Text>
            </Col>
            <Col span={12}>
              <Text>Địa Chỉ Đến: {orderDetails.destination}</Text>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Text>Khoảng Cách: {orderDetails.distance} km</Text>
            </Col>
            <Col span={12}>
              <Text>
                Ngày Đặt Hàng:{" "}
                {new Date(orderDetails.orderDate).toLocaleString()}
              </Text>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 20 }}>
            <Col span={24} style={{ textAlign: "right" }}>
              <Button type="primary">Thanh Toán</Button>
            </Col>
          </Row>
        </>
      )}
    </Card>
  );
}

export default TotalOrder;
