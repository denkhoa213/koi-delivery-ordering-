import React, { useEffect, useState } from "react";
import api from "../../../../config/axios";
import { toast } from "react-toastify";
import { Table } from "antd";

function ManageOrder() {
  const [showAllOrder, setShowAllOrder] = useState([]);

  const fetchOrder = async () => {
    try {
      const response = await api.get("order/get-all");
      setShowAllOrder(response.data.result);
    } catch (error) {
      toast.error(error);
    }
  };

  const columns = [
    {
      title: "Order Code",
      dataIndex: "orderCode",
      key: "orderCode",
    },
    {
      title: "Delivery Method",
      dataIndex: "deliveryMethod",
      key: "deliveryMethod",
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (text) => new Date(text).toLocaleString(), // Date formatting
    },
    {
      title: "Estimated Delivery Date",
      dataIndex: "estimateDeliveryDate",
      key: "estimateDeliveryDate",
      render: (text) => new Date(text).toLocaleString(), // Date formatting
    },
    {
      title: "Receiving Date",
      dataIndex: "receivingDate",
      key: "receivingDate",
      render: (text) => new Date(text).toLocaleString(), // Date formatting
    },
    {
      title: "Destination",
      dataIndex: "destination",
      key: "destination",
    },
    {
      title: "Departure Point",
      dataIndex: "departure",
      key: "departure",
    },
    {
      title: "Distance (km)",
      dataIndex: "distance",
      key: "distance",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span style={{ color: status === "AVAILABLE" ? "green" : "red" }}>
          {status}
        </span>
      ),
    },
  ];
  useEffect(() => {
    fetchOrder();
  }, []);
  return (
    <>
      <Table dataSource={showAllOrder} columns={columns} />
    </>
  );
}

export default ManageOrder;
