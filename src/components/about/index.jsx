import React from "react";
import { Typography, List, Row, Col, Button } from "antd";

const { Title, Paragraph } = Typography;

const About = () => {
  return (
    <div style={{ padding: "50px", backgroundColor: "#f9f9f9" }}>
      <Title level={1} style={{ textAlign: "center", color: "#1890ff" }}>
        Koi Delivery Ordering System
      </Title>

      <Row gutter={16} style={{ marginTop: "30px" }}>
        <Col span={12}>
          <Title level={3}>Giới thiệu</Title>
          <Paragraph>
            Hệ thống đặt hàng vận chuyển Koi được phát triển nhằm cung cấp một
            nền tảng tiện lợi và hiệu quả cho việc quản lý đặt hàng và vận
            chuyển cá Koi. Với sự kết hợp giữa công nghệ hiện đại và giao diện
            người dùng thân thiện, chúng tôi cam kết mang đến cho khách hàng
            trải nghiệm tốt nhất. Chúng tôi hiểu rằng cá Koi không chỉ là một
            loài cá, mà còn là một phần trong văn hóa và phong thủy của người
            Việt Nam.
          </Paragraph>
        </Col>
        <Col span={12}>
          <img
            src="https://plus.unsplash.com/premium_photo-1682090260563-191f8160ca48?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Koi Fish"
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </Col>
      </Row>

      <Title level={3} style={{ marginTop: "40px" }}>
        Tính năng chính
      </Title>
      <List
        size="large"
        bordered
        dataSource={[
          "Đặt hàng dễ dàng với các tùy chọn vận chuyển linh hoạt.",
          "Quản lý thông tin khách hàng và đơn hàng một cách hiệu quả.",
          "Theo dõi trạng thái đơn hàng trong thời gian thực.",
          "Hỗ trợ tư vấn và phản hồi từ đội ngũ chuyên viên.",
          "Giao diện thân thiện với người dùng, tối ưu cho mọi thiết bị.",
        ]}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />

      <Title level={3} style={{ marginTop: "40px" }}>
        Công nghệ và giải pháp
      </Title>
      <Paragraph>
        Hệ thống được xây dựng trên nền tảng hiện đại, giúp tối ưu hóa quy trình
        đặt hàng và vận chuyển. Chúng tôi sử dụng các công nghệ tiên tiến như{" "}
        <strong>React</strong> để phát triển giao diện người dùng và{" "}
        <strong>Ant Design</strong> để tạo ra trải nghiệm trực quan và thân
        thiện. Các giải pháp này cho phép khách hàng dễ dàng tương tác với hệ
        thống và nhận được dịch vụ nhanh chóng.
      </Paragraph>

      <Title level={3} style={{ marginTop: "40px" }}>
        Liên hệ với chúng tôi
      </Title>
      <Paragraph>
        Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ, vui lòng liên hệ với chúng
        tôi qua email: <strong>support@koidelivery.com</strong> hoặc gọi điện
        thoại đến số: <strong>(123) 456-7890</strong>.
      </Paragraph>
      <Button
        type="primary"
        style={{ marginTop: "20px" }}
        onClick={() => (window.location.href = "/contact")}
      >
        Liên hệ ngay
      </Button>
    </div>
  );
};

export default About;
