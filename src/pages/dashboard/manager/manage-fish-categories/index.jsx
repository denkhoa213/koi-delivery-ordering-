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

function ManageFishCategory() {
  const [fishCategory, setFishCategory] = useState([]);
  const [showAddModal, setAddShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentFishCateogry, setCurrentFishCateogry] = useState(null);


  const fetchFishCategory = async () => {
    try {
      const response = await api.get("/fish-category/view-all");
      setFishCategory(response.data.result);
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await api.post("/fish-category/create", values);

      if (response.data.code === 200) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      fetchFishCategory();
      form.resetFields();
      setAddShowModal(false);
    } catch (error) {
      toast.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const handleEditFishCategory = async (fishCategoryId, updateFishCategory) => {
    try {
      const response = await api.put(`/fish-category/update/${fishCategoryId}`, {
        fishCategoryName: updateFishCategory.fishCategoryName,
        fishCategoryDescription: updateFishCategory.fishCategoryDescription,
        price: updateFishCategory.price,
      });


      if (response.status === 200) {
        toast.success('Fish Category updated successfully!');
        fetchFishCategory();
      } else {
        toast.error('Failed to update fish category');
      }
    } catch (error) {
      toast.error('Error editing fish category: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`fish-category/delete/${id}`);
      toast.success(response.data.message);
      fetchFishCategory();
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const handleFinish = async (values) => {
    await handleEditFishCategory(currentFishCateogry, values);
    setShowEditModal(false);
    form.resetFields();
  };

  useEffect(() => {
    fetchFishCategory();
  }, []);

  const columns = [
    {
      title: "Tên loại cá",
      dataIndex: "fishCategoryName",
      key: "fishCategoryName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Mô tả",
      dataIndex: "fishCategoryDescription",
      key: "fishCategoryDescription",
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
      render: (id, category) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setCurrentFishCateogry(category.id)
              setShowEditModal(true);
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
        onClick={() => setAddShowModal(true)}
        style={{ marginBottom: "16px" }}
      >
        Add New User
      </Button>
      <Table dataSource={fishCategory} columns={columns} rowKey="id" />

      <Modal
        open={showAddModal}
        onCancel={() => setAddShowModal(false)}
        onOk={() => form.submit()}
        title="Add New Fish Category"
        confirmLoading={loading}
        okText="Save"
        cancelText="Cancel"
        width={600}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="fishCategoryName"
            label="Tên loại cá"
            rules={[{ required: true, message: "Vui lòng nhập tên loại cá!" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>

          <Form.Item
            name="fishCategoryDescription"
            label="Mô tả loại cá"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả loại cá bạn muốn nhập!" }
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

      {/* Edit Fish Category Modal */}
      <Modal
        title="Edit Fish Category"
        visible={showEditModal}
        onCancel={() => setShowEditModal(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          <Form.Item name="fishCategoryName" label="Tên loại cá" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="fishCategoryDescription" label="Mô tả loại cá">
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

export default ManageFishCategory;
