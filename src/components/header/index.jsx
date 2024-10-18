import React from "react";
import { Input, Button, Space, Avatar } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import "./index.scss";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/userSlice";
import { AiFillHome, AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";
const { Search } = Input;

const Header = () => {
  const user = useSelector((store) => store.user);
  const dispath = useDispatch();
  return (
    <>
      <header className="header">
        <div className="logo">
          <img src="/path-to-your-logo.png" alt="Logo" />
        </div>
        <div className="search-bar">
          <Search
            placeholder="Nhập để tìm kiếm..."
            onSearch={(value) => console.log(value)}
            style={{ width: 570 }}
          />
        </div>
        <div className="nav-links">
          <Button type="link" icon={<AiFillHome fontSize={18} />}>
            <Link to="/">Trang chủ</Link>
          </Button>

          <div>
            {user == null ? (
              <>
                <Button type="link" icon={<AiOutlineLogin fontSize={18} />}>
                  <Link to="/login">Đăng nhập</Link>
                </Button>
              </>
            ) : (
              <div>
                <Space wrap size={16}>
                  <Avatar icon={<UserOutlined />} />
                </Space>

                <Button
                  type="link"
                  icon={<AiOutlineLogout fontSize={18} />}
                  onClick={() => dispath(logout())}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <nav className="nav-links">
        <div className="nav-dropdown">
          <Button type="link" className="nav-button dropdown-toggle">
            Dịch vụ <DownOutlined />
          </Button>
          <div className="dropdown-menu">
            <Link to="/services">Dịch vụ vận chuyển</Link>
            <Link to="#">Dịch vụ chăm sóc cá </Link>
          </div>
        </div>

        <Button type="link">
          <Link to="/about">Giới thiệu</Link>
        </Button>
        <Button type="link">
          <Link to="/support">Hổ trợ</Link>
        </Button>
        <Button type="link">
          <Link to="/contact">Liên hệ</Link>
        </Button>

        <div className="nav-dropdown">
          <Button type="link" className="nav-button dropdown-toggle">
            More <DownOutlined />
          </Button>
          <div className="dropdown-menu">
            <a href="#option1">Option 1</a>
            <a href="#option2">Option 2</a>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
