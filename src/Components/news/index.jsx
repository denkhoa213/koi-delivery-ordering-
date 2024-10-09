import React from "react";
import { Carousel, Card } from "antd";

const newsArticles = [
  {
    id: 1,
    title: "Giới thiệu dịch vụ giao cá Koi",
    description:
      "Chúng tôi cung cấp dịch vụ giao cá Koi an toàn và nhanh chóng đến tận nơi.",
    image: "https://link-to-image.com/news1.jpg",
    date: "2024-10-01",
  },
  {
    id: 2,
    title: "Hướng dẫn chăm sóc cá Koi",
    description: "Những điều cần biết để chăm sóc cá Koi khỏe mạnh và đẹp mắt.",
    image: "https://link-to-image.com/news2.jpg",
    date: "2024-10-02",
  },
  {
    id: 3,
    title: "Khuyến mãi dịch vụ giao cá Koi",
    description: "Nhận ngay 10% giảm giá cho lần giao hàng đầu tiên!",
    image: "https://link-to-image.com/news3.jpg",
    date: "2024-10-03",
  },
  {
    id: 4,
    title: "Cách chọn cá Koi đẹp",
    description: "Hướng dẫn chọn lựa cá Koi phù hợp với sở thích của bạn.",
    image: "https://link-to-image.com/news4.jpg",
    date: "2024-10-04",
  },
  {
    id: 5,
    title: "Dịch vụ tư vấn cá Koi",
    description:
      "Chúng tôi cung cấp dịch vụ tư vấn để bạn có thể lựa chọn cá Koi phù hợp.",
    image: "https://link-to-image.com/news5.jpg",
    date: "2024-10-05",
  },
  {
    id: 6,
    title: "Chương trình ưu đãi đặc biệt",
    description:
      "Những ưu đãi hấp dẫn khi bạn đặt hàng qua website của chúng tôi.",
    image: "https://link-to-image.com/news6.jpg",
    date: "2024-10-06",
  },
];

const NewsSection = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Tin tức</h2>
      <Carousel autoplay dots={false}>
        {Array.from(
          { length: Math.ceil(newsArticles.length / 3) },
          (_, index) => (
            <div key={index}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {newsArticles.slice(index * 3, index * 3 + 3).map((article) => (
                  <Card
                    key={article.id}
                    hoverable
                    cover={<img alt={article.title} src={article.image} />}
                    style={{ width: "30%", margin: "0 1%" }}
                  >
                    <Card.Meta
                      title={article.title}
                      description={article.description}
                    />
                    <div style={{ marginTop: "10px", color: "gray" }}>
                      {article.date}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )
        )}
      </Carousel>
    </div>
  );
};

export default NewsSection;
