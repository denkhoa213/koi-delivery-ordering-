import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  message,
  Row,
  Col,
  Card,
  Table,
} from "antd";
import api from "../../../../config/axios";
import { toast } from "react-toastify";

const { TextArea } = Input;

const HandoverForm = () => {
  const [form] = Form.useForm();
  const [packages, setPackages] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [handoverDocuments, setHandoverDocuments] = useState([]);

  useEffect(() => {
    fetchPackages();
    fetchOrders();
    const packageId = localStorage.getItem("selectedPackageId");
    if (packageId) {
      setSelectedPackageId(packageId);
    }
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await api.get("/package/view-all");
      setPackages(response.data.result);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get("/order/view-order-available");
      setOrders(response.data.result);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const fetchHandoverDocuments = async (orderId) => {
    try {
      const response = await api.get(
        `/handover-documents/view-by-order/${orderId}`
      );
      setHandoverDocuments(response.data.result || []);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleCreateHandover = async (values) => {
    const userId = localStorage.getItem("createBy");

    if (!userId) {
      message.error("User ID không hợp lệ");
      return;
    }

    if (!values.packageId || !values.orderId) {
      message.error("Vui lòng chọn gói và đơn hàng!");
      return;
    }

    try {
      const response = await api.post("/handover-documents/create", {
        userId,
        packageId: values.packageId,
        orderId: values.orderId,
        handoverDescription: values.handoverDescription,
      });

      if (response.data.code === 200 && response.data.result.id !== 0) {
        const handoverDocumentId = response.data.result.id;
        localStorage.setItem("handoverDocumentId", handoverDocumentId);

        toast.success("Handover created successfully!");
        form.resetFields();
      } else {
        toast.error(response.data.message || "Lỗi khi tạo handover!");
      }
    } catch (error) {
      toast.error("Lỗi khi tạo handover!");
    }
  };

  const deleteHandoverDocument = async (id) => {
    try {
      const response = await api.put(`/handover-documents/delete/${id}`);
      if (response.data.code === 200) {
        toast.success("Xóa biên bản bàn giao thành công!");
        fetchHandoverDocuments(form.getFieldValue("orderId"));
      } else {
        toast.error(response.data.message || "Lỗi khi xóa biên bản bàn giao!");
      }
    } catch (error) {
      toast.error("Lỗi khi xóa biên bản bàn giao!");
    }
  };

  const updateHandoverDocument = async (id, updatedDescription) => {
    try {
      const response = await api.put(`/handover-documents/update/${id}`, {
        handoverDescription: updatedDescription,
      });
      if (response.data.code === 200) {
        toast.success("Cập nhật biên bản bàn giao thành công!");
        fetchHandoverDocuments(form.getFieldValue("orderId"));
      } else {
        toast.error(
          response.data.message || "Lỗi khi cập nhật biên bản bàn giao!"
        );
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật biên bản bàn giao!");
    }
  };

  const columns = [
    {
      title: "Mã Biên Bản",
      dataIndex: "handoverNo",
      key: "handoverNo",
    },
    {
      title: "Mô Tả",
      dataIndex: "handoverDescription",
      key: "handoverDescription",
    },
    {
      title: "Phương Tiện",
      dataIndex: "vehicle",
      key: "vehicle",
    },
    {
      title: "Điểm Đến",
      dataIndex: "destination",
      key: "destination",
    },
    {
      title: "Điểm Khởi Hành",
      dataIndex: "departure",
      key: "departure",
    },
    {
      title: "Giá Trị Tổng",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => text.toLocaleString(),
    },
    {
      title: "Hành Động",
      key: "action",
      render: (_, record) => (
        <div>
          {/* Nút Cập Nhật */}
          <Button
            type="link"
            onClick={() => {
              const updatedDescription = prompt(
                "Nhập mô tả mới:",
                record.handoverDescription
              );
              if (updatedDescription) {
                updateHandoverDocument(record.id, updatedDescription);
              }
            }}
          >
            Cập Nhật
          </Button>
          {/* Nút Xóa */}
          <Button
            type="link"
            danger
            onClick={() => deleteHandoverDocument(record.id)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "30px", backgroundColor: "#f9fafb" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>
        Tạo Handover
      </h1>
      <Card
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "30px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Form form={form} onFinish={handleCreateHandover} layout="vertical">
          <Form.Item
            name="packageId"
            label="Chọn Gói"
            rules={[{ required: true, message: "Vui lòng chọn gói!" }]}
          >
            <Select
              placeholder="Chọn gói"
              style={{ width: "100%" }}
              value={selectedPackageId} // Set giá trị mặc định cho packageId
              onChange={(value) => setSelectedPackageId(value)} // Cập nhật giá trị khi chọn gói
            >
              {packages.map((pkg) => (
                <Select.Option key={pkg.id} value={pkg.id}>
                  {`${pkg.packageNo} - ${pkg.packageDescription}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="orderId"
            label="Chọn Đơn Hàng"
            rules={[{ required: true, message: "Vui lòng chọn đơn hàng!" }]}
          >
            <Select placeholder="Chọn đơn hàng" style={{ width: "100%" }}>
              {orders.map((order) => (
                <Select.Option key={order.id} value={order.id}>
                  {`Đơn hàng #${order.id}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="handoverDescription"
            label="Mô Tả Handover"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <TextArea rows={4} placeholder="Mô tả tình trạng handover..." />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "100%",
                backgroundColor: "#1abc9c",
                borderColor: "#1abc9c",
                borderRadius: "4px",
              }}
            >
              Tạo Handover
            </Button>
          </Form.Item>

          {/* Nút Xem Biên Bản Bàn Giao */}
          <Form.Item>
            <Button
              type="default"
              onClick={() =>
                fetchHandoverDocuments(form.getFieldValue("orderId"))
              }
              style={{
                width: "100%",
                marginTop: "10px",
                borderRadius: "4px",
              }}
            >
              Xem Biên Bản Bàn Giao
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Bảng hiển thị biên bản bàn giao */}
      <div style={{ marginTop: "30px" }}>
        <h2>Biên Bản Bàn Giao</h2>
        <Table
          columns={columns}
          dataSource={handoverDocuments}
          rowKey="id"
          pagination={false}
        />
      </div>
    </div>
  );
};

export default HandoverForm;
