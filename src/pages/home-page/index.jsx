import React, { useEffect, useState } from "react";

import api from "../../config/axios";
import "./index.scss";

import Banner from "../../components/banner";
import NewsSection from "../../components/news";
import ServiceList from "../../components/list-service/service-delivery";
import TransportManagement from "../../components/list-service/service-health";

function HomePage() {
  // const [services, setServices] = useState([]);
  // const fetchService = async () => {
  //   try {
  //     const response = await api.get("/product/all");
  //     setServices(response.data.content);
  //   } catch (e) {
  //     console.log("Error fetch Service:".e);
  //   }
  // };

  // useEffect(() => {
  //   fetchService();
  // }, []);

  return (
    <>
      <Banner />
      <ServiceList />
      <TransportManagement />
      <NewsSection />
    </>
  );
}

export default HomePage;
