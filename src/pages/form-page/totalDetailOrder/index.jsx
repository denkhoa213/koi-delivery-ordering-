import React, { useState, useEffect } from "react";
import { Spin, Row, Col, Typography, Card, Button, Radio } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../config/axios";

const { Title, Text } = Typography;

function TotalOrder() {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("after");

  // Hàm lấy thông tin tổng đơn hàng
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
      toast.error(
        error.response?.data?.message || "Có lỗi khi tải thông tin đơn hàng."
      );
      setLoading(false);
    }
  };

  // Hàm lấy thông tin hóa đơn
  const fetchInvoice = async () => {
    const invoiceId = localStorage.getItem("invoiceId");
    if (!invoiceId) {
      toast.error("Không tìm thấy hóa đơn!");
      return;
    }

    try {
      const response = await api.get(`/invoice/view-one/${invoiceId}`);
      if (response.data.code === 200) {
        setInvoiceDetails(response.data.result);
      } else {
        toast.error("Không thể tải thông tin hóa đơn!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi khi tải hóa đơn.");
    }
  };

  const handlePayment = async () => {
    const orderId = localStorage.getItem("orderId");

    // Kiểm tra ID đơn hàng
    if (!orderId) {
      toast.error("ID đơn hàng không hợp lệ!");
      return;
    }

    if (paymentMethod === "after") {
      navigate("/order-success");
    } else {
      const paymentData = {
        bankCode: "ncb", // Giả sử sử dụng NCB
        orderId: parseInt(orderId),
        code: "string", // Placeholder, điền mã trả về từ server nếu cần
        message: "string", // Placeholder, điền thông báo trả về từ server nếu cần
      };

      try {
        const response = await api.post("/payment/payment", paymentData);

        // Kiểm tra URL thanh toán trong phản hồi
        if (response.data.code === "200") {
          // Nếu thành công, kiểm tra URL thanh toán trong phản hồi
          if (response.data.data && response.data.data.paymentUrl) {
            window.open(response.data.data.paymentUrl);
          } else {
            toast.error("Không tìm thấy URL thanh toán!");
          }
          toast.success(response.data.message);
        } else {
          toast.error("Có lỗi xảy ra khi thanh toán: " + response.data.message);
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi thanh toán!");
        console.error("Payment Error:", error.response?.data || error.message); // Ghi log lỗi
      }
    }
  };

  // Gọi các hàm khi trang được load
  useEffect(() => {
    fetchOrderTotal();
    fetchInvoice();
  }, []);

  // Hiển thị khi đang tải dữ liệu
  if (loading) {
    return <Spin size="large" tip="Đang tải..." />;
  }

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Hàm định dạng số tiền
  const formatCurrency = (amount) => {
    if (amount == null) return "0";
    return amount.toLocaleString();
  };

  return (
    // <Card title="Thông tin tổng đơn hàng và hóa đơn" bordered={false}>
    //   {/* Thông tin đơn hàng */}
    //   {orderDetails && (
    //     <div style={{ marginBottom: 20 }}>
    //       <Row gutter={16}>
    //         <Col span={12}>
    //           <Title level={3}>Đơn Hàng #{orderDetails.orderCode}</Title>
    //           <Text>Phương Thức Vận Chuyển: {orderDetails.deliveryMethod}</Text>
    //         </Col>
    //         <Col span={12} style={{ textAlign: "right" }}>
    //           <Text strong>
    //             Tổng Tiền: {formatCurrency(orderDetails.totalAmount)} VND
    //           </Text>
    //         </Col>
    //       </Row>

    //       <Row gutter={16}>
    //         <Col span={12}>
    //           <Text>Địa Chỉ Khởi Hành: {orderDetails.departure}</Text>
    //         </Col>
    //         <Col span={12}>
    //           <Text>Địa Chỉ Đến: {orderDetails.destination}</Text>
    //         </Col>
    //       </Row>

    //       <Row gutter={16}>
    //         <Col span={12}>
    //           <Text>Khoảng Cách: {orderDetails.distance} km</Text>
    //         </Col>
    //         <Col span={12}>
    //           <Text>Ngày Đặt Hàng: {formatDate(orderDetails.orderDate)}</Text>
    //         </Col>
    //       </Row>
    //     </div>
    //   )}

    //   {/* Thông tin hóa đơn */}
    //   {invoiceDetails && (
    //     <div style={{ marginTop: 20 }}>
    //       <Row gutter={16}>
    //         <Col span={12}>
    //           <Title level={4}>Thông tin hóa đơn</Title>
    //           <Text>Mã Hóa Đơn: {invoiceDetails.invoiceNo}</Text>
    //         </Col>
    //       </Row>

    //       <Row gutter={16}>
    //         <Col span={12}>
    //           <Text>Địa Chỉ Khách Hàng: {invoiceDetails.addressCustomer}</Text>
    //         </Col>
    //         <Col span={12}>
    //           <Text>Địa Chỉ Cửa Hàng: {invoiceDetails.addressStore}</Text>
    //         </Col>
    //       </Row>

    //       <Row gutter={16}>
    //         <Col span={12}>
    //           <Text>VAT: {formatCurrency(invoiceDetails.vatAmount)} VND</Text>
    //         </Col>
    //         <Col span={12}>
    //           <Text>Status: {invoiceDetails.status}</Text>
    //         </Col>
    //       </Row>
    //     </div>
    //   )}

    //   <Row gutter={16} style={{ marginTop: 20 }}>
    //     <Col span={24} style={{ textAlign: "right" }}>
    //       <Button type="primary">Thanh Toán</Button>
    //     </Col>
    //   </Row>
    // </Card>
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
            <Col span={24}>
              <Text>Phương Thức Thanh Toán:</Text>
              <Radio.Group
                onChange={(e) => setPaymentMethod(e.target.value)}
                value={paymentMethod}
              >
                <Radio value="before">Thanh Toán Trước (VNP)</Radio>
                <Radio value="after">Thanh Toán Sau (Tiền Mặt)</Radio>
              </Radio.Group>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: 20 }}>
            <Col span={24} style={{ textAlign: "right" }}>
              <Button type="primary" onClick={handlePayment}>
                Xác nhận đặt hàng
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Card>
  );
}

export default TotalOrder;
