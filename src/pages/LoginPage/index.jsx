import React, { useState } from "react";
import AuthenTemplate from "../../Components/LoginRegister";
import { FaLock, FaPhone } from "react-icons/fa";
import "./index.css";
import { Link, useNavigate } from "react-router-dom";
import { googleProvider } from "../../config/firebase";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { getAuth, signInWithPopup } from "firebase/auth";
import { Button, Checkbox, Form, Input } from "antd";
import { toast } from "react-toastify";
import api from "../../config/axios";

function LoginPage() {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
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

  const handleLogin = async (values) => {
    try {
      setSubmitting(true);
      const response = await api.post("login", values);

      const { role, token } = response.data;

      localStorage.setItem("token", token);
      if (role === "ADMIN") {
        navigate("/dashboard");
      }
      toast.success("Successfully login account!");
      console.log(response);
    } catch (err) {
      toast.error(err.response.data);
      setSubmitting(false);
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
          confirmLoading={submitting}
        >
          <h1>Login</h1>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "Please enter your phone or email!" },
            ]}
          >
            <Input prefix={<FaPhone />} placeholder="Phone" />
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
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              type="default"
              className="google-btn"
              onClick={handleLoginGoogle}
              block
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Google_%22G%22_Logo.svg"
                alt="Google icon"
                className="google-icon"
              />
              Sign in with Google
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
