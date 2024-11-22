import React from "react";
import { Input, Button, Space, Avatar, Dropdown, Menu } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/userSlice";
import { AiFillHome, AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";
import "./index.scss";

const { Search } = Input;

const Header = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAvatarClick = () => {
    navigate("/customer");
  };

  const serviceMenu = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/services">Dịch vụ vận chuyển</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="#">Dịch vụ chăm sóc cá</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <img
            src="https://gudlogo.com/wp-content/uploads/2019/05/logo-ca-Koi-23.png"
            alt="Logo"
          />
        </div>
        <div className="search-bar">
          <Search
            placeholder="Nhập để tìm kiếm..."
            onSearch={(value) => console.log(value)}
            style={{ width: 570 }}
          />
        </div>
      </div>

      <div className="header-right">
        <Button type="link" icon={<AiFillHome fontSize={18} />}>
          <Link to="/">Trang chủ</Link>
        </Button>

        {user ? (
          <Space>
            <Avatar
              icon={<UserOutlined />}
              onClick={handleAvatarClick}
              style={{ cursor: "pointer" }}
            />
            <Button
              type="link"
              icon={<AiOutlineLogout fontSize={18} />}
              onClick={() => {
                dispatch(logout());
                navigate("/");
              }}
            >
              Logout
            </Button>
          </Space>
        ) : (
          <Button type="link" icon={<AiOutlineLogin fontSize={18} />}>
            <Link to="/login">Đăng nhập</Link>
          </Button>
        )}
      </div>

      <nav className="nav">
        <Dropdown overlay={serviceMenu}>
          <Button type="link" className="nav-button">
            Dịch vụ <DownOutlined />
          </Button>
        </Dropdown>

        <Button type="link">
          <Link to="/about">Giới thiệu</Link>
        </Button>

        <Button type="link">
          <Link to="/support">Hổ trợ</Link>
        </Button>

        <Button type="link">
          <Link to="/contact">Liên hệ</Link>
        </Button>

        {/* <Dropdown overlay={moreMenu}>
          <Button type="link" className="nav-button">
            More <DownOutlined />
          </Button>
        </Dropdown> */}
      </nav>
    </header>
  );
};

export default Header;
