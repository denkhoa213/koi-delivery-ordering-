import React, { useState, useEffect } from "react";
import {
  Spin,
  Row,
  Col,
  Typography,
  Card,
  Button,
  Radio,
  Select,
  Form,
  Table,
  Popconfirm,
  Space,
} from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../config/axios";
import { DeleteOutlined } from "@ant-design/icons";
import Header from "../../../components/header";
import AppFooter from "../../../components/footer";

const { Title, Text } = Typography;

function TotalOrder() {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("after");
  const [viewFishOrder, setViewFishOrder] = useState([]);
  const [services, setServices] = useState([]);
  const [servicesByOrder, setServicesByOrder] = useState([]);
  const [form] = Form.useForm();

  const fetchServices = async () => {
    try {
      const response = await api.get("/heal-service-category/view-all");
      setServices(response.data.result);
      console.log("Services:", response.data.result);
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi tải dịch vụ!");
    }
  };

  const handleBack = () => {
    navigate(-1); // Quay lại trang trước đó
  };

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
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchViewFishOrder = async () => {
    const orderId = localStorage.getItem("orderId");
    try {
      if (!orderId) {
        toast.error("Không tìm thấy mã đơn hàng!");
        return;
      }

      const response = await api.get(`/fish-profile/view-by-order/${orderId}`);
      const fishOrderData = response.data.result;
      if (fishOrderData.length > 0) {
        setViewFishOrder(fishOrderData);
      } else {
        toast.error("Không có cá trong đơn hàng!");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data || "Có lỗi xảy ra khi tải hồ sơ cá!";
      toast.error(errorMessage);
    }
  };

  const handleCancelOrder = async () => {
    const orderId = localStorage.getItem("orderId");

    if (!orderId) {
      toast.error("Không có ID đơn hàng!");
      return;
    }

    try {
      const response = await api.put(`/order/delete/${orderId}`);

      if (response.data.code === 200) {
        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error("Không thể hủy đơn hàng!");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi hủy đơn hàng!"
      );
    }
  };

  const handleCreateService = async (values) => {
    const orderId = localStorage.getItem("orderId");
    if (!orderId) {
      toast.error("Không có mã đơn hàng!");
      return;
    }

    try {
      if (values.selectedServices?.length) {
        const createServicePromises = values.selectedServices.map(
          (serviceId) => {
            const selectedService = services.find(
              (service) => service.id === serviceId
            );

            if (selectedService) {
              return api.post("/health-service-order/create", {
                orderId: parseInt(orderId, 10),
                healthServiceCategoryId: serviceId,
              });
            } else {
              toast.error(`Dịch vụ với ID ${serviceId} không hợp lệ`);
              return null;
            }
          }
        );

        await Promise.all(createServicePromises);
        toast.success("Đã tạo dịch vụ thành công!");

        // Fetch updated services for this order and update state
        fetchServicesByOrder(orderId);
        form.resetFields();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi tạo dịch vụ!"
      );
    }
  };

  const fetchServicesByOrder = async () => {
    const orderId = localStorage.getItem("orderId");

    if (!orderId) {
      toast.error("Không có ID đơn hàng!");
      navigate("/form-order");
      return;
    }

    try {
      const response = await api.get(
        `/health-service-order/view-by-order/${orderId}`
      );
      if (response.data.result) {
        const formattedServices = response.data.result.map((serviceOrder) => ({
          id: serviceOrder.id,
          serviceName: serviceOrder.healthServiceCategory.serviceName,
          serviceDescription:
            serviceOrder.healthServiceCategory.serviceDescription,
          price: serviceOrder.healthServiceCategory.price,
        }));

        setServicesByOrder(formattedServices);
      }
      fetchOrderTotal();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Đã xảy ra lỗi khi lấy dịch vụ."
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/health-service-order/delete/${id}`);
      toast.success(response.data.message);

      fetchServicesByOrder();
      fetchOrderTotal();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Đã xảy ra lỗi khi xóa dịch vụ."
      );
    }
  };

  useEffect(() => {
    fetchOrderTotal();
    fetchViewFishOrder();
    fetchServices();
    const orderId = localStorage.getItem("orderId");
    if (orderId) {
      fetchServicesByOrder(orderId);
    }
  }, []);

  const columns = [
    {
      title: "Dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: "Mô tả dịch vụ",
      dataIndex: "serviceDescription",
      key: "serviceDescription",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <Space size="middle">
          <Popconfirm
            title="Xóa"
            description="Bạn có muốn xóa dịch vụ này không?"
            onConfirm={() => handleDelete(id)}
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handlePayment = async () => {
    const orderId = localStorage.getItem("orderId");

    if (!orderId) {
      toast.error("Không có ID đơn hàng!");
      return;
    }

    if (paymentMethod === "before") {
      try {
        const response = await api.post("/payos/create?orderId=" + orderId);
        console.log("Response:", response);

        window.open(response.data.checkoutUrl);
      } catch {
        toast.error("Có lỗi xảy ra khi gọi đơn thanh toán!");
      }
    } else {
      toast.success("Đặt hàng thành công.");
      navigate("/order-success");
    }
  };

  if (loading) {
    return <Spin size="large" tip="Đang tải..." />;
  }

  return (
    <>
      <Header />

      <div
        style={{
          marginTop: "30px",
          marginBottom: "60px",
          backgroundColor: "#F5F5F5",
        }}
      >
        <div
          style={{
            minHeight: "100vh",
            maxWidth: "1300px",
            margin: "0 auto",
            border: "2px solid #000",
            borderRadius: "8px",
          }}
        >
          <Card title="Thông Tin Tổng Đơn Hàng" bordered={false}>
            {orderDetails && (
              <Row gutter={16}>
                <Col span={16}>
                  <Card bordered={false}>
                    <Title
                      level={3}
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      Thông tin đơn hàng
                    </Title>

                    {/* Đơn hàng */}
                    <Row gutter={16} style={{ marginBottom: 20 }}>
                      <Col span={12}>
                        <Title level={4}>
                          Đơn Hàng #{orderDetails.orderCode}
                        </Title>
                        <Text>
                          Phương Thức Vận Chuyển: {orderDetails.deliveryMethod}
                        </Text>
                      </Col>
                    </Row>

                    {/* Địa chỉ */}
                    <Row gutter={16}>
                      <Col span={12}>
                        <Text>Địa Chỉ Khởi Hành: {orderDetails.departure}</Text>
                      </Col>
                      <Col span={12}>
                        <Text>Địa Chỉ Đến: {orderDetails.destination}</Text>
                      </Col>
                    </Row>

                    {/* Ngày đặt hàng */}
                    <Row gutter={16}>
                      <Col span={12}>
                        <Text>
                          Ngày Đặt Hàng:{" "}
                          {new Date(orderDetails.orderDate).toLocaleString()}
                        </Text>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={24}>
                        <Form form={form} onFinish={handleCreateService}>
                          <Form.Item
                            name="selectedServices"
                            style={{
                              margin: "20px",
                            }}
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn ít nhất một dịch vụ!",
                              },
                            ]}
                          >
                            <Select
                              mode="multiple"
                              placeholder="Chọn dịch vụ"
                              style={{ width: "100%" }}
                            >
                              {services.map((service) => (
                                <Select.Option
                                  key={service.id}
                                  value={service.id}
                                >
                                  <div>
                                    <strong>{service.serviceName}</strong>
                                    <p style={{ margin: 0 }}>
                                      {service.serviceDescription}
                                    </p>
                                    <p style={{ margin: 0 }}>
                                      Giá: {service.price}
                                    </p>
                                  </div>
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                          <Form.Item>
                            <Button type="default" htmlType="submit">
                              Thêm dịch vụ
                            </Button>
                          </Form.Item>
                        </Form>
                        <Table
                          columns={columns}
                          dataSource={servicesByOrder}
                          rowKey="id"
                        />
                      </Col>
                    </Row>

                    {/* Hiển thị thông tin cá */}
                    <Row gutter={16} style={{ marginTop: 20 }}>
                      <Col span={24}>
                        <Title level={5}>Thông Tin Cá</Title>
                        <Table
                          columns={[
                            {
                              title: "Tên Cá",
                              dataIndex: "name",
                              key: "name",
                              render: (text) => <Text strong>{text}</Text>,
                            },
                            {
                              title: "Loại Cá",
                              dataIndex: "species",
                              key: "species",
                            },
                            {
                              title: "Mô Tả",
                              dataIndex: "description",
                              key: "description",
                            },
                            {
                              title: "Hình Ảnh",
                              dataIndex: "image",
                              key: "image",
                              render: (text) => (
                                <img
                                  src={text || "defaultImageURL.jpg"}
                                  alt="Fish Image"
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                  }}
                                />
                              ),
                            },
                          ]}
                          dataSource={viewFishOrder}
                          rowKey="id"
                        />
                      </Col>
                    </Row>
                  </Card>
                </Col>

                {/* Bên phải: Tổng tiền và thanh toán */}
                <Col span={8}>
                  <Card bordered={false}>
                    <Title level={4}>Tổng Tiền và Thanh Toán</Title>

                    {/* Phương thức thanh toán */}
                    <Row gutter={16} style={{ marginBottom: 20 }}>
                      <Col span={24}>
                        <Radio.Group
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                          <Radio value="after">Thanh Toán Sau</Radio>
                          <Radio value="before">Thanh Toán Trước</Radio>
                        </Radio.Group>
                      </Col>
                    </Row>

                    {/* Tổng tiền */}
                    <Row gutter={16}>
                      <Col style={{ marginBottom: "20px" }} span={24}>
                        <Text style={{ fontSize: "18px" }} strong>
                          Tổng Tiền: {orderDetails.totalAmount} VND
                        </Text>
                      </Col>
                    </Row>

                    {/* Thanh toán */}
                    <Row gutter={16}>
                      <Col span={12}>
                        <Button
                          type="primary"
                          onClick={handlePayment}
                          style={{ width: "100%" }}
                        >
                          Thanh Toán
                        </Button>
                      </Col>
                      <Col span={12}>
                        <Button
                          type="primary"
                          danger
                          onClick={handleCancelOrder}
                          style={{ width: "100%" }}
                        >
                          Hủy đơn hàng
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            )}
            <Row
              gutter={16}
              style={{
                marginTop: "20px",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <Col span={24}>
                <Button
                  onClick={handleBack}
                  type="default"
                  style={{
                    width: "200px",
                    marginTop: "20px", // Add some space at the top
                    fontSize: "16px", // Larger text for better readability
                  }}
                >
                  Quay lại
                </Button>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

      <AppFooter />
    </>
  );
}

export default TotalOrder;
