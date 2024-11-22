import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../../config/axios";
import {
  Button,
  Modal,
  Space,
  Table,
  Form,
  Input,
  Upload,
  Popconfirm,
  Select, // Import Select for packageStatus
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import uploadFile from "../../../../utils/file";

function ManagePackage() {
  const [showModal, setShowModal] = useState(false);
  const [viewHandOver, setViewHandOver] = useState([]);
  const [viewPackages, setViewPackages] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null); // Thay thế localStorage
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [isEdit, setIsEdit] = useState(false); // Track if we're in edit mode
  const [editingPackage, setEditingPackage] = useState(null); // Store the package to be edited

  // Fetch danh sách handover
  const fetchHandOver = async () => {
    try {
      const response = await api.get(
        "/handover-documents/view-by-delivery-staff"
      );
      setViewHandOver(response.data.result);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching handovers");
    }
  };

  const handleViewPackages = async (orderId) => {
    try {
      const response = await api.get(`/package/view-by-order/${orderId}`);
      const packageData = response.data.result;
      setViewPackages([packageData]);
      setSelectedOrderId(orderId);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error fetching packages for this handover"
      );
    }
  };

  const handleEditPackage = (record) => {
    setIsEdit(true);
    setEditingPackage(record);
    setShowModal(true);

    form.setFieldsValue({
      description: record.packageDescription,
      image: record.image,
      packageStatus: record.packageStatus,
    });
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    if (!selectedOrderId) {
      toast.error("Order ID is required to create a package.");
      return;
    }

    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      try {
        const url = await uploadFile(file);
        values.image = url;
        toast.success("Tải lên hình ảnh thành công!");
      } catch (error) {
        toast.error("Lỗi khi tải lên hình ảnh!");
        return;
      }
    }

    try {
      let response;
      if (isEdit) {
        response = await api.put(`/package/update/${selectedOrderId}`, {
          ...values,
          id: editingPackage.id,
          packageDescription: values.description,
        });
      } else {
        // Tạo package mới
        response = await api.post(`/package/create/${selectedOrderId}`, values);
      }

      if (response.data.code === 200) {
        toast.success(response.data.message);
      }
      form.resetFields();
      setShowModal(false);
      handleViewPackages(selectedOrderId);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error processing request");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thay đổi file upload
  const handleUploadChange = (info) => {
    setFileList(info.fileList);
  };

  const handleDeletePackage = async (id) => {
    try {
      const response = await api.delete(`/package/delete/${id}`);
      if (response.data.code === 200) {
        toast.success("Xóa package thành công!");

        setViewPackages((prev) => prev.filter((pkg) => pkg.id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa package!");
    }
  };

  useEffect(() => {
    fetchHandOver();
  }, []);

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
      title: "Action",
      key: "action",
      render: (record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => {
              setShowModal(true);
              setSelectedOrderId(record.orderId);
              form.resetFields();
            }}
          >
            Tạo package
          </Button>
          <Button
            type="default"
            onClick={() => handleViewPackages(record.orderId)}
          >
            Xem package
          </Button>
        </Space>
      ),
    },
  ];

  const packageColumns = [
    {
      title: "Package No",
      dataIndex: "packageNo",
      key: "packageNo",
    },
    {
      title: "Description",
      dataIndex: "packageDescription",
      key: "packageDescription",
    },
    {
      title: "Status",
      dataIndex: "packageStatus",
      key: "packageStatus",
      render: (status) => (
        <span style={{ color: status === "UNPACKED" ? "orange" : "green" }}>
          {status}
        </span>
      ),
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={image}
          alt="Package"
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Created At",
      dataIndex: "createAt",
      key: "createAt",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditPackage(record)}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Bạn có chắc muốn xóa package này không?"
            onConfirm={() => handleDeletePackage(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="default" icon={<DeleteOutlined />} danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table dataSource={viewHandOver} columns={handoverColumns} rowKey="id" />

      <div style={{ marginTop: 20 }}>
        <h3>Danh sách Package</h3>
        <Table dataSource={viewPackages} columns={packageColumns} rowKey="id" />
      </div>

      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={() => form.submit()}
        title={isEdit ? "Chỉnh sửa Package" : "Tạo Package"}
        confirmLoading={loading}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Tải lên hình ảnh"
            name="image"
            rules={[{ required: true, message: "Vui lòng tải lên hình ảnh!" }]}
          >
            <Upload
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
            </Upload>
          </Form.Item>

          {isEdit && (
            <Form.Item
              name="packageStatus"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            >
              <Select
                defaultValue="UNPACKED"
                options={[
                  { value: "UNPACKED", label: "Chưa đóng gói" },
                  { value: "PACKED", label: "Đã đóng gói" },
                ]}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}

export default ManagePackage;
