import React, { useEffect, useState } from "react";
import api from "../../../../config/axios";
import { toast } from "react-toastify";
import { Button, Modal, Space, Table, Form, Input, Select } from "antd";
import { EditOutlined } from "@ant-design/icons";

function CheckHealthAndPakage() {
  const [showModal, setShowModal] = useState(false);
  const [showOrderAvailable, setShowOrderAvailable] = useState([]);
  const [form] = Form.useForm(); // Form instance

  // Fetch orders
  const fetchOrderAvailable = async () => {
    try {
      const response = await api.get("/order/view-order-available");
      setShowOrderAvailable(response.data.result);
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi tải đơn hàng.");
    }
  };

  // Handle form submit for health check
  const handleSubmit = async (values) => {
    // Lấy giá trị từ localStorage
    const orderDetailId = localStorage.getItem("orderDetailId");
    const packageId = localStorage.getItem("packageId");

    // Kiểm tra xem orderDetailId và packageId có tồn tại hay không
    if (!orderDetailId || !packageId) {
      toast.error("Thông tin đơn hàng hoặc gói hàng không hợp lệ.");
      return;
    }

    // Chuyển giá trị sang kiểu số nếu cần
    const orderDetailIdInt = parseInt(orderDetailId);
    const packageIdInt = parseInt(packageId);

    if (isNaN(orderDetailIdInt) || isNaN(packageIdInt)) {
      toast.error("Thông tin đơn hàng hoặc gói hàng không hợp lệ.");
      return;
    }

    try {
      const response = await api.post(
        `/checking-koi-health/create/${orderDetailIdInt}/${packageIdInt}`,
        {
          healthStatus: values.healthStatus,
          healthStatusDescription: values.healthStatusDescription,
          weight: values.weight,
          type: values.type,
          color: values.color,
          age: values.age,
        }
      );

      if (response.data.code === 0) {
        toast.success("Kiểm tra Koi thành công!");
        setShowModal(false); // Đóng modal
        form.resetFields(); // Reset các trường trong form
        fetchOrderAvailable(); // Tải lại danh sách đơn hàng sau khi kiểm tra sức khỏe
      } else {
        toast.error("Lỗi khi kiểm tra sức khỏe cá Koi.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra.");
    }
  };

  // Open modal when "Check" button is clicked
  const handleCheckClick = (order) => {
    // Lưu thông tin đơn hàng vào localStorage khi nhấn Check
    localStorage.setItem("orderDetailId", order.orderDetailId);
    localStorage.setItem("packageId", order.packageId);

    setShowModal(true); // Show modal
  };

  useEffect(() => {
    fetchOrderAvailable();
  }, []);

  // Columns for the table
  const columns = [
    {
      title: "Order Code",
      dataIndex: "orderCode",
      key: "orderCode",
    },
    {
      title: "Delivery Method",
      dataIndex: "deliveryMethod",
      key: "deliveryMethod",
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Destination",
      dataIndex: "destination",
      key: "destination",
    },
    {
      title: "Departure",
      dataIndex: "departure",
      key: "departure",
    },
    {
      title: "Distance",
      dataIndex: "distance",
      key: "distance",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => amount.toFixed(2),
    },
    {
      title: "VAT",
      dataIndex: "vat",
      key: "vat",
      render: (vat) => `${vat}%`,
    },
    {
      title: "VAT Amount",
      dataIndex: "vatAmount",
      key: "vatAmount",
      render: (vatAmount) => vatAmount.toFixed(2),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (totalAmount) => totalAmount.toFixed(2),
    },
    {
      title: "Health Status",
      dataIndex: "healthStatus",
      key: "healthStatus",
      render: (text) => (
        <span>
          {text === "HEALTHY"
            ? "Khỏe Mạnh"
            : text === "SICK"
            ? "Bệnh"
            : text === "DEAD"
            ? "Chết"
            : "Chưa Kiểm Tra"}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleCheckClick(record)}
          >
            Check
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table dataSource={showOrderAvailable} columns={columns} rowKey="id" />
      <Modal
        title="Kiểm Tra Sức Khỏe Cá Koi"
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="healthStatus"
            label="Tình Trạng Sức Khỏe"
            rules={[
              { required: true, message: "Vui lòng chọn tình trạng sức khỏe" },
            ]}
          >
            <Select>
              <Select.Option value="HEALTHY">Khỏe Mạnh</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="healthStatusDescription"
            label="Mô Tả Tình Trạng"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả tình trạng" },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="weight"
            label="Cân Nặng (kg)"
            rules={[{ required: true, message: "Vui lòng nhập cân nặng" }]}
          >
            <Input type="number" min={0} />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại"
            rules={[{ required: true, message: "Vui lòng nhập loại cá" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="color"
            label="Màu Sắc"
            rules={[{ required: true, message: "Vui lòng nhập màu sắc" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="age"
            label="Tuổi"
            rules={[{ required: true, message: "Vui lòng nhập tuổi cá" }]}
          >
            <Input type="number" min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CheckHealthAndPakage;
