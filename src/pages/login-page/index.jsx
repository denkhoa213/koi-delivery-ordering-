import AuthenTemplate from "../../components/login-register";
import { FaLock } from "react-icons/fa";
import "./index.css";
import { Link, useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input } from "antd";
import { toast } from "react-toastify";
import api from "../../config/axios";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";
import { MailOutlined } from "@ant-design/icons";
import { useState } from "react";

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // luu vao redux: useDispatch()

  // lay du liu: useSelector()

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      console.log("Login values:", values);

      const response = await api.post("auth/login", values);

      console.log("Response:", response);

      const { token, role, id } = response.data.result;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", id);

      dispatch(login(response.data.result));

      if (role === "MANAGER") {
        navigate("/dashboard-manager");
      } else if (role === "SALE_STAFF") {
        navigate("/dashboard-sale-staff");
      } else if (role === "DELIVERY_STAFF") {
        navigate("/dashboard-delivery-staff");
      } else {
        navigate("/");
      }

      toast.success(response.data.message);
    } catch (error) {
      toast.error(
        "Đăng nhập thất bại: " +
          (error.response?.data?.message || error.message)
      );
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (values) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/forgot-password", {
        email: values.email,
      });
      if (response.data.code === 200) {
        toast.error(response.data.message);
        setForgotPassword(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthenTemplate>
      <div className="wrapper">
        {!forgotPassword ? (
          <Form
            labelCol={{
              span: 24,
            }}
            onFinish={handleLogin}
          >
            <h1>Đăng nhập</h1>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email của bạn!" },
                { type: "email", message: "Định dạng Email không phù hợp" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu của bạn!" },
              ]}
            >
              <Input.Password prefix={<FaLock />} placeholder="Password" />
            </Form.Item>

            <div className="remember-forgot">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Ghi nhớ tài khoản</Checkbox>
              </Form.Item>
              <a
                href="#"
                className="forgot-password"
                onClick={() => setForgotPassword(true)}
              >
                Quên mật khẩu
              </a>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Login
              </Button>
            </Form.Item>

            <div className="register-link">
              <p>
                Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link>
              </p>
            </div>
          </Form>
        ) : (
          <Form onFinish={handleForgotPassword}>
            <h1>Forgot password</h1>

            <Form.Item
              name="email"
              rule={[
                { required: true, message: "Vui lòng nhập email của bạn!" },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Gửi link
              </Button>
            </Form.Item>

            <div className="back-to-loginpage">
              <a href="#" onClick={() => setForgotPassword(false)}>
                Trở về trang đăng nhập
              </a>
            </div>
          </Form>
        )}
      </div>
    </AuthenTemplate>
  );
}

export default LoginPage;
