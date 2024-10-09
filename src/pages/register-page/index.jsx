import React from "react";
import AuthenTemplate from "../../Components/login-register";
import { FaLock, FaPhone, FaUser, FaUserEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input } from "antd";
import { IoMdMail } from "react-icons/io";
import api from "../../config/axios";
import { toast } from "react-toastify";

function RegisterPage() {
  const navigate = useNavigate();
  const handleRegister = async (values) => {
    try {
      values.role = "CUSTOMER";
      const response = await api.post("register", values);
      toast.success("Successfully register new account!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response.data);
    }
  };
  return (
    <AuthenTemplate>
      <div className="wrapper">
        <Form
          labelCol={{
            span: 24,
          }}
          onFinish={handleRegister}
        >
          <h1>Register</h1>

          <Form.Item
            name="username"
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

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<FaLock />}
              placeholder="Re-enter Password"
            />
          </Form.Item>

          <Form.Item
            name="fullname"
            rules={[
              { required: true, message: "Please enter your fullname!" },
              { min: 3, message: "Fullname must be at least 3 characters!" },
            ]}
          >
            <Input prefix={<FaUserEdit />} placeholder="Fullname" />
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
            name="phone"
            rules={[
              { required: true, message: "Please enter your phone number!" },
              {
                pattern: /^[0-9]{10,15}$/,
                message: "Please enter a valid phone number (10-15 digits)!",
              },
            ]}
          >
            <Input prefix={<FaPhone />} placeholder="Phone Number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
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
