import React from "react";
import { Input, Button } from "antd";
import { HomeOutlined, UserOutlined, DownOutlined } from "@ant-design/icons";
import "./index.css";
import { Link } from "react-router-dom";
const { Search } = Input;

const Header = () => {
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
          <Button type="link" icon={<HomeOutlined />} href="#home">
            Trang chủ
          </Button>
          <Button type="link" icon={<UserOutlined />}>
            <Link to="/login">Đăng nhập</Link>
          </Button>
        </div>
      </header>

      <nav className="nav-links">
        <div className="nav-dropdown">
          <Button type="link" className="nav-button dropdown-toggle">
            Dịch vụ <DownOutlined />
          </Button>
          <div className="dropdown-menu">
            <a href="#option1">Dịch vụ 1</a>
            <a href="#option2">Dịch vụ 2</a>
          </div>
        </div>

        <Button type="link" href="#about">
          Giới thiệu
        </Button>
        <Button type="link" href="#support">
          Hỗ trợ
        </Button>
        <Button type="link" href="#info">
          Thông tin Khách
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
