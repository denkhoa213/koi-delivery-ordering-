import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Spin,
  Alert,
  Input,
  Form,
  Row,
  Col,
  Card,
} from "antd";
import api from "../../../../config/axios"; // Đảm bảo đường dẫn đúng
import { toast } from "react-toastify";

function Report() {
  const [handoverData, setHandoverData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null); // Báo cáo được chọn
  const [isModalVisible, setIsModalVisible] = useState(false); // Hiển thị modal
  const [answer, setAnswer] = useState(""); // Trả lời của người dùng

  useEffect(() => {
    const fetchHandoverData = async () => {
      try {
        const response = await api.get("/handover-documents/view-all");
        setHandoverData(response.data.result);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu"
        );
        setLoading(false);
      }
    };

    fetchHandoverData();
  }, []);

  const handleViewReport = async (orderId) => {
    try {
      setLoading(true);
      const response = await api.get(`/report/view-by-order/${orderId}`);
      setReportData(response.data.result);
      setSelectedReport(response.data.result);
      setIsModalVisible(true); // Mở modal
      setLoading(false);
    } catch (err) {
      toast.error(err.response.data);
      setLoading(false);
    }
  };

  const handleAnswerReport = async (reportId) => {
    try {
      const data = {
        answer: answer,
      };
      const response = await api.put(`/report/answer/${reportId}`, data);
      toast.success(response.data.message);
      setIsModalVisible(false);
      setAnswer("");
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const handoverColumns = [
    {
      title: "Số biên bản bàn giao",
      dataIndex: "handoverNo",
      key: "handoverNo",
    },
    {
      title: "Mô tả",
      dataIndex: "handoverDescription",
      key: "handoverDescription",
    },
    {
      title: "Phương tiện",
      dataIndex: "vehicle",
      key: "vehicle",
    },
    {
      title: "Điểm đến",
      dataIndex: "destination",
      key: "destination",
    },
    {
      title: "Điểm khởi hành",
      dataIndex: "departure",
      key: "departure",
    },
    {
      title: "Tổng giá",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => <span>{text.toLocaleString()} VNĐ</span>,
    },
    {
      title: "Trạng thái bàn giao",
      dataIndex: "handoverStatusEnum",
      key: "handoverStatusEnum",
    },
    {
      title: "Xem báo cáo",
      key: "viewReport",
      render: (text, record) => (
        <Button onClick={() => handleViewReport(record.orderId)} type="primary">
          Xem Báo Cáo
        </Button>
      ),
    },
  ];

  if (loading) {
    return <Spin size="large" tip="Đang tải dữ liệu..." />;
  }

  if (error) {
    return <Alert message={error} type="error" showIcon />;
  }

  return (
    <div>
      <h3>Danh sách Biên bản Bàn giao</h3>
      <Table
        dataSource={handoverData}
        columns={handoverColumns}
        rowKey="handoverNo"
        pagination={{ pageSize: 10 }}
        bordered
        size="middle"
      />

      <Modal
        title="Báo Cáo"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedReport && selectedReport.length > 0 ? (
          selectedReport.map((report) => (
            <div key={report.id} style={{ marginBottom: "20px" }}>
              <Card style={{ marginBottom: "20px" }} bordered={false}>
                <Row gutter={16}>
                  <Col span={8}>
                    <strong>Tiêu đề:</strong>
                  </Col>
                  <Col span={16}>{report.title}</Col>
                </Row>
                <Row gutter={16}>
                  <Col span={8}>
                    <strong>Mô tả:</strong>
                  </Col>
                  <Col span={16}>{report.description}</Col>
                </Row>
                <Row gutter={16}>
                  <Col span={8}>
                    <strong>Trả lời:</strong>
                  </Col>
                  <Col span={16}>{report.answer || "Chưa có câu trả lời"}</Col>
                </Row>
              </Card>

              <Card title="Trả lời báo cáo" bordered={false}>
                <Form
                  layout="vertical"
                  onFinish={() => handleAnswerReport(report.id)}
                >
                  <Form.Item label="Trả lời">
                    <Input.TextArea
                      rows={4}
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Nhập trả lời ở đây..."
                      style={{ borderRadius: "8px" }}
                    />
                  </Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      marginTop: 10,
                      borderRadius: "8px",
                      backgroundColor: "#4CAF50",
                      borderColor: "#4CAF50",
                    }}
                  >
                    Trả lời
                  </Button>
                </Form>
              </Card>
            </div>
          ))
        ) : (
          <p>Không có báo cáo nào cho đơn hàng này.</p>
        )}
      </Modal>
    </div>
  );
}

export default Report;
