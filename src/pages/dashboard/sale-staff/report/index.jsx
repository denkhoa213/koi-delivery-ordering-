import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Input, Form } from "antd";
import api from "../../../../config/axios"; // Đảm bảo đường dẫn đúng
import { toast } from "react-toastify";

function Report() {
  const [handoverData, setHandoverData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [answers, setAnswers] = useState({}); // Quản lý trả lời cho từng báo cáo
  const [loadingReportId, setLoadingReportId] = useState(null);

  useEffect(() => {
    const fetchHandoverData = async () => {
      try {
        const response = await api.get("/handover-documents/view-all");
        setHandoverData(response.data.result);
      } catch (err) {
        setError(
          err.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu"
        );
      }
    };

    fetchHandoverData();
  }, []);

  const handleViewReport = async (orderId) => {
    try {
      const response = await api.get(`/report/view-by-order/${orderId}`);
      setReportData(response.data.result); // Cập nhật dữ liệu báo cáo
      setIsModalVisible(true); // Hiển thị modal
    } catch (err) {
      toast.error(err.response?.data || "Không thể tải báo cáo");
    }
  };

  const handleAnswerChange = (reportId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [reportId]: value, // Cập nhật nội dung trả lời của từng báo cáo
    }));
  };

  const handleAnswerReport = async (reportId) => {
    setLoadingReportId(reportId);
    try {
      const data = {
        answer: answers[reportId], // Gửi nội dung trả lời của báo cáo tương ứng
      };
      const response = await api.put(`/report/answer/${reportId}`, data);
      toast.success(response.data.message);
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [reportId]: "", // Xóa nội dung trả lời sau khi gửi
      }));
      setIsModalVisible(false); // Đóng modal sau khi trả lời
    } catch (err) {
      toast.error(err.response?.data || "Không thể gửi câu trả lời");
    } finally {
      setLoadingReportId(null);
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
      render: (handoverStatusEnum) => {
        let statusColor = "#d9d9d9"; // Màu mặc định (xám)

        if (handoverStatusEnum === "COMPLETED") {
          statusColor = "#d9d9d9"; // Màu xanh cho COMPLETED
        }

        return (
          <span
            style={{
              backgroundColor: statusColor,
              color: "#fff",
              padding: "5px 10px",
              borderRadius: "5px",
            }}
          >
            {handoverStatusEnum}
          </span>
        );
      },
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

  return (
    <div>
      <h3>Danh sách Biên bản Bàn giao</h3>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <Table
          dataSource={handoverData}
          columns={handoverColumns}
          rowKey="handoverNo"
          pagination={{ pageSize: 10 }}
          bordered
          size="middle"
        />
      )}

      <Modal
        title="Báo Cáo"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        {reportData.length > 0 ? (
          reportData.map((report) => (
            <div key={report.id} style={{ marginBottom: "20px" }}>
              <div style={{ marginBottom: "10px" }}>
                <strong>Tiêu đề:</strong> {report.title}
              </div>
              <div style={{ marginBottom: "10px" }}>
                <strong>Mô tả:</strong> {report.description}
              </div>
              <div style={{ marginBottom: "10px" }}>
                <strong>Trả lời:</strong>{" "}
                {report.answer || "Chưa có câu trả lời"}
              </div>

              <Form
                layout="vertical"
                onFinish={() => handleAnswerReport(report.id)}
              >
                <Form.Item>
                  <Input.TextArea
                    rows={4}
                    value={answers[report.id] || ""} // Hiển thị nội dung riêng cho từng báo cáo
                    onChange={(e) =>
                      handleAnswerChange(report.id, e.target.value)
                    }
                    placeholder="Nhập trả lời ở đây..."
                    style={{
                      borderRadius: "8px",
                      border: "1px solid #d9d9d9",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
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
                  loading={loadingReportId === report.id}
                >
                  Trả lời
                </Button>
              </Form>
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
