import React from "react";
import AuthenTemplate from "../../Components/LoginRegister";
import { FaLock, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

function RegisterPage() {
  return (
    <AuthenTemplate>
      <div className="wrapper">
        <form action="">
          <h1>Register</h1>
          <div className="input-box">
            <input type="text" placeholder="Username" required />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input type="password" placeholder="Password" required />
            <FaLock className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Enter password again"
              required
            />
            <FaLock className="icon" />
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#">Forgot password</a>
          </div>

          <button type="submit">Login</button>

          <div className="register-link">
            <p>
              You have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </AuthenTemplate>
  );
}

export default RegisterPage;
