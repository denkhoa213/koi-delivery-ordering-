import React, { useEffect, useState } from "react";

import api from "../../config/axios";
import "./index.scss";

import Banner from "../../Components/Banner";
import NewsSection from "../../components/news";
import ServiceList from "../../components/ServiceCard";

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
      <NewsSection />
    </>
  );
}

export default HomePage;
