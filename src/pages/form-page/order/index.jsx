import { Button, Form, Input, InputNumber, Select, Checkbox } from "antd";
import { Option } from "antd/es/mentions";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../config/axios";
import FormLayout from "../../../components/layout/layout-form";

function OrderForm() {
  const [isPlaneDelivery, setIsPlaneDelivery] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleDeliveryMethodChange = (value) => {
    setIsPlaneDelivery(value === "Plane");
  };

  const handleSubmitOrder = async (values) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.post("order/create", values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const orderId = response.data.result.id;
      localStorage.setItem("orderId", orderId);
      toast.success("Đặt hàng thành công!");
      if (values.customsDeclaration) {
        navigate(`/customs-declaration/${orderId}`);
      } else {
        navigate(`/fish-profile/${orderId}`);
      }
      console.log("Order ID:", response.data.result.id);
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  return (
    <FormLayout>
      <Form form={form} onFinish={handleSubmitOrder} layout="vertical">
        <Form.Item
          label="Phương Thức Giao Hàng"
          name="deliveryMethod"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn phương thức giao hàng!",
            },
          ]}
        >
          <Select
            placeholder="Chọn phương thức giao hàng"
            onChange={handleDeliveryMethodChange}
          >
            <Option value="Van">Van</Option>
            <Option value="Plane">Plane</Option>
            <Option value="Boat">Boat</Option>
            <Option value="Train">Train</Option>
          </Select>
        </Form.Item>

        {isPlaneDelivery && (
          <Form.Item name="customsDeclaration" valuePropName="checked">
            <Checkbox>Yêu cầu khai báo hải quan</Checkbox>
          </Form.Item>
        )}

        <Form.Item
          label="Địa Điểm"
          name="destination"
          rules={[{ required: true, message: "Vui lòng nhập địa điểm!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Điểm Khởi Hành"
          name="departure"
          rules={[{ required: true, message: "Vui lòng nhập điểm khởi hành!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Khoảng Cách (km)"
          name="distance"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập khoảng cách!",
              type: "number",
              min: 0,
            },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Số Điện Thoại"
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Số Tiền"
          name="amount"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số tiền!",
              type: "number",
              min: 0,
            },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
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

export default OrderForm;
