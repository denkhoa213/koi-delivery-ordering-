import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Button, Form, Input, Modal, Popconfirm, Table, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import api from "../../../../config/axios";

function ManageHealthService() {
  const [healthService, setHealthService] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  //GET
  const fetchHealthService = async () => {
    try {
      const response = await api.get("heal-service-category/view-all");
      setHealthService(response.data.result);
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  //CREATE OR UPDATE
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      let response;
      if (values.id) {
        // => Update
        response = await api.put(
          `heal-service-category/update/${values.id}`,
          values
        );
      } else {
        // => Create
        response = await api.post("heal-service-category/create", values);
      }

      if (response.data.code === 200) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      fetchHealthService();
      form.resetFields();
      setShowModal(false);
    } catch (error) {
      toast.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  //DELETE
  const handleDelete = async (id) => {
    try {
      const response = await api.put(`heal-service-category/delete/${id}`);
      toast.success(response.data.message);
      fetchHealthService();
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  useEffect(() => {
    fetchHealthService();
  }, []);

  const columns = [
    {
      title: "Service Name",
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: "Service Description",
      dataIndex: "serviceDescription",
      key: "serviceDescription",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price}`,
    },
    {
      title: "Created At",
      dataIndex: "createAt",
      key: "createAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Updated At",
      dataIndex: "updateAt",
      key: "updateAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span style={{ color: status === "AVAILABLE" ? "green" : "red" }}>
          {status}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id, category) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setShowModal(true);
              form.setFieldsValue(category);
            }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete"
            description="Do you want to delete this category?"
            onConfirm={() => handleDelete(id)}
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
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
        Add New Service
      </Button>
      <Table dataSource={healthService} columns={columns} rowKey="id" />

      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={() => form.submit()}
        title="Health Service Category"
        confirmLoading={loading}
        okText="Save"
        cancelText="Cancel"
        width={600}
      >
        <Form
          form={form}
          labelCol={{
            span: 24,
          }}
          onFinish={handleSubmit}
          layout="vertical"
          title="Health Service"
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            name="serviceName"
            label="Service Name"
            rules={[
              {
                required: true,
                message: "Please input the service name!",
              },
            ]}
          >
            <Input placeholder="Enter service name" />
          </Form.Item>

          <Form.Item
            name="serviceDescription"
            label="Service Description"
            rules={[
              {
                required: true,
                message: "Please input the service description!",
              },
            ]}
          >
            <Input.TextArea placeholder="Enter service description" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[
              {
                required: true,
                message: "Please input the price!",
              },
            ]}
          >
            <Input placeholder="Enter price" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManageHealthService;
