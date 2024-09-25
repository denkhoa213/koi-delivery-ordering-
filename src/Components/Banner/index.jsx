// src/components/Banner.jsx
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Banner = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const slides = [
    {
      id: 1,
      image:
        "https://plus.unsplash.com/premium_photo-1661342486992-2a08d4b466ef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "An toàn và chuyên nghiệp",
      description:
        "Dịch vụ vận chuyển cá Koi với đội ngũ giàu kinh nghiệm, đảm bảo cá Koi được vận chuyển an toàn và đúng cách.",
    },
    {
      id: 2,
      image:
        "https://plus.unsplash.com/premium_photo-1682146662576-900a71864a11?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Đảm bảo sức khỏe cho Koi",
      description:
        "Quy trình kiểm tra sức khỏe cá Koi trước và sau khi vận chuyển để đảm bảo cá luôn trong tình trạng tốt nhất.",
    },
    {
      id: 3,
      image:
        "https://unsplash.com/photos/man-driving-motor-scooter-delivering-good-afDu-GuxjjM",
      title: "Dịch vụ toàn quốc",
      description:
        "Chúng tôi cung cấp dịch vụ vận chuyển cá Koi trên toàn quốc với chi phí hợp lý và thời gian vận chuyển nhanh chóng.",
    },
  ];

  return (
    <div className="banner">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.id}>
            <img
              src={slide.image}
              alt={slide.title}
              style={{ width: "100%", height: "500px" }}
            />
            <div className="banner-content" style={{ textAlign: "center" }}>
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;
