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
  Select,
} from "antd";
import { toast } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import CSS của react-toastify
import api from "../../../../config/axios";
import { BlockOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { UploadOutlined } from "@ant-design/icons";
import uploadFile from "../../../../utils/file";

function ManageUser() {
  const [users, setUsers] = useState([]);
  const [showAddModal, setAddShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const roles = [
    { id: 1, name: "Customer" },
    { id: 2, name: "MANAGER" },
    { id: 3, name: "DELIVERY_STAFF" },
    { id: 4, name: "SALE_STAFF" },
  ];

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
      setAddShowModal(false);
    } catch (error) {
      toast.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = (info) => {

    if (info.fileList.length === 0) {
      setFileList([]);
    } else {
      setFileList(info.fileList);
    }
  };


  const handleEditUser = async (userId, updatedUser) => {

    const payload = Object.fromEntries(
      Object.entries(updatedUser).filter(([_, value]) => value !== undefined && value !== null)
    );
    console.log("Payload gửi tới backend:", payload);

    try {
      const response = await api.put(`/customer/edit-user/${userId}`, payload);

      if (response.status === 200) {
        toast.success('User updated successfully!');
        fetchUsers();
      } else {
        toast.error('Failed to update user');
      }
    } catch (error) {
      toast.error('Error updating user: ' + error.message);
    }
  };


  const handleFinish = async (values) => {
    try {
      let avatarUrl = null;

      // Kiểm tra nếu có ảnh mới được tải lên
      if (fileList.length > 0) {
        const file = fileList[0].originFileObj;
        avatarUrl = await uploadFile(file); // Upload ảnh và lấy URL
      }

      // Tạo payload, chỉ thêm avatar nếu có cập nhật
      const payload = { ...values };
      if (avatarUrl) {
        payload.avatar = avatarUrl;
      }
      console.log("Payload trước khi gửi:", payload);

      await handleEditUser(currentUserId, payload); // Gửi payload tới API
      setShowEditModal(false);
      form.resetFields();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật thông tin");
    }
  };

  const handleBlockUnblockUser = async (userId, isBlocked) => {
    try {
      const action = isBlocked ? 'unblock' : 'block';
      const response = await api.put(`/customer/block-unblock/${userId}`, { action });

      if (response.status === 200) {
        toast.success(`User ${action}ed successfully!`);

        // Cập nhật trạng thái cục bộ
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, status: isBlocked ? 'VERIFIED' : 'BLOCKED' } : user
          )
        );
      }
    } catch (error) {
      toast.error('Không thể chặn tài khoản đang có đơn hàng trên hệ thống ');
    }
  };


  useEffect(() => {
    fetchUsers();

    if (!showEditModal) {
      setFileList([]); // Xóa fileList khi đóng modal
    }
  }, [showEditModal]);

  const columns = [
    {
      title: "Tên tài khoản",
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
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Ảnh đại diện",
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
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Trạng thái",
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
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setCurrentUserId(record.id);
              form.setFieldsValue(record);
              setFileList([{
                uid: record.avatar,
                name: 'avatar',
                url: record.avatar,
              }]);
              setShowEditModal(true);
            }}
          >
            Chỉnh sửa
          </Button>

          <Popconfirm
            title={record.status === "BLOCKED" ? "Unblock this user?" : "Block this user?"}
            onConfirm={() => handleBlockUnblockUser(record.id, record.status === "BLOCKED")}
          >
            <Button type="primary" danger icon={<BlockOutlined />}>
              {record.status === "BLOCKED" ? "Unblock" : "Block"}
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
        Thêm mới tài khoản
      </Button>
      <Table dataSource={users} columns={columns} rowKey="id" />

      <Modal
        open={showAddModal}
        onCancel={() => setAddShowModal(false)}
        onOk={() => form.submit()}
        title="Add New User"
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
            name="role"
            label="Role"
            rules={[
              { required: true, message: "Please input user's role !" },
            ]}
          >
            <Select>
              {roles.map((role) => (
                <Select.Option key={role.id} value={role.name}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        title="Chỉnh sửa thông tin người dùng"
        visible={showEditModal}
        onCancel={() => setShowEditModal(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            handleFinish({ ...values, avatar: fileList[0]?.originFileObj });
          }}
        >
          <Form.Item name="name" label="Tên">
            <Input placeholder="Enter name" />
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ">
            <Input placeholder="Enter address" />
          </Form.Item>

          <Form.Item name="phone" label="Số điện thoại">
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item name="avatar" label="Upload Avatar">
            <Upload
              beforeUpload={() => false} // Không tự động tải lên
              onChange={handleUploadChange}
              fileList={fileList}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div >
  );
}

export default ManageUser;
