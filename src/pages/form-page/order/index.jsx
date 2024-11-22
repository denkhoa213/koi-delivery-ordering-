import {
  Button,
  Form,
  Input,
  Checkbox,
  Row,
  Col,
  Card,
  Select,
  Typography,
  Divider,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../config/axios";
import Header from "../../../components/header";
import AppFooter from "../../../components/footer";

const { Title, Text } = Typography;

function OrderForm() {
  const [isPlaneDelivery, setIsPlaneDelivery] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const navigate = useNavigate();
  const [deliveryMethod, setDeliveryMethod] = useState([]);
  const [form] = Form.useForm();

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
    const selected = deliveryMethod.find((delivery) => delivery.name === value);
    setSelectedDelivery(selected);
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
        phone: values.phone,
        customsDeclaration: values.customsDeclaration ? "true" : "false",
      };

      const response = await api.post("order/create", dataToSubmit, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const orderId = response.data.result.id;
      const createBy = response.data.result.createBy;
      localStorage.setItem("orderId", orderId);
      localStorage.setItem("createBy", createBy);
      toast.success(response.data.message);

      if (values.customsDeclaration) {
        navigate(`/form-declaration/${orderId}`);
      } else {
        navigate(`/fish-profile/${orderId}`);
      }
      if (response.data.code === 200) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
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
    <>
      <Header />
      <div style={{
        minHeight: "100vh", // Chiều cao tối thiểu của màn hình
        backgroundColor: "#F5F5F5",
        paddingTop: "70px",
      }}>
        <Card
          title={
            <Title level={3} style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
              Thông tin đơn hàng
            </Title>
          }
          bordered={false}
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            border: "2px solid #000",
            borderRadius: "8px",

          }}
        >
          <Form form={form} onFinish={handleSubmitOrder} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                {/* Delivery Method */}
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
                      <Select.Option key={delivery.id} value={delivery.name}>
                        {delivery.name}
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

            {selectedDelivery && (
              <div
                style={{
                  padding: "10px",
                  background: "#f7f7f7",
                  borderRadius: "8px",
                }}
              >
                <Title level={4}>Chi tiết phương thức giao hàng:</Title>
                <Row gutter={16}>
                  <Col span={12}>
                    <Text strong>Mô tả:</Text>{" "}
                    <Text>{selectedDelivery.description}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Giá:</Text>{" "}
                    <Text>{selectedDelivery.price} VND/1KM</Text>
                  </Col>
                </Row>
                <Divider />
              </div>
            )}

            <Row gutter={16}>
              <Col span={12}>
                {/* Destination */}
                <Form.Item
                  label="Điểm đến"
                  name="destination"
                  rules={[{ required: true, message: "Vui lòng nhập điểm đến!" }]}
                >
                  <Input placeholder="Nhập điểm đến" />
                </Form.Item>
              </Col>

              <Col span={12}>
                {/* Departure */}
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
                {/* Phone Number */}
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

            {/* Submit Button */}
            <Form.Item style={{ textAlign: "right" }}>
              <Button type="primary" htmlType="submit" style={{ width: "auto" }}>
                Xác nhận thông tin đơn hàng
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <AppFooter />
    </>
  );
}

export default OrderForm;
