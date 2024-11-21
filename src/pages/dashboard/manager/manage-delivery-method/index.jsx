import React, { useState, useEffect } from "react";

import {
  Button,
  Input,
  Form,
  Table,
  Space,
  Modal,
  Popconfirm,
} from "antd";
import { toast } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import CSS của react-toastify
import api from "../../../../config/axios";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

function ManageDelivery() {
  const [deliveryMethod, setdeliveryMethod] = useState([]);
  const [showAddModal, setAddShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentDeliveryMethod, setcurrentDeliveryMethod] = useState(null);


  const fetchDelivery = async () => {
    try {
      const response = await api.get("/delivery-method/view-all");
      setdeliveryMethod(response.data.result);
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await api.post("/delivery-method/create", values);

      if (response.data.code === 200) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      fetchDelivery();
      form.resetFields();
      setAddShowModal(false);
    } catch (error) {
      toast.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const handleEditDeliveryMethod = async (deliveryMethodId, updateDeliveryMethod) => {
    try {
      const response = await api.put(`/delivery-method/update/${deliveryMethodId}`, {
        name: updateDeliveryMethod.name,
        description: updateDeliveryMethod.description,
        price: updateDeliveryMethod.price,
      });


      if (response.status === 200) {
        toast.success(' Delivery method updated successfully!');
        fetchDelivery();
      } else {
        toast.error('Failed to update delivery method');
      }
    } catch (error) {
      toast.error('Error editing delivery method: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/delivery-method/delete/${id}`);
      toast.success(response.data.message);
      fetchDelivery();
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const handleFinish = async (values) => {
    await handleEditDeliveryMethod(currentDeliveryMethod, values);
    setShowEditModal(false);
    form.resetFields();
  };

  useEffect(() => {
    fetchDelivery();
  }, []);

  const columns = [
    {
      title: "Tên phương tiện",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Created At",
      dataIndex: "createAt",
      key: "createAt",
      render: (text) => <span>{new Date(text).toLocaleDateString()}</span>,
    },

    {
      title: "Updated At",
      dataIndex: "updateAt",
      key: "updateAt",
      render: (text) => <span>{new Date(text).toLocaleDateString()}</span>,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id, deliveryMethod) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setcurrentDeliveryMethod(deliveryMethod.id)
              setShowEditModal(true);
              form.setFieldsValue(deliveryMethod);
            }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete"
            description="Do you want to delete this delivery method?"
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
        onClick={() => {
          setAddShowModal(true);
          form.resetFields();
          setFileList([]);
        }}
        style={{ marginBottom: "16px" }}
      >
        Add New User
      </Button>
      <Table dataSource={deliveryMethod} columns={columns} rowKey="id" />

      <Modal
        open={showAddModal}
        onCancel={() => setAddShowModal(false)}
        onOk={() => form.submit()}
        title="Add New Delivery Method"
        confirmLoading={loading}
        okText="Save"
        cancelText="Cancel"
        width={600}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Tên phương tiện"
            rules={[{ required: true, message: "Vui lòng nhập tên phương tiện!" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả phương tiện vận chuyển"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả phương tiện vận chuyển!" }
            ]}
          >
            <Input placeholder="Enter description" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá"
            rules={[
              { required: true, message: "Vui lòng nhập giá của loại cá" },
            ]}
          >
            <Input placeholder="Enter price" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Delivery Method Modal */}
      <Modal
        title="Edit Delivery Method"
        visible={showEditModal}
        onCancel={() => setShowEditModal(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          <Form.Item name="name" label="Tên phuơng tiện" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả phương tiện vận chuyển">
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManageDelivery;
