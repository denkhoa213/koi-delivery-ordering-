import React, { useEffect, useState } from "react";
import api from "../../../../config/axios";
import { toast } from "react-toastify";
import { Button, Space, Table } from "antd";
import { CheckOutlined } from "@ant-design/icons";

function ManageOrder() {
  const [showAllOrder, setShowAllOrder] = useState([]);

  const fetchOrders = async () => {
    try {
      const [pendingResponse, availableResponse] = await Promise.all([
        api.get("/order/view-order-pending"),
        api.get("/order/view-order-available"),
      ]);
      const combinedOrders = [
        ...pendingResponse.data.result,
        ...availableResponse.data.result,
      ];
      setShowAllOrder(combinedOrders);
    } catch (error) {
      toast.error(error.message || "Failed to fetch orders");
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await api.put(`/order/acceptorder/${orderId}`);
      toast.success("Order accepted successfully!");

      // Update local order status to "AVAILABLE"
      setShowAllOrder((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "AVAILABLE" } : order
        )
      );
    } catch (error) {
      toast.error(error.message || "Failed to accept order");
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
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Estimated Delivery Date",
      dataIndex: "estimateDeliveryDate",
      key: "estimateDeliveryDate",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Receiving Date",
      dataIndex: "receivingDate",
      key: "receivingDate",
      render: (text) => new Date(text).toLocaleString(),
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
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id, order) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleAcceptOrder(order.id)}
            disabled={order.status === "AVAILABLE"} // Disable if already accepted
          >
            Accept
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  return <Table dataSource={showAllOrder} columns={columns} rowKey="id" />;
}

export default ManageOrder;
