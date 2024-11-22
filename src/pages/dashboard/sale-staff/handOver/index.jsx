import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../../config/axios";
import {
  Button,
  Col,
  Divider,
  Form,
  Image,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";

function HandoverForm() {
  const [viewOrders, setViewOrders] = useState([]);
  const [viewDeliveryStaff, setViewDeliveryStaff] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [handoverDetails, setHandoverDetails] = useState(null);
  const [form] = Form.useForm();

  const fetchViewAllOrder = async () => {
    try {
      const response = await api.get("/order/view-all");
      setViewOrders(response.data.result);
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const fetchDeliveryStaff = async () => {
    try {
      const response = await api.get("/customer/view-delivery-staff");
      const deliveryStaff = response.data.result;
      setViewDeliveryStaff(deliveryStaff);
      if (deliveryStaff && deliveryStaff.length > 0) {
        setUserId(deliveryStaff[0].id);
      }
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const handleViewHandover = async (orderId) => {
    try {
      const response = await api.get(
        `/handover-documents/view-by-order/${orderId}`
      );
      setSelectedOrderId(orderId);
      setHandoverDetails(response.data.result);
      setShowViewModal(true);
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  // Hàm handleCreateHandOver
  const handleCreateHandOver = async (values) => {
    try {
      const response = await api.post("/handover-documents/create", {
        ...values,
        orderId: selectedOrderId,
      });

      // Kiểm tra mã trả về từ server
      if (response.data.code === 200) {
        toast.success(response.data.message);
        setShowModal(false);
        form.resetFields();
        fetchViewAllOrder();
      }
    } catch (error) {
      toast.error(error.response?.data || "Có lỗi xảy ra!");
    }
  };

  const handleDelete = async (orderId) => {
    try {
      const response = await api.delete(
        `/handover-documents/delete/${orderId}`
      );
      setSelectedOrderId(orderId);
      toast.success(response.data.message);

      fetchViewAllOrder();
    } catch (error) {
      toast.error(
        error.response?.data || "Có lỗi xảy ra khi xóa biên bản bàn giao!"
      );
    }
  };

  useEffect(() => {
    fetchViewAllOrder();
    fetchDeliveryStaff();
  }, []);

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "orderCode",
      key: "orderCode",
      width: 100, // Giảm kích thước cột
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
        let statusColor = "#d9d9d9"; // Màu mặc định

        if (paymentStatus === "UNPAID") {
          statusColor = "#f5222d"; // Màu đỏ cho trạng thái UNPAID
        } else if (paymentStatus === "PAID") {
          statusColor = "#52c41a"; // Màu xanh cho trạng thái PAID
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
      title: "Trạng thái đơn",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        let statusColor = "#d9d9d9"; // Màu mặc định

        if (status === "IN_PROGRESS") {
          statusColor = "#52c41a"; // Màu xanh cho trạng thái IN_PROGRESS
        } else if (status === "AVAILABLE") {
          statusColor = "#ff8c00"; // Màu xanh dương cho trạng thái AVAILABLE
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
            {status}
          </span>
        );
      },
    },
    {
      title: "Hành động",
      dataIndex: "id",
      key: "id",
      width: 180,
      render: (orderId, record) => (
        <Space size="middle">
          {record.status === "AVAILABLE" && (
            <>
              <Button
                type="primary"
                onClick={() => {
                  setSelectedOrderId(orderId);
                  setShowModal(true); // Mở modal
                }}
              >
                Tạo
              </Button>
              <Button
                type="default"
                onClick={() => handleViewHandover(orderId)} // Xem
                icon={<EyeOutlined />}
              >
                Xem
              </Button>
              <Popconfirm
                title="Xóa"
                description="Bạn có muốn xóa biên bản bàn giao này không?"
                onConfirm={() => handleDelete(orderId)}
              >
                <Button type="primary" danger icon={<DeleteOutlined />}>
                  Xóa
                </Button>
              </Popconfirm>
            </>
          )}
          {record.status === "IN_PROGRESS" && (
            <Button
              type="default"
              onClick={() => handleViewHandover(orderId)} // Xem
              icon={<EyeOutlined />}
            >
              Xem
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table dataSource={viewOrders} columns={columns} />

      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleCreateHandOver} layout="vertical">
          <Form.Item
            label="Phân công:"
            name="userId"
            rules={[{ required: true, message: "Vui lòng chọn nhân viên!" }]}
          >
            <Select
              placeholder="Chọn Staff"
              value={userId}
              onChange={(value) => setUserId(value)}
            >
              {viewDeliveryStaff.map((staff) => (
                <Select.Option key={staff.id} value={staff.id}>
                  {staff.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Typography.Paragraph hidden>
            <strong>Order ID:</strong> {selectedOrderId}
          </Typography.Paragraph>

          <Form.Item
            label="Mô tả Giao hàng"
            name="handoverDescription"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <Input.TextArea placeholder="Nhập mô tả giao hàng" rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={showViewModal}
        onCancel={() => setShowViewModal(false)}
        footer={null}
        width={900}
      >
        {handoverDetails ? (
          <div style={{ padding: "20px" }}>
            <Typography.Title
              level={4}
              style={{ marginBottom: "20px", textAlign: "center" }}
            >
              Chi Tiết Biên Bản Bàn Giao
            </Typography.Title>

            <Row gutter={16} style={{ marginBottom: "10px" }}>
              <Col span={8}>
                <Typography.Text strong style={{ color: "#000" }}>
                  Số Biên Bản:
                </Typography.Text>
                <p>{handoverDetails.handoverNo}</p>
              </Col>
              <Col span={8}>
                <Typography.Text strong style={{ color: "#000" }}>
                  Mô Tả:
                </Typography.Text>
                <p>{handoverDetails.handoverDescription}</p>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: "10px" }}>
              <Col span={8}>
                <Typography.Text strong style={{ color: "#000" }}>
                  Phương Tiện:
                </Typography.Text>
                <p>{handoverDetails.vehicle}</p>
              </Col>
              <Col span={8}>
                <Typography.Text strong style={{ color: "#000" }}>
                  Điểm Đến:
                </Typography.Text>
                <p>{handoverDetails.destination}</p>
              </Col>
              <Col span={8}>
                <Typography.Text strong style={{ color: "#000" }}>
                  Điểm Khởi Hành:
                </Typography.Text>
                <p>{handoverDetails.departure}</p>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: "10px" }}>
              <Col span={8}>
                <Typography.Text strong style={{ color: "#000" }}>
                  Tổng Giá:
                </Typography.Text>
                <p>{handoverDetails.totalPrice}</p>
              </Col>
            </Row>

            <Divider style={{ margin: "20px 0" }} />

            <Row gutter={16} style={{ marginBottom: "20px" }}>
              <Col span={8}>
                <Typography.Text strong style={{ color: "#000" }}>
                  Hình Ảnh:
                </Typography.Text>
                <div style={{ textAlign: "center", marginTop: "10px" }}>
                  <Image
                    src={handoverDetails.image}
                    alt="Handover Document"
                    style={{
                      width: "100%",
                      maxHeight: "300px",
                      objectFit: "contain",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </div>
              </Col>
            </Row>

            <Divider style={{ margin: "20px 0" }} />

            <Row gutter={16} style={{ marginBottom: "10px" }}>
              <Col span={8}>
                <Typography.Text strong style={{ color: "#000" }}>
                  Trạng Thái Bàn Giao:
                </Typography.Text>
                <Typography.Text
                  style={{
                    color:
                      handoverDetails.handoverStatusEnum === "IN_PROGRESS"
                        ? "#52c41a"
                        : "#fa8c16",
                    fontWeight: "bold",
                  }}
                >
                  {handoverDetails.handoverStatusEnum}
                </Typography.Text>
              </Col>
            </Row>
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#999" }}>
            Không có biên bản bàn giao để hiển thị.
          </p>
        )}
      </Modal>
    </div>
  );
}

export default HandoverForm;
