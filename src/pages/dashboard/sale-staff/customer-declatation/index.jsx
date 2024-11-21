import {
  Button,
  DatePicker,
  Descriptions,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import uploadFile from "../../../../utils/file";
import { EyeOutlined, UploadOutlined } from "@ant-design/icons";
import api from "../../../../config/axios";
import moment from "moment";

function CustomerDeclaration() {
  const [form] = Form.useForm();
  const [viewOrders, setViewOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewDeclarationData, setViewDeclarationData] = useState(null);

  // Fetch all orders and set them in the state
  const fetchViewAllOrder = async () => {
    try {
      const response = await api.get("/order/view-all");
      setViewOrders(response.data.result); // Assuming response.data.result contains the orders
    } catch (error) {
      toast.error(
        error.response ? error.response.data : "Error fetching orders"
      );
    }
  };

  // Fetch customs declaration by orderId
  const fetchCustomsDeclaration = async (orderId) => {
    try {
      const response = await api.get(
        `/customs-declaration/view-by-order/${orderId}`
      );
      setViewDeclarationData(response.data.result); // Assuming response.data.result contains the declaration data
    } catch (error) {
      toast.error(
        error.response
          ? error.response.data
          : "Error fetching customs declaration"
      );
    }
  };

  // Open the create modal and fetch the customs declaration for the selected order
  const openCreateModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowCreateModal(true); // Open the create modal
  };

  // Open the view modal and fetch the customs declaration for the selected order
  const openViewModal = (orderId) => {
    setSelectedOrderId(orderId); // Save the selected order ID to state
    fetchCustomsDeclaration(orderId); // Fetch the declaration data for the selected order
    setShowViewModal(true); // Open the view modal
  };

  useEffect(() => {
    fetchViewAllOrder(); // Fetch orders when the component mounts
  }, []);

  const handleSubmit = async (values) => {
    // If a file is selected, upload it
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      try {
        const url = await uploadFile(file);
        values.image = url; // Add uploaded file URL to form values
      } catch (error) {
        toast.error("Image upload failed: " + error.message);
        return;
      }
    }

    // Ensure selectedOrderId is present before submitting
    if (!selectedOrderId) {
      toast.error("Please select an order first.");
      return;
    }

    try {
      // Submit the form data with the selected orderId
      const response = await api.post(
        `/customs-declaration/create/${selectedOrderId}`, // Use the selectedOrderId
        { ...values } // Include all form values
      );

      if (response.data.code === 200) {
        toast.success(response.data.message); // Show success message
        setShowCreateModal(false); // Close the create modal
        form.resetFields(); // Reset form fields
      } else {
        toast.error("Something went wrong: " + response.data.message); // Show error message
      }
    } catch (error) {
      toast.error(
        error.response ? error.response.data.message : "An error occurred!"
      );
    }
  };

  // Handle file upload changes
  const handleUploadChange = (info) => {
    setFileList(info.fileList);
  };

  const columns = [
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
        let statusColor = "#d9d9d9"; // Default color

        if (paymentStatus === "UNPAID") {
          statusColor = "#f5222d"; // Red for UNPAID
        } else if (paymentStatus === "PAID") {
          statusColor = "#52c41a"; // Green for PAID
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
        let statusColor = "#d9d9d9"; // Default color

        if (status === "IN_PROGRESS") {
          statusColor = "#52c41a"; // Green for IN_PROGRESS
        } else if (status === "AVAILABLE") {
          statusColor = "#ff8c00"; // Orange for AVAILABLE
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
          {/* Hiển thị nút "Tạo" nếu trạng thái là AVAILABLE */}
          {record.status === "AVAILABLE" && (
            <Button
              type="primary"
              onClick={() => openCreateModal(orderId)} // Mở modal tạo tờ khai
            >
              Tạo
            </Button>
          )}
          {/* Hiển thị nút "Xem" cho tất cả các trạng thái */}
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => openViewModal(orderId)} // Mở modal xem tờ khai
          >
            Xem
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table dataSource={viewOrders} columns={columns} />

      {/* Modal for creating a customs declaration */}
      <Modal
        open={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        onOk={() => form.submit()}
        title="Tạo tờ khai hải quan"
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Tên tờ khai" name="customsName">
            <Input />
          </Form.Item>

          <Form.Item label="Mã tờ khai" name="declarationNo">
            <Input />
          </Form.Item>

          <Form.Item label="Ngày tờ khai" name="declarationDate">
            <DatePicker showTime />
          </Form.Item>

          <Form.Item label="Người khai" name="declarationBy">
            <Input />
          </Form.Item>

          <Form.Item label="Mã tham chiếu" name="referenceNo">
            <Input />
          </Form.Item>

          <Form.Item label="Ngày tham chiếu" name="referenceDate">
            <DatePicker showTime />
          </Form.Item>

          <Form.Item label="Ảnh tờ khai" name="image">
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false} // Prevent automatic upload
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for viewing the customs declaration */}
      <Modal
        open={showViewModal}
        onCancel={() => setShowViewModal(false)}
        title="Chi tiết tờ khai hải quan"
        width={600}
        footer={null}
      >
        {viewDeclarationData ? (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Mã tờ khai">
              {viewDeclarationData.declarationNo}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tờ khai">
              {moment(viewDeclarationData.declarationDate).format(
                "DD/MM/YYYY HH:mm"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Người khai">
              {viewDeclarationData.declarationBy}
            </Descriptions.Item>
            <Descriptions.Item label="Mã tham chiếu">
              {viewDeclarationData.referenceCode}
            </Descriptions.Item>
            <Descriptions.Item label="Ảnh tờ khai">
              <img
                src={viewDeclarationData.image}
                alt="Ảnh tờ khai"
                style={{ width: "100%" }}
              />
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <p>Không có dữ liệu</p>
        )}
      </Modal>
    </div>
  );
}

export default CustomerDeclaration;
