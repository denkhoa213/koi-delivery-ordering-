import React, { useState, useEffect } from "react";

import {
  Button,
  Input,
  Form,
  Table,
  Space,
  Modal,
  Popconfirm,
  Upload,
} from "antd";
import { toast } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import CSS của react-toastify
import api from "../../../../config/axios";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { UploadOutlined } from "@ant-design/icons";
import uploadFile from "../../../../utils/file";

function ManageUser() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const fetchUsers = async () => {
    try {
      const response = await api.get("/customer/view-all");
      setUsers(response.data.result);
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const handleSubmit = async (values) => {
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      try {
        const url = await uploadFile(file);
        values.avatar = url;
        toast.success("Tải lên hình ảnh thành công!");
      } catch (error) {
        toast.error(error);
        return;
      }
    }
    try {
      setLoading(true);
      const response = await api.post("/customer/create-user", values);

      if (response.data.code === 200) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      fetchUsers();
      form.resetFields();
      setShowModal(false);
    } catch (error) {
      toast.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = (info) => {
    setFileList(info.fileList);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatarUrl) => (
        <img
          src={avatarUrl}
          alt="avatar"
          style={{ width: 50, height: 50, borderRadius: "50%" }}
        />
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          style={{
            color: status === "VERIFIED" ? "green" : "red",
            fontWeight: "bold",
          }}
        >
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
        Add New User
      </Button>
      <Table dataSource={users} columns={columns} rowKey="id" />

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
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input user's name!" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input user's email!" },
              { type: "email", message: "Please input a valid email!" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please input user's password!" },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[
              { required: true, message: "Please input user's address!" },
            ]}
          >
            <Input placeholder="Enter address" />
          </Form.Item>

          <Form.Item
            label="Tải lên hình ảnh"
            name="avatar"
            rules={[
              {
                required: true,
                message: "Vui lòng tải lên hình ảnh!",
              },
              {
                validator: (_, value) => {
                  if (!fileList.length) {
                    return Promise.reject(
                      "Bạn cần tải lên ít nhất một hình ảnh!"
                    );
                  }
                  // Kiểm tra định dạng và kích thước (ví dụ: file nhỏ hơn 5MB)
                  const isImage = fileList.every((file) =>
                    ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
                  );
                  const isSmallEnough = fileList.every(
                    (file) => file.size / 1024 / 1024 < 5
                  );

                  if (!isImage) {
                    return Promise.reject(
                      "Chỉ được tải lên file hình ảnh (JPEG, PNG)!"
                    );
                  }
                  if (!isSmallEnough) {
                    return Promise.reject("Hình ảnh phải nhỏ hơn 5MB!");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Upload
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false} // Ngăn chặn tự động tải lên
            >
              <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please input user's phone!" }]}
          >
            <Input placeholder="Enter phone" />
          </Form.Item>

          <Form.Item
            name="roleId"
            label="Role ID"
            rules={[
              { required: true, message: "Please input user's role ID!" },
            ]}
          >
            <Input
              type="number"
              placeholder="Enter role ID (0 for User, 1 for Admin)"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManageUser;
