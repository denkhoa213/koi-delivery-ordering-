import React, { useEffect, useState } from "react";
import { Avatar, Button, Space, Card, Typography, Row, Col, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { AiOutlineLogout } from "react-icons/ai"; // Logout icon
import { logout } from "../../redux/features/userSlice";
import { toast } from "react-toastify";
import api from "../../config/axios";

const { Title, Text } = Typography;

const Profile = () => {
  const dispatch = useDispatch();
  const [userProfile, setUserProfile] = useState(null); // State to store user profile data
  const [loading, setLoading] = useState(true); // Loading state

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

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
  };

  if (loading) {
    return <Spin size="large" style={{ marginTop: 50 }} />; // Show loading spinner while fetching data
  }

  if (!userProfile) {
    return <div>No profile data found</div>; // Handle case when no profile data is available
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {/* Avatar and Name */}
      <Row justify="center">
        <Col>
          <Avatar
            src={userProfile.avatar || <UserOutlined />}
            size={100}
            style={{
              border: "5px solid #FF6F00", // Border color for avatar
              marginBottom: 20,
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          />
        </Col>
      </Row>
      <Row justify="center">
        <Col>
          <Title level={3} style={{ color: "#333", fontWeight: 600 }}>
            {userProfile.name}
          </Title>
        </Col>
      </Row>

      {/* Profile Card */}
      <Card
        style={{
          width: "100%",
          maxWidth: 600,
          marginBottom: 20,
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
        title="Thông tin cá nhân"
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text strong>Email:</Text>
            <Text style={{ color: "#555" }}>{userProfile.email}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Số điện thoại:</Text>
            <Text style={{ color: "#555" }}>{userProfile.phone}</Text>
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: 10 }}>
          <Col span={12}>
            <Text strong>Địa chỉ:</Text>
            <Text style={{ color: "#555" }}>{userProfile.address}</Text>
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

      {/* Logout Button */}
      <Row justify="center">
        <Col>
          <Button
            type="primary"
            icon={<AiOutlineLogout fontSize={18} />}
            onClick={handleLogout}
            style={{
              backgroundColor: "#FF6F00",
              borderColor: "#FF6F00",
              color: "#fff",
              width: "100%",
              height: 45,
              borderRadius: "8px",
              fontSize: "16px",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#d35b00")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#FF6F00")}
          >
            Đăng xuất
          </Button>
        </Col>
      </Row>
    </Space>
  );
};

export default Profile;
