import React, { useEffect, useState } from "react";
import { Table } from "antd";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import "./index.scss";

const HealServiceCategory = () => {
  const [healService, setHealService] = useState([]);

  const fetchHealServceCategory = async () => {
    try {
      const response = await api.get(`/heal-service-category/view-all`);
      if (response.data.code == 200) {
        setHealService(response.data.result);
      } else {
        toast.error(response.data.result);
      }
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const columns = [
    { title: "Tên dịch vụ", dataIndex: "serviceName", key: "serviceName" },
    { title: "Giá", dataIndex: "price", key: "key" },
    {
      title: "Mô tả",
      dataIndex: "serviceDescription",
      key: "serviceDescription",
    },
  ];

  useEffect(() => {
    fetchHealServceCategory();
  }, []);

  return (
    <div className="heal-service-category">
      <h2>Danh sách dịch vụ chăm sóc cá Koi của chúng tôi</h2>

      <Table dataSource={healService} columns={columns} pagination={false} />
    </div>
  );
};

export default HealServiceCategory;
