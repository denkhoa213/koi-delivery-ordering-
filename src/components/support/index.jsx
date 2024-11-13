import React from "react";
import { Typography, Collapse, Row, Col } from "antd";
import { Link } from "react-router-dom";

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const Support = () => {
  const faqData = [
    {
      question: "Làm thế nào để đặt hàng vận chuyển cá Koi?",
      answer:
        "Bạn có thể truy cập trang đặt hàng, chọn các tùy chọn vận chuyển, nhập thông tin cá Koi của bạn và xác nhận đơn hàng.",
    },
    {
      question: "Tôi có thể theo dõi đơn hàng của mình không?",
      answer:
        "Có, sau khi đặt hàng thành công, bạn có thể theo dõi tình trạng đơn hàng trong thời gian thực trên trang quản lý đơn hàng.",
    },
    {
      question: "Phí vận chuyển được tính như thế nào?",
      answer:
        "Phí vận chuyển được tính dựa trên khối lượng của cá Koi, khoảng cách vận chuyển, và phương thức vận chuyển mà bạn chọn.",
    },
    {
      question: "Tôi có thể thay đổi hoặc hủy đơn hàng không?",
      answer:
        "Bạn có thể thay đổi hoặc hủy đơn hàng nếu đơn hàng chưa được vận chuyển. Vui lòng liên hệ với bộ phận hỗ trợ để biết thêm chi tiết.",
    },
    {
      question: "Có các phương thức thanh toán nào?",
      answer:
        "Chúng tôi chấp nhận thanh toán qua thẻ tín dụng, chuyển khoản ngân hàng, và thanh toán khi nhận hàng.",
    },
  ];

  return (
    <div style={{ padding: "50px", backgroundColor: "#f0f2f5" }}>
      <Title level={1} style={{ textAlign: "center", color: "#1890ff" }}>
        Hỗ Trợ - Koi Delivery Ordering System
      </Title>

      <Row gutter={16} style={{ marginTop: "30px" }}>
        <Col span={12}>
          <Title level={3}>Câu hỏi thường gặp (FAQ)</Title>
          <Collapse accordion>
            {faqData.map((faq, index) => (
              <Panel header={faq.question} key={index}>
                <Paragraph>{faq.answer}</Paragraph>
              </Panel>
            ))}
          </Collapse>
        </Col>
        <Col span={12}>
          <Title level={3}>Liên hệ hỗ trợ</Title>
          <Paragraph>
            Nếu bạn có bất kỳ câu hỏi nào khác hoặc cần sự hỗ trợ, đội ngũ của
            chúng tôi luôn sẵn sàng giúp đỡ.
          </Paragraph>
          <Paragraph>
            Email: <strong>support@koidelivery.com</strong>
          </Paragraph>
          <Paragraph>
            Điện thoại: <strong>0966 073 734</strong>
          </Paragraph>
          <Paragraph>
            Bạn cũng có thể gửi câu hỏi hoặc yêu cầu hỗ trợ trực tiếp qua trang{" "}
            <Link to="/contact">Liên Hệ</Link>.
          </Paragraph>
        </Col>
      </Row>

      <Title level={3} style={{ marginTop: "40px" }}>
        Thông tin bổ sung
      </Title>
      <Paragraph>
        Hệ thống đặt hàng vận chuyển Koi của chúng tôi cung cấp các giải pháp
        linh hoạt và an toàn cho việc vận chuyển cá Koi từ trại giống đến nhà
        của bạn. Với kinh nghiệm lâu năm trong ngành, chúng tôi cam kết mang lại
        sự hài lòng tuyệt đối cho khách hàng.
      </Paragraph>

      <Link
        to="/about"
        style={{
          marginTop: "20px",
          display: "inline-block",
          padding: "10px 20px",
          backgroundColor: "#1890ff",
          color: "#fff",
          borderRadius: "4px",
        }}
      >
        Tìm hiểu thêm về chúng tôi
      </Link>
    </div>
  );
};

export default Support;
