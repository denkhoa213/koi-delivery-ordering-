import React from "react";

import Banner from "../../components/banner";
import NewsSection from "../../components/news";
import DeliveryServiceList from "../../components/list-service/delivery-method";
import HealthServiceCategory from "../../components/list-service/health-service-cate";

function HomePage() {

  return (
    <>
      <Banner />
      <DeliveryServiceList />
      <HealthServiceCategory />
      <NewsSection />
    </>
  );
}

export default HomePage;
