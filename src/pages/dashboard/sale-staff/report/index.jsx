import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Input, Form, Card } from "antd";
import api from "../../../../config/axios";
import { toast } from "react-toastify";
import { DeleteOutlined } from "@ant-design/icons";

function Report() {
  const [orderData, setOrderData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [error, setError] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [answers, setAnswers] = useState({});
  const [loadingReportId, setLoadingReportId] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get("/order/view-all");
        setOrderData(response.data.result);
      } catch (err) {
        setError(
          err.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu"
        );
      }
    };

    fetchOrder();
  }, []);

  useEffect(() => {
    if (isModalVisible) {
      reportData.forEach((report) => {
        form.setFieldsValue({
          [`answer_${report.id}`]: answers[report.id] || "",
        });
      });
    }
  }, [isModalVisible, reportData, answers, form]);

  const handleViewReport = async (orderId) => {
    console.log("Fetching report for orderId:", orderId);
    if (!orderId) {
      toast.error("Mã đơn hàng không hợp lệ");
      return;
    }

    try {
      const response = await api.get(`/report/view-by-order/${orderId}`);
      setReportData(response.data.result);
      setIsModalVisible(true);

      setAnswers({});
      form.resetFields();
    } catch (err) {
      toast.error(err.response?.data || "Không thể tải báo cáo");
    }
  };

  const handleAnswerChange = (reportId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [reportId]: value,
    }));
  };

  const handleAnswerReport = async (reportId) => {
    console.log("Report ID:", reportId);
    console.log("Answer:", answers[reportId]);
    setLoadingReportId(reportId);
    try {
      const data = {
        answer: answers[reportId],
      };
      const response = await api.put(`/report/answer/${reportId}`, data);
      toast.success(response.data.message);

      // Cập nhật danh sách reportData
      setReportData((prevReports) =>
        prevReports.filter((report) => report.id !== reportId)
      );

      // Reset câu trả lời
      setAnswers((prevAnswers) => {
        const newAnswers = { ...prevAnswers };
        delete newAnswers[reportId];
        return newAnswers;
      });

      // Đóng Modal sau khi trả lời xong
      setIsModalVisible(false);

      form.resetFields();
    } catch (err) {
      toast.error(err.response?.data || "Không thể gửi câu trả lời");
    } finally {
      setLoadingReportId(null);
    }
  };

  const handleDeleteReport = async (reportId) => {
    try {
      const response = await api.delete(`/report/delete/${reportId}`);
      toast.success(response.data.message);

      // Cập nhật danh sách báo cáo sau khi xóa
      setReportData((prevReportData) =>
        prevReportData.filter((report) => report.id !== reportId)
      );
    } catch (err) {
      toast.error(err.response?.data || "Không thể xóa báo cáo");
    }
  };

  const orderColumns = [
    {
      title: "Mã đơn",
      dataIndex: "orderCode",
      key: "orderCode",
      width: 100,
    },
    {
      title: "Phương thức giao",
      dataIndex: "deliveryMethod",
      key: "deliveryMethod",
      width: 120,
    },
    {
      title: "Ngày đặt",
      dataIndex: "orderDate",
      key: "orderDate",
      width: 120,
    },
    {
      title: "Điểm đến",
      dataIndex: "destination",
      key: "destination",
      width: 150,
    },
    {
      title: "Khởi hành",
      dataIndex: "departure",
      key: "departure",
      width: 150,
    },
    {
      title: "Khoảng cách",
      dataIndex: "distance",
      key: "distance",
      width: 100,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 120,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 120,
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 120,
      render: (paymentStatus) => {
        let statusColor = "#d9d9d9";

        if (paymentStatus === "UNPAID") {
          statusColor = "#f5222d";
        } else if (paymentStatus === "PAID") {
          statusColor = "#52c41a";
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
            {paymentStatus}
          </span>
        );
      },
    },
    {
      title: "Xem báo cáo",
      key: "viewReport",
      render: (text, record) => (
        <Button onClick={() => handleViewReport(record.id)} type="primary">
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
          dataSource={orderData}
          columns={orderColumns}
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
        centered
      >
        {reportData.length > 0 ? (
          reportData.map((report) => (
            <Card
              key={report.id}
              style={{
                marginBottom: "20px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                position: "relative", // Để định vị nút xóa
              }}
            >
              <Button
                type="text"
                danger
                onClick={() => handleDeleteReport(report.id)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                }}
              >
                <DeleteOutlined />
              </Button>

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
                form={form}
                layout="vertical"
                onFinish={() => handleAnswerReport(report.id)}
              >
                <Form.Item
                  name={`answer_${report.id}`}
                  initialValue={answers[report.id] || ""}
                >
                  <Input.TextArea
                    rows={4}
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

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      marginTop: 10,
                      borderRadius: "8px",
                      backgroundColor: "#4CAF50",
                      borderColor: "#4CAF50",
                      width: "100%",
                    }}
                    loading={loadingReportId === report.id}
                  >
                    Trả lời
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          ))
        ) : (
          <p>Không có báo cáo nào cho đơn hàng này.</p>
        )}
      </Modal>
    </div>
  );
}

export default Report;
