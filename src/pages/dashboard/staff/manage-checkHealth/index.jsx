import React, { useEffect, useState } from "react";
import api from "../../../../config/axios";
import { toast } from "react-toastify";
import { Button, Modal, Space, Table } from "antd";
import { EditOutlined } from "@ant-design/icons";

function CheckHealthAndPakage() {
  const [showModal, setShowModal] = useState(false);
  const [showOrderAvailable, setShowOrderAvailable] = useState([]);
  const fetchOrderAvailable = async () => {
    try {
      const response = await api.get("/order/view-order-available");
      setShowOrderAvailable(response.data.result);
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchOrderAvailable();
  });
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
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Destination",
      dataIndex: "destination",
      key: "destination",
    },
    {
      title: "Departure",
      dataIndex: "departure",
      key: "departure",
    },
    {
      title: "Distance",
      dataIndex: "distance",
      key: "distance",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => amount.toFixed(2),
    },
    {
      title: "VAT",
      dataIndex: "vat",
      key: "vat",
      render: (vat) => `${vat}%`,
    },
    {
      title: "VAT Amount",
      dataIndex: "vatAmount",
      key: "vatAmount",
      render: (vatAmount) => vatAmount.toFixed(2),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (totalAmount) => totalAmount.toFixed(2),
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id, category) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setShowModal(true);
            }}
          >
            Check
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <div>
      <Table dataSource={showOrderAvailable} columns={columns} />
      <Modal open={showModal} onCancel={() => setShowModal(false)}></Modal>
    </div>
  );
}

export default CheckHealthAndPakage;
