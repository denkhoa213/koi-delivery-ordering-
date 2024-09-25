import React, { useState } from "react";
import "./index.css";

function FormService() {
  const [activeTab, setActiveTab] = useState("tra-cuu");
  const [subTab, setSubTab] = useState("van-don");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSubTab("van-don"); // Default sub-tab for "Tra cứu"
  };

  const handleSubTabClick = (subTab) => {
    setSubTab(subTab);
  };

  // Sample service cards
  const services = [
    {
      id: 1,
      title: "Chuyển phát nhanh",
      description: "Dịch vụ giao hàng nhanh trong nước và quốc tế.",
      image: "/fast-delivery.png",
    },
    {
      id: 2,
      title: "Chuyển hàng cồng kềnh",
      description: "Dịch vụ chuyên chở hàng hóa cồng kềnh và nặng.",
      image: "/heavy-delivery.png",
    },
    {
      id: 3,
      title: "Giao hàng tiết kiệm",
      description: "Giao hàng với chi phí tiết kiệm và thời gian linh hoạt.",
      image: "/economy-delivery.png",
    },
  ];

  return (
    <div className="container">
      {/* Main Tabs */}
      <div className="main-tabs">
        <button
          className={activeTab === "tra-cuu" ? "active" : ""}
          onClick={() => handleTabClick("tra-cuu")}
        >
          Tra cứu
        </button>
        <button
          className={activeTab === "dich-vu" ? "active" : ""}
          onClick={() => handleTabClick("dich-vu")}
        >
          Dịch vụ
        </button>
      </div>

      {/* Tra cứu Section */}
      {activeTab === "tra-cuu" && (
        <div className="tra-cuu-section">
          {/* Sub Tabs */}
          <div className="sub-tabs">
            <button
              className={subTab === "van-don" ? "active" : ""}
              onClick={() => handleSubTabClick("van-don")}
            >
              Tra cứu vận đơn
            </button>
            <button
              className={subTab === "uoc-tinh-phi" ? "active" : ""}
              onClick={() => handleSubTabClick("uoc-tinh-phi")}
            >
              Ước tính cước phí
            </button>
            <button
              className={subTab === "faq" ? "active" : ""}
              onClick={() => handleSubTabClick("faq")}
            >
              Câu hỏi thường gặp
            </button>
          </div>

          {/* Form based on Sub Tab */}
          {subTab === "van-don" && (
            <div className="form">
              <h4>Tra cứu vận đơn</h4>
              <input type="text" placeholder="Mã phiếu gửi (VD: 12345)" />
              <button>Tra cứu</button>
            </div>
          )}

          {subTab === "uoc-tinh-phi" && (
            <div className="form">
              <h4>Ước tính cước phí</h4>
              <input type="text" placeholder="Gửi từ" />
              <input type="text" placeholder="Gửi đến" />
              <input type="number" placeholder="Số lượng" />
              <input type="text" placeholder="Số tiền" />
              <button>Ước tính</button>
            </div>
          )}

          {subTab === "faq" && (
            <div className="form">
              <h4>Câu hỏi thường gặp</h4>
              <p>Các câu hỏi phổ biến liên quan đến dịch vụ của chúng tôi.</p>
            </div>
          )}
        </div>
      )}

      {/* Dịch vụ Section */}
      {activeTab === "dich-vu" && (
        <div className="service-section">
          <h4>Danh sách dịch vụ</h4>
          <div className="service-cards">
            {services.map((service) => (
              <div key={service.id} className="card">
                <img src={service.image} alt={service.title} />
                <h5>{service.title}</h5>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FormService;
