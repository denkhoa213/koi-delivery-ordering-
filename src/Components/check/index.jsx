import axios from "axios";
import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import "./index.scss";

const HealthCheckForm = () => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      // Gửi dữ liệu tới MockAPI
      const response = await axios.post(
        "https://670575d9031fd46a83100cf4.mockapi.io/health-checks",
        values
      );

      if (response.status === 201) {
        message.success("Thông tin kiểm tra sức khỏe đã được gửi thành công!");
        form.resetFields(); // Reset form sau khi gửi
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi gửi thông tin, vui lòng thử lại!");
    }
  };

  return (
    <div className="health-check-form">
      <h2>Công ty nhận cá và kiểm tra sức khỏe</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Tên cá Koi"
          name="fishName"
          rules={[{ required: true, message: "Vui lòng nhập tên cá!" }]}
        >
          <Input placeholder="Nhập tên cá Koi" />
        </Form.Item>

        <Form.Item
          label="Tuổi (năm)"
          name="age"
          rules={[{ required: true, message: "Vui lòng nhập tuổi cá!" }]}
        >
          <Input type="number" placeholder="Nhập tuổi cá Koi" />
        </Form.Item>

        <Form.Item
          label="Kích thước (cm)"
          name="size"
          rules={[{ required: true, message: "Vui lòng nhập kích thước cá!" }]}
        >
          <Input type="number" placeholder="Nhập kích thước cá Koi" />
        </Form.Item>

        <Form.Item
          label="Số lượng"
          name="quantity"
          rules={[{ required: true, message: "Vui lòng nhập số lượng cá!" }]}
        >
          <Input type="number" placeholder="Nhập số lượng cá Koi" />
        </Form.Item>

        <Form.Item
          label="Tình trạng sức khỏe"
          name="healthStatus"
          rules={[
            { required: true, message: "Vui lòng nhập tình trạng sức khỏe!" },
          ]}
        >
          <Input.TextArea placeholder="Nhập tình trạng sức khỏe của cá Koi" />
        </Form.Item>

        <Form.Item label="Ghi chú" name="notes">
          <Input.TextArea placeholder="Nhập ghi chú nếu có" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Gửi thông tin
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default HealthCheckForm;
