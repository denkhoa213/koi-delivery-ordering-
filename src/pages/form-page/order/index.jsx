import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Checkbox,
  Row,
  Col,
  Card,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../config/axios";

function OrderForm() {
  const [isPlaneDelivery, setIsPlaneDelivery] = useState(false);
  const navigate = useNavigate();
  const [deliveryMethod, setDeliveryMethod] = useState([]);
  const [form] = Form.useForm();
  const [hasCertificate, setHasCertificate] = useState(false);

  // Fetch available delivery methods
  const fetchDelivery = async () => {
    try {
      const response = await api.get("/delivery-method/view-all");
      setDeliveryMethod(response.data.result);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error fetching delivery methods"
      );
    }
  };

  // Handle delivery method change
  const handleDeliveryMethodChange = (value) => {
    setIsPlaneDelivery(value.toUpperCase() === "PLANE");
    localStorage.setItem("transportMethod", value);
  };

  // Submit the order form
  const handleSubmitOrder = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const dataToSubmit = {
        deliveryMethod: values.deliveryMethod,
        destination: values.destination,
        departure: values.departure,
        distance: values.distance,
        phone: values.phone,
        customsDeclaration: values.customsDeclaration ? "true" : "false",
      };

      const response = await api.post("order/create", dataToSubmit, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const orderId = response.data.result.id;
      localStorage.setItem("orderId", orderId);
      toast.success(response.data.message);

      if (values.customsDeclaration) {
        navigate(`/form-declaration/${orderId}`);
      } else if (hasCertificate) {
        navigate(`/certificate/${orderId}`);
      } else {
        navigate(`/health-service/${orderId}`);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi tạo đơn hàng"
      );
    }
  };

  useEffect(() => {
    fetchDelivery();
  }, []);

  return (
    <Card title="Thông tin đơn hàng" bordered={false}>
      <Form form={form} onFinish={handleSubmitOrder} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            {/* Phương thức giao hàng */}
            <Form.Item
              name="deliveryMethod"
              label="Phương thức giao hàng"
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
                {deliveryMethod.map((delivery) => (
                  <Select.Option
                    key={delivery.id}
                    value={delivery.deliveryMethodName}
                  >
                    {delivery.deliveryMethodName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {isPlaneDelivery && (
            <Col span={12}>
              <Form.Item
                name="customsDeclaration"
                valuePropName="checked"
                style={{ marginTop: "25px" }}
              >
                <Checkbox>Yêu cầu khai báo hải quan</Checkbox>
              </Form.Item>
            </Col>
          )}
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            {/* Điểm đến */}
            <Form.Item
              label="Điểm đến"
              name="destination"
              rules={[{ required: true, message: "Vui lòng nhập điểm đến!" }]}
            >
              <Input placeholder="Nhập điểm đến" />
            </Form.Item>
          </Col>

          <Col span={12}>
            {/* Điểm khởi hành */}
            <Form.Item
              label="Điểm khởi hành"
              name="departure"
              rules={[
                { required: true, message: "Vui lòng nhập điểm khởi hành!" },
              ]}
            >
              <Input placeholder="Nhập điểm khởi hành" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            {/* Khoảng cách */}
            <Form.Item
              label="Khoảng cách (km)"
              name="distance"
              rules={[
                { required: true, message: "Vui lòng nhập khoảng cách!" },
                {
                  type: "number",
                  min: 0,
                  message: "Khoảng cách phải là số dương!",
                },
              ]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            {/* Số điện thoại */}
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Số điện thoại phải gồm 10 chữ số!",
                },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Checkbox
            checked={hasCertificate}
            onChange={(e) => setHasCertificate(e.target.checked)}
          >
            Có chứng chỉ
          </Checkbox>
        </Form.Item>

        {/* Nút xác nhận đơn hàng */}
        <Form.Item style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit" style={{ width: "auto" }}>
            Xác nhận thông tin đơn hàng
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default OrderForm;
