import React, { useState } from "react";
import AuthenTemplate from "../../components/login-register";
import { FaLock, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input } from "antd";
import { IoMdMail } from "react-icons/io";
import api from "../../config/axios";
import { toast } from "react-toastify";

function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSendVerificationEmail = async () => {
    setLoading(true);
    try {
      const response = await api.post("/auth/send-verification-email");
      toast.success(response.data.message);
    } catch (err) {
      toast.error(err.response?.data || "Error sending verification email");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/register", values);
      toast.success(response.data.message);
      navigate("/login");
      handleSendVerificationEmail();
    } catch (err) {
      toast.error(err.response?.data || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthenTemplate>
      <div className="wrapper">
        <Form
          labelCol={{ span: 24 }}
          onFinish={handleRegister}
          autoComplete="off" // Disable autocomplete for better UX
        >
          <h1>Register</h1>

          <Form.Item
            name="name"
            rules={[
              { required: true, message: "Please enter your username!" },
              { min: 3, message: "Username must be at least 3 characters!" },
              {
                max: 15,
                message: "Username cannot be longer than 15 characters!",
              },
            ]}
          >
            <Input prefix={<FaUser />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input prefix={<IoMdMail />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                message: "Password must contain letters and numbers!",
              },
            ]}
            hasFeedback
          >
            <Input.Password prefix={<FaLock />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Register
            </Button>
          </Form.Item>

          <div className="register-link">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </Form>
      </div>
    </AuthenTemplate>
  );
}

export default RegisterPage;
