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
      title: "Created By",
      dataIndex: "createBy",
      key: "createBy",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Updated At",
      dataIndex: "updateAt",
      key: "updateAt",
      render: (text) => <span>{new Date(text).toLocaleString()}</span>, // Format the date
    },
    {
      title: "Updated By",
      dataIndex: "updateBy",
      key: "updateBy",
      render: (text) => <span>{text}</span>,
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
        name="deliveryMethodName"
        label="Phương tiện vận chuyển"
        rules={[
          { required: true, message: "Vui lòng nhập phương tiện vận chuyển!" },
        ]}
      >
        <Input placeholder="Nhập tên phương tiện vận chuyển" />
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
