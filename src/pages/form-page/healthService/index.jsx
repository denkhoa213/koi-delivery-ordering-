import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import { Button, Form, Select } from "antd";
import { Option } from "antd/es/mentions";
import FormLayout from "../../../components/layout/layout-form";

function HealthService() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [form] = Form.useForm();

  const fetchServices = async () => {
    try {
      const response = await api.get("/heal-service-category/view-all");
      setServices(response.data.result);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách dịch vụ");
    }
  };
  const handleSubmitServices = async (values) => {
    const selectedServices = values.selectedServices;
    const orderId = localStorage.getItem("orderId");

    if (!orderId) {
      toast.error("Không tìm thấy đơn hàng! vui lòng đặt hàng trước.");
      navigate("/form-order");
      return;
    }

    if (!Array.isArray(selectedServices) || selectedServices.length === 0) {
      toast.error("Vui lòng chọn ít nhất một dịch vụ!");
      return;
    }

    try {
      // Gửi yêu cầu với mỗi dịch vụ đã chọn
      for (const serviceId of selectedServices) {
        const values = {
          orderId: parseInt(orderId, 10),
          healthServiceCategoryId: serviceId,
        };
        const responses = await api.post(
          "/health-service-order/create",
          values
        );
        toast.success(responses.data.message);
      }

      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    // Gọi hàm fetchServices khi component được mount
    fetchServices();
  }, []);
  return (
    <FormLayout title="Health Service">
      <Form onFinish={handleSubmitServices} form={form} layout="vertical">
        {/* Form cho chọn dịch vụ */}
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
          <Select mode="multiple" placeholder="Chọn dịch vụ">
            {services.map((service) => (
              <Select.Option key={service.id} value={service.id}>
                <div>
                  <strong> {service.serviceName}</strong>
                  <p style={{ margin: 0 }}>{service.serviceDescription}</p>
                  <p style={{ margin: 0 }}> Price: {service.price}</p>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Đặt Hàng
          </Button>
        </Form.Item>
      </Form>
    </FormLayout>
  );
}

export default HealthService;
