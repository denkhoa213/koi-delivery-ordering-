import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Popconfirm,
  Upload,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";

import { toast } from "react-toastify";
import api from "../../../../config/axios";
import uploadFile from "../../../../utils/file";

const HealthcareHistoryManager = () => {
  const [handoverList, setHandoverList] = useState([]);
  const [healthcareHistories, setHealthcareHistories] = useState([]);
  const [selectedHandover, setSelectedHandover] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [formSubmit] = Form.useForm();

  // Fetch list of handovers
  const fetchHandOver = async () => {
    try {
      const response = await api.get(
        "/handover-documents/view-by-delivery-staff"
      );
      setHandoverList(response.data.result);
    } catch (error) {
      toast.error("Không thể lấy danh sách bàn giao.");
    }
  };

  useEffect(() => {
    fetchHandOver();
  }, []);

  const fetchHealthcareHistories = async (handoverDocumentId) => {
    try {
      const response = await api.get(
        `/healthcare-delivery-histories/view-by-handover/${handoverDocumentId}`
      );
      setHealthcareHistories(response.data.result);
    } catch (error) {
      toast.error("Không thể lấy lịch sử chăm sóc sức khỏe.");
    }
  };

  // Handle view details
  const handleViewDetails = (handoverDocumentId) => {
    setSelectedHandover(handoverDocumentId);
    fetchHealthcareHistories(handoverDocumentId);
  };

  // Handle create or edit submission
  const handleSubmit = async (values) => {
    try {
      if (isEditMode && editingRecord) {
        // Update healthcare history
        await api.put(
          `/healthcare-delivery-histories/update/${editingRecord.id}`,
          values
        );
        toast.success("Cập nhật thành công!");
      } else {
        // Create new healthcare history
        if (!selectedHandover) {
          toast.error("Vui lòng chọn bàn giao để tạo mới.");
          return;
        }
        await api.post(
          `/healthcare-delivery-histories/create/${selectedHandover}`,
          values
        );
        toast.success("Tạo mới thành công!");
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchHealthcareHistories(selectedHandover); // Refresh healthcare histories
    } catch (error) {
      toast.error("Có lỗi xảy ra trong quá trình xử lý.");
    }
  };

  const handleUpdateSubmit = async (values) => {
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
    if (!selectedHandover) {
      toast.error("Không có ID bàn giao được chọn!");
      return;
    }

    try {
      const response = await api.put(
        `/handover-documents/update/${selectedHandover}`,
        values
      );
      toast.success(response.data.message);

      form.resetFields();
      setShowModal(false);
      fetchHandOver(); // Refresh data after update
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật thông tin bàn giao.");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await api.delete(`/healthcare-delivery-histories/delete/${id}`);
      toast.success("Xóa thành công!");
      setHealthcareHistories(
        healthcareHistories.filter((item) => item.id !== id)
      );
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa bản ghi.");
    }
  };

  const handleUploadChange = (info) => {
    setFileList(info.fileList);
  };

  // Handle edit
  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsEditMode(true);
    setIsModalVisible(true);
    form.setFieldsValue(record);
  };

  // Columns for handover list
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
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedHandover(record.id);
              setIsModalVisible(true);
              setIsEditMode(false);
              form.resetFields();
            }}
          >
            Tạo lịch sử chăm sóc
          </Button>
          <Button type="default" onClick={() => handleViewDetails(record.id)}>
            Xem lịch sử
          </Button>

          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => {
              setShowModal(true);
            }}
          >
            Bàn giao
          </Button>
        </Space>
      ),
    },
  ];

  // Columns for healthcare history list
  const historyColumns = [
    {
      title: "Lộ trình",
      dataIndex: "route",
      key: "route",
    },
    {
      title: "Mô tả chăm sóc sức khỏe",
      dataIndex: "healthDescription",
      key: "healthDescription",
    },
    {
      title: "Mô tả ăn uống",
      dataIndex: "eatingDescription",
      key: "eatingDescription",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button icon={<DeleteOutlined />} danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Danh sách bàn giao</h2>
      <Table
        columns={handoverColumns}
        dataSource={handoverList}
        rowKey="id"
        pagination={false}
      />

      {selectedHandover && (
        <>
          <h2>Chi tiết lịch sử chăm sóc sức khỏe</h2>
          <Table
            columns={historyColumns}
            dataSource={healthcareHistories}
            rowKey="id"
            pagination={false}
          />
        </>
      )}

      {/* Modal for create/edit */}
      <Modal
        title={
          isEditMode
            ? "Chỉnh sửa lịch sử chăm sóc sức khỏe"
            : "Tạo mới lịch sử chăm sóc sức khỏe"
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Lộ trình"
            name="route"
            rules={[{ required: true, message: "Vui lòng nhập lộ trình!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mô tả chăm sóc sức khỏe"
            name="healthDescription"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mô tả chăm sóc sức khỏe!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mô tả ăn uống"
            name="eatingDescription"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả ăn uống!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditMode ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Cập nhật thông tin bàn giao"
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={() => formSubmit.submit()}
      >
        <Form form={formSubmit} layout="vertical" onFinish={handleUpdateSubmit}>
          <Form.Item
            label="Mô tả bàn giao"
            name="handoverDescription"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả bàn giao!" },
            ]}
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
        </Form>
      </Modal>
    </div>
  );
};

export default HealthcareHistoryManager;
