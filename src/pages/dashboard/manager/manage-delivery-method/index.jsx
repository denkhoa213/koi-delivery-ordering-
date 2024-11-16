import React from "react";
import CRUDTemplate from "../../../../components/crud-template";
import { Form, Input } from "antd";

function ManageDelivery() {
  const columns = [
    {
      title: "Delivery Method Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span>{text}</span>,
    },

    {
      title: "Description ",
      dataIndex: "description",
      key: "description",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => <span>{price.toLocaleString()} VND</span>, // Format the price
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

  const formItem = (
    <>
      <Form.Item name="id" hidden>
        <Input />
      </Form.Item>
      <Form.Item
        name="name"
        label="Phương tiện vận chuyển"
        rules={[
          { required: true, message: "Vui lòng nhập phương tiện vận chuyển!" },
        ]}
      >
        <Input placeholder="Nhập tên phương tiện vận chuyển" />
      </Form.Item>
      <Form.Item
        name="description"
        label="Mô tả"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập mô tả phương tiện vận chuyển!",
          },
        ]}
      >
        <Input placeholder="Nhập mô tả phương tiện vận chuyển" />
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
