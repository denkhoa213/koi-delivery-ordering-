import React from "react";
import CRUDTemplate from "../../../../components/crud-template";
import { Form, Input } from "antd";

function ManageFishCategory() {
  const columns = [
    {
      title: "Fish Category Name",
      dataIndex: "fishCategoryName",
      key: "fishCategoryName",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Description",
      dataIndex: "fishCategoryDescription",
      key: "fishCategoryDescription",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Created At",
      dataIndex: "createAt",
      key: "createAt",
      render: (text) => <span>{new Date(text).toLocaleDateString()}</span>,
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
      render: (text) => <span>{new Date(text).toLocaleDateString()}</span>,
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
        name="fishCategoryName"
        label="Tên loại cá"
        rules={[{ required: true, message: "Vui lòng nhập tên loại cá!" }]}
      >
        <Input placeholder="Nhập tên loại cá" />
      </Form.Item>

      <Form.Item
        name="fishCategoryDescription"
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
