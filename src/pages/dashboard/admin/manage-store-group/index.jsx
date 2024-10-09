import React from "react";

import { Form, Input } from "antd";
import CRUDTemplate from "../../../../components/crud-template";

function ManageServiceGroup() {
  const column = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ];

  const formItems = (
    <>
      <Form.Item name="id" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="name" label="Name">
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input.TextArea />
      </Form.Item>
    </>
  );
  return (
    <div>
      <CRUDTemplate
        column={column}
        formItems={formItems}
        path="service-group"
      />
    </div>
  );
}

export default ManageServiceGroup;
