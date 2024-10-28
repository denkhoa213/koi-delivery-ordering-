import React from "react";
import CRUDTemplate from "../../../../components/crud-template";
import { Form, Input } from "antd";

function ManageDelivery() {
  const columns = [
    {
      title: "Phương tiện vận chuyển",
      dataIndex: "delivery_name",
      key: "delivery_name",
    },
  ];

  const formItem = (
    <>
      <Form.Item name="id" hidden>
        <Input />
      </Form.Item>
      <Form.Item
        name="delivery_name"
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
