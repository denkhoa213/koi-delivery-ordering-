import React from "react";
import CRUDTemplate from "../../../../components/crud-template";
import { Form, Input } from "antd";

function ManageFishCategory() {
  const columns = [
    {
      title: "Tên loại cá",
      dataIndex: "fish_category_name",
      key: "fish_category_name",
    },
    {
      title: "Mô tả loại cá",
      dataIndex: "fish_category_description",
      key: "fish_category_description",
    },
  ];

  const formItem = (
    <>
      <Form.Item name="id" hidden>
        <Input />
      </Form.Item>
      <Form.Item
        name="fish_category_name"
        label="Tên loại cá"
        rules={[{ required: true, message: "Vui lòng nhập tên loại cá!" }]}
      >
        <Input placeholder="Nhập tên loại cá" />
      </Form.Item>

      <Form.Item
        name="fish_category_description"
        label="Mô tả loại cá"
        rules={[{ required: true, message: "Vui lòng nhập mô tả loại cá!" }]}
      >
        <Input.TextArea placeholder="Nhập mô tả loại cá" />
      </Form.Item>
    </>
  );

  return (
    <div>
      <CRUDTemplate
        columns={columns}
        formItem={formItem}
        path="fish-category"
      />
    </div>
  );
}

export default ManageFishCategory;
