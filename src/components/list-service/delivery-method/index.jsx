import React, { useEffect, useState } from "react";
import "./index.scss";
import { toast } from "react-toastify";
import api from "../../../config/axios";
import { Table } from "antd";


const DeliveryServiceList = () => {

  const [deliveryMethod, setDeliveryMethods] = useState([]);

  const fetchDeliveryMethod = async () => {
    try {
      const response = await api.get(`/delivery-method/view-all`);
      if (response.data.code === 200) {
        setDeliveryMethods(response.data.result);
      } else {
        toast.error(response.data.message);
        setDeliveryMethods([]);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi lấy thông tin phương thức giao hàng!");
      console.error("Error", error);
      setDeliveryMethods([]);
    }
  }

  useEffect(() => {
    fetchDeliveryMethod();
  }, []);

  return (
    <div className="delivery-method-list">
      <h2>Danh sách Các phương tiện vận chuyển cá Koi của chúng tôi</h2>

      <Table
        dataSource={deliveryMethod}
        columns={[
          { title: 'Phương thức vận chuyển', dataIndex: 'name', key: 'name' },
          { title: 'Giá (VNĐ/Km)', dataIndex: 'price', key: 'price' },
          { title: 'Mô tả', dataIndex: 'description', key: 'description' },

        ]}
        rowKey="id"
        pagination={false}
      />
    </div>
  )
};

export default DeliveryServiceList;