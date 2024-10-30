import React from "react";
import FormLayout from "../../../components/layout/layout-form";
import { Button, Form, InputNumber } from "antd";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function OrderDetail() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleCreateOrderDetail = async (values) => {
    const orderId = localStorage.getItem("orderId");
    if (!orderId) {
      toast.error("Không tìm thấy đơn hàng! vui lòng đặt hàng trước.");
      navigate("/form-order");
      return;
    }
    const fishProfileId = localStorage.getItem("fishProfileId");
    if (!fishProfileId) {
      toast.error("Không tìm thấy hồ sơ cá Koi! vui lòng đặt hàng trước.");
      navigate("/form-order");
      return;
    }
    values.orderId = parseInt(orderId, 10);
    values.fishProfileId = parseInt(fishProfileId, 10);
    console.log("Dữ liệu gửi:", values);
    try {
      const response = await api.post("order-detail/create", values);
      navigate("/health-service");
      console.log(response);
    } catch (error) {
      toast.error(error);
    }
  };
  return (
    <FormLayout>
      <Form onFinish={handleCreateOrderDetail} form={form} layout="vertical">
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

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Đặt Hàng
          </Button>
        </Form.Item>
      </Form>
    </FormLayout>
  );
}

export default OrderDetail;
