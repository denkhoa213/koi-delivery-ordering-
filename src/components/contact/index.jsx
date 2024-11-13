import React from "react";
import { Form, Input, Button, Row, Col, Typography } from "antd";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const Contact = () => {
  const onFinish = (values) => {
    console.log("Thông tin liên hệ:", values);
    // Xử lý gửi thông tin liên hệ ở đây, ví dụ gửi lên server hoặc hiển thị thông báo
  };

  return (
    <div style={{ padding: "50px", backgroundColor: "#f0f2f5" }}>
      <Title level={1} style={{ textAlign: "center", color: "#1890ff" }}>
        Liên Hệ Với Chúng Tôi
      </Title>

      <Row gutter={16} style={{ marginTop: "30px" }}>
        <Col span={12}>
          <Title level={3}>Thông tin liên hệ</Title>
          <Paragraph>
            Nếu bạn có bất kỳ câu hỏi nào về dịch vụ vận chuyển cá Koi hoặc cần
            hỗ trợ, vui lòng liên hệ với chúng tôi qua thông tin bên dưới hoặc
            sử dụng biểu mẫu liên hệ.
          </Paragraph>
          <Paragraph>
            Email: <strong>support@koidelivery.com</strong>
          </Paragraph>
          <Paragraph>
            Điện thoại: <strong>0966 073 734</strong>
          </Paragraph>
          <Paragraph>
            Địa chỉ:{" "}
            <strong>
              Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh 700000
            </strong>
          </Paragraph>
        </Col>

        <Col span={12}>
          <Title level={3}>Gửi Yêu Cầu Liên Hệ</Title>
          <Form
            name="contact"
            onFinish={onFinish}
            layout="vertical"
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <Form.Item
              label="Tên của bạn"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập tên của bạn!" },
              ]}
            >
              <Input placeholder="Nhập tên của bạn" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email của bạn!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input placeholder="Nhập email của bạn" />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số điện thoại của bạn!",
                },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Số điện thoại phải có 10 chữ số!",
                },
              ]}
            >
              <Input placeholder="Nhập số điện thoại của bạn" />
            </Form.Item>

            <Form.Item
              label="Nội dung"
              name="message"
              rules={[
                { required: true, message: "Vui lòng nhập nội dung liên hệ!" },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Nhập nội dung bạn muốn gửi đến chúng tôi"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Gửi Liên Hệ
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Contact;
