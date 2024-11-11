import React from "react";
import CRUDTemplate from "../../../../components/crud-template";
import { Form, Input } from "antd";

function ManageDelivery() {
  const columns = [
    {
      title: "Delivery Method Name",
      dataIndex: "deliveryMethodName",
      key: "deliveryMethodName",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Created At",
      dataIndex: "createAt",
      key: "createAt",
      render: (text) => <span>{new Date(text).toLocaleString()}</span>, // Format the date
    },

    {
      title: "Updated At",
      dataIndex: "updateAt",
      key: "updateAt",
      render: (text) => <span>{new Date(text).toLocaleString()}</span>,
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
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => <span>{price.toLocaleString()} VND</span>, // Format the price
    },
  ];

  const formItem = (
    <>
      <Form.Item name="id" hidden>
        <Input />
      </Form.Item>
      <Form.Item
        name="deliveryMethodName"
        label="Phương tiện vận chuyển"
        rules={[
          { required: true, message: "Vui lòng nhập phương tiện vận chuyển!" },
        ]}
      >
        <Input placeholder="Nhập tên phương tiện vận chuyển" />
      </Form.Item>
      <Form.Item
        name="price"
        label="Giá"
        rules={[
          { required: true, message: "Vui lòng nhập giá!" },
          {
            pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
            message: "Giá phải là một số hợp lệ với tối đa 2 chữ số thập phân!",
          },
        ]}
      >
        <Input placeholder="Nhập giá" />
      </Form.Item>
    </>
  );
  return (
    <CRUDTemplate
      columns={columns}
      formItem={formItem}
      path="delivery-method"
    />
  );
}

export default ManageDelivery;
