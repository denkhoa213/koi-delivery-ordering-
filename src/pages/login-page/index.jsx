import AuthenTemplate from "../../components/login-register";
import { FaLock } from "react-icons/fa";
import "./index.css";
import { Link, useNavigate } from "react-router-dom";
import { googleProvider } from "../../config/firebase";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { getAuth, signInWithPopup } from "firebase/auth";
import { Button, Checkbox, Form, Input } from "antd";
import { toast } from "react-toastify";
import api from "../../config/axios";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";
import { MailOutlined } from "@ant-design/icons";
import { useState } from "react";

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const handleLoginGoogle = () => {
    const auth = getAuth();
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        console.log(error);

        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  // luu vao redux: useDispatch()

  // lay du liu: useSelector()

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      console.log("Login values:", values); // Kiểm tra thông tin gửi đi

      const response = await api.post("auth/login", values);

      console.log("Response:", response);

      // Lấy token, role và id từ response
      const { token, role, id } = response.data.result;

      // Lưu token, role và userId (id) vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", id); // Lưu id dưới dạng userId

      dispatch(login(response.data.result));

      // Điều hướng theo role của người dùng
      if (role === "MANAGER") {
        navigate("/dashboard-admin");
      } else if (role === "SALE_STAFF") {
        navigate("/dashboard-staff");
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

  return (
    <AuthenTemplate>
      <div className="wrapper">
        <Form
          labelCol={{
            span: 24,
          }}
          onFinish={handleLogin}
        >
          <h1>Login</h1>

          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password prefix={<FaLock />} placeholder="Password" />
          </Form.Item>

          <div className="remember-forgot">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a href="#" className="forgot-password">
              Forgot password
            </a>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form.Item>

          <div className="register-link">
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </Form>
      </div>
    </AuthenTemplate>
  );
}

export default LoginPage;
