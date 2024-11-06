import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import { Button, Form, Select, InputNumber, Col, Row, Card } from "antd";

function HealthService() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [form] = Form.useForm();

  const fetchServices = async () => {
    try {
      const response = await api.get("/heal-service-category/view-all");
      setServices(response.data.result);
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi tải dịch vụ!");
    }
  };

  const handleSubmit = async (values) => {
    const orderId = localStorage.getItem("orderId");
    const fishProfileId = localStorage.getItem("fishProfileId");

    if (!orderId || !fishProfileId) {
      toast.error("Vui lòng hoàn thành đặt hàng và hồ sơ cá Koi trước.");
      navigate("/form-order");
      return;
    }

    // Submit order details
    try {
      const response = await api.post("order-detail/create", {
        ...values,
        orderId: parseInt(orderId, 10),
        fishProfileId: parseInt(fishProfileId, 10),
      });
      const orderDetailId = response.data.result.orderDetailId;
      localStorage.setItem("orderDetailId", orderDetailId);

      // Submit selected services
      if (values.selectedServices?.length) {
        for (const serviceId of values.selectedServices) {
          await api.post("/health-service-order/create", {
            orderId: parseInt(orderId, 10),
            healthServiceCategoryId: serviceId,
          });
        }
      }

      toast.success("Đặt hàng thành công!");
      navigate("/total-order");
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra.");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <Card title="Thông tin chi tiết đơn hàng và dịch vụ" bordered={false}>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        {/* Order Details */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="quantity"
              label="Số lượng"
              rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
            >
              <InputNumber
                min={1}
                placeholder="Nhập số lượng"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="unitPrice"
              label="Đơn giá"
              rules={[{ required: true, message: "Vui lòng nhập đơn giá!" }]}
            >
              <InputNumber
                min={0}
                placeholder="Nhập đơn giá"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Service Selection */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="selectedServices"
              label="Chọn dịch vụ"
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
                  <Select.Option key={service.id} value={service.id}>
                    <div>
                      <strong>{service.serviceName}</strong>
                      <p style={{ margin: 0 }}>{service.serviceDescription}</p>
                      <p style={{ margin: 0 }}>Giá: {service.price}</p>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Submit Button */}
        <Form.Item style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit" style={{ width: "auto" }}>
            Gửi
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default HealthService;
