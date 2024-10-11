import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  message,
  Steps,
  Card,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./index.scss"; // File SCSS cho styling nếu cần

const { Option } = Select;
const { Step } = Steps;

const OrderTransportation = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [isInternational, setIsInternational] = useState(false);

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
        setCurrentStep(0);
      } else {
        message.error("Đã xảy ra lỗi khi gửi đơn hàng.");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Đã xảy ra lỗi khi gửi đơn hàng.");
    }
  };

  const handleShippingMethodChange = (value) => {
    setIsInternational(value === "air");
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const steps = [
    {
      title: "Thông tin cá Koi",
      content: (
        <>
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
        </>
      ),
    },
    {
      title: "Dịch vụ chăm sóc",
      content: (
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
      ),
    },
    {
      title: "Phương thức vận chuyển",
      content: (
        <>
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
                {
                  required: true,
                  message: "Vui lòng tải lên tờ khai hải quan!",
                },
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
        </>
      ),
    },
  ];

  return (
    <div className="order-transportation">
      <Card title="Đặt đơn vận chuyển cá Koi" bordered={false}>
        <Steps current={currentStep}>
          {steps.map((step, index) => (
            <Step key={index} title={step.title} />
          ))}
        </Steps>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="steps-content">{steps[currentStep].content}</div>
          <div className="steps-action" style={{ marginTop: "20px" }}>
            {currentStep > 0 && (
              <Button style={{ margin: "0 8px" }} onClick={prevStep}>
                Quay lại
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={nextStep}>
                Tiếp theo
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="primary" htmlType="submit">
                Đặt hàng
              </Button>
            )}
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default OrderTransportation;
