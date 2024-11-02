import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../../config/axios";

const { Option } = Select;

function ManagePackage() {
  const [showModal, setShowModal] = useState(false);
  const [showPackage, setShowPackage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // Create form instance

  const fetchViewAllPackage = async () => {
    try {
      const response = await api.get("/package/view-all");
      setShowPackage(response.data.result);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred!");
    }
  };

  const handleCreatePackage = async (values) => {
    setLoading(true);
    try {
      await api.post("/package/create", values);
      toast.success("Package created successfully!");
      form.resetFields(); // Reset form fields after submission
      setShowModal(false); // Close modal after submission
      fetchViewAllPackage(); // Refresh package list
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create package!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViewAllPackage();
  }, []);

  const columns = [
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
      title: "Package Date",
      dataIndex: "packageDate",
      key: "packageDate",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Status",
      dataIndex: "packageStatus",
      key: "packageStatus",
      render: (status) => (
        <span style={{ color: status === "AVAILABLE" ? "green" : "red" }}>
          {status}
        </span>
      ),
    },
    {
      title: "Packaged By",
      dataIndex: "packageBy",
      key: "packageBy",
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "action",
      render: (id) => (
        <Space size="middle">
          <Button type="link">Edit</Button>
          <Button type="link" danger>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setShowModal(true)}
        style={{ marginBottom: "16px" }}
      >
        Add Package
      </Button>

      <Table dataSource={showPackage} columns={columns} rowKey="id" />

      <Modal
        title="Create Package"
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={() => form.submit()} // Submit the form on OK button click
        confirmLoading={loading} // Show loading spinner on submit
      >
        <Form
          form={form} // Bind form instance to the Form
          name="packageForm"
          layout="vertical"
          onFinish={handleCreatePackage}
        >
          <Form.Item
            label="Package Description"
            name="packageDescription"
            rules={[
              { required: true, message: "Please input package description!" },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Package Date"
            name="packageDate"
            rules={[{ required: true, message: "Please select package date!" }]}
          >
            <DatePicker showTime />
          </Form.Item>

          <Form.Item
            label="Package Status"
            name="packageStatus"
            rules={[
              { required: true, message: "Please select package status!" },
            ]}
          >
            <Select placeholder="Select status">
              <Option value="UNPACKED">Unpacked</Option>
              <Option value="PACKING">Packing</Option>
              <Option value="PACKED">Packed</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Packaged By"
            name="packageBy"
            rules={[
              {
                required: true,
                message: "Please input who packed the package!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManagePackage;
