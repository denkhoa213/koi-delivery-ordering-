import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Space,
  Card,
  Typography,
  Row,
  Col,
  Spin,
  Form,
  Input,
  Modal,
  Upload,
} from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { AiOutlineLogout } from "react-icons/ai"; // Logout icon
import { logout } from "../../redux/features/userSlice";
import { toast } from "react-toastify";
import api from "../../config/axios";
import uploadFile from "../../utils/file";

const { Title, Text } = Typography;

const Profile = () => {
  const dispatch = useDispatch();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/customer/view-profile");
      setUserProfile(response.data.result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message || "Error fetching profile");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleUpdateProfile = async (values) => {
    setUpdating(true);
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      try {
        const url = await uploadFile(file);
        values.avatar = url;
        toast.success("Tải lên hình ảnh thành công!");
      } catch (error) {
        toast.error(error.response.data);
        return;
      }
    }
    try {
      const response = await api.put("/customer/update-profile", values);
      setUserProfile(response.data.result);
      toast.success(response.data.message);
      setIsModalVisible(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating profile");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUploadChange = (info) => {
    setFileList(info.fileList);
  };

  if (loading) {
    return <Spin size="large" style={{ marginTop: 50 }} />;
  }

  if (!userProfile) {
    return <div>No profile data found</div>;
  }

  return (
    <Space
      direction="vertical"
      style={{ width: "100%", padding: "20px" }}
      className="profile-container"
    >
      {/* Avatar and Name */}
      <div className="profile-header" style={{ textAlign: "center" }}>
        <Avatar
          src={userProfile.avatar || <UserOutlined />}
          size={120}
          className="avatar"
          style={{ marginBottom: "15px" }}
        />
        <Title level={2} className="profile-title">
          {userProfile.name}
        </Title>
      </div>

      {/* Profile Card */}
      <Card
        className="card"
        title="Thông tin cá nhân"
        style={{
          width: "100%",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text strong>Email:</Text>
            <Text>{userProfile.email}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Số điện thoại:</Text>
            <Text>{userProfile.phone}</Text>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
          <Col span={12}>
            <Text strong>Địa chỉ:</Text>
            <Text>{userProfile.address}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Trạng thái:</Text>
            <Text
              style={{
                color: userProfile.status === "VERIFIED" ? "green" : "orange",
                fontWeight: "bold",
              }}
            >
              {userProfile.status}
            </Text>
          </Col>
        </Row>
      </Card>

      {/* Update Profile Button */}
      <div style={{ textAlign: "center" }}>
        <Button
          type="primary"
          className="button button-primary"
          onClick={showModal}
          style={{
            backgroundColor: "#007bff",
            borderColor: "#007bff",
            color: "#fff",
            width: "200px",
            borderRadius: "5px",
            marginBottom: "20px",
          }}
        >
          Cập nhật thông tin
        </Button>
      </div>

      {/* Update Profile Modal */}
      <Modal
        title="Cập nhật thông tin cá nhân"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        style={{ textAlign: "center" }}
      >
        <Form
          layout="vertical"
          initialValues={{
            name: userProfile.name,
            address: userProfile.address,
            avatar: userProfile.avatar,
            phone: userProfile.phone,
          }}
          onFinish={handleUpdateProfile}
        >
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input placeholder="Tên" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true }]}
          >
            <Input placeholder="Địa chỉ" />
          </Form.Item>
          <Form.Item label="Tải lên hình ảnh" name="avatar">
            <Upload
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true }]}
          >
            <Input placeholder="Số điện thoại" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={updating}
              className="button button-primary"
              style={{
                backgroundColor: "#007bff",
                borderColor: "#007bff",
                color: "#fff",
                width: "100%",
              }}
            >
              Lưu thông tin
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Logout Button */}
      <div style={{ textAlign: "center" }}>
        <Button
          type="primary"
          icon={<AiOutlineLogout fontSize={18} />}
          onClick={handleLogout}
          className="button button-logout"
          style={{
            backgroundColor: "#f56c6c",
            borderColor: "#f56c6c",
            color: "#fff",
            width: "200px",
            borderRadius: "5px",
          }}
        >
          Đăng xuất
        </Button>
      </div>
    </Space>
  );
};

export default Profile;
