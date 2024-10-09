import React from "react";
import { Form, Input, Button, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./index.scss"; // Tạo file SCSS cho styling nếu cần

const { Option } = Select;

const OrderTransportation = () => {
  const [form] = Form.useForm();
  const [isInternational, setIsInternational] = React.useState(false); // Để xác định vận chuyển quốc tế

  const onFinish = async (values) => {
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success("Thông tin đơn hàng của bạn đã được gửi đi!");
        form.resetFields();
      } else {
        message.error("Đã xảy ra lỗi khi gửi đơn hàng.");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Đã xảy ra lỗi khi gửi đơn hàng.");
    }
  };

  const handleShippingMethodChange = (value) => {
    // Kiểm tra phương thức vận chuyển
    setIsInternational(value === "air"); // Giả sử chỉ phương thức hàng không là quốc tế
  };

  return (
    <div className="order-transportation">
      <h2>Đặt đơn vận chuyển cá Koi</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên cá Koi"
          name="koiName"
          rules={[{ required: true, message: "Vui lòng nhập tên cá Koi!" }]}
        >
          <Input placeholder="Nhập tên cá Koi" />
        </Form.Item>

        <Form.Item
          label="Số lượng"
          name="quantity"
          rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
        >
          <Input type="number" placeholder="Nhập số lượng" />
        </Form.Item>

        <Form.Item
          label="Dịch vụ chăm sóc khi vận chuyển"
          name="careService"
          rules={[
            { required: true, message: "Vui lòng chọn dịch vụ chăm sóc!" },
          ]}
        >
          <Select placeholder="Chọn dịch vụ chăm sóc">
            <Option value="basic">Chăm sóc cơ bản</Option>
            <Option value="premium">Chăm sóc cao cấp</Option>
            <Option value="deluxe">Chăm sóc đặc biệt</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Giấy chứng nhận của con cá"
          name="certificate"
          rules={[
            { required: true, message: "Vui lòng tải lên giấy chứng nhận!" },
          ]}
        >
          <Upload beforeUpload={() => false}>
            <Button icon={<UploadOutlined />}>Tải lên giấy chứng nhận</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Phương thức vận chuyển"
          name="shippingMethod"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn phương thức vận chuyển!",
            },
          ]}
        >
          <Select
            placeholder="Chọn phương thức vận chuyển"
            onChange={handleShippingMethodChange}
          >
            <Option value="air">
              Vận chuyển bằng đường hàng không (Quốc tế)
            </Option>
            <Option value="sea">Vận chuyển bằng đường biển</Option>
            <Option value="land">Vận chuyển bằng đường bộ (Nội địa)</Option>
          </Select>
        </Form.Item>

        {isInternational && (
          <Form.Item
            label="Tờ khai hải quan"
            name="customsDeclaration"
            rules={[
              { required: true, message: "Vui lòng tải lên tờ khai hải quan!" },
            ]}
          >
            <Upload beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>
                Tải lên tờ khai hải quan
              </Button>
            </Upload>
          </Form.Item>
        )}

        {!isInternational && (
          <>
            <Form.Item
              label="Địa điểm gửi"
              name="sendingLocation"
              rules={[
                { required: true, message: "Vui lòng nhập địa điểm gửi!" },
              ]}
            >
              <Input placeholder="Nhập địa điểm gửi" />
            </Form.Item>

            <Form.Item
              label="Địa điểm nhận"
              name="receivingLocation"
              rules={[
                { required: true, message: "Vui lòng nhập địa điểm nhận!" },
              ]}
            >
              <Input placeholder="Nhập địa điểm nhận" />
            </Form.Item>
          </>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Đặt hàng
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default OrderTransportation;
