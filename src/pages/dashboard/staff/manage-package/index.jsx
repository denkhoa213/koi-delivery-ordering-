import { UploadOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Select, Upload } from "antd";
import { Option } from "antd/es/mentions";
import React, { useState } from "react";
import CRUDTemplate from "../../../../components/crud-template";

function ManagePackage() {
  const formItem = (
    <>
      <Form.Item
        label="Package Description"
        name="packageDescription"
        rules={[{ required: true, message: "Please enter a description" }]}
      >
        <Input placeholder="Enter package description" />
      </Form.Item>

      <Form.Item
        label="Package Date"
        name="packageDate"
        rules={[{ required: true, message: "Please select a date" }]}
      ></Form.Item>

      <Form.Item
        label="Package Status"
        name="packageStatus"
        rules={[{ required: true, message: "Please select a status" }]}
      >
        <Select>
          <Option value="UNPACKED">UNPACKED</Option>
          <Option value="PACKED">PACKED</Option>
          <Option value="PACKING">PACKING</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Packaged By"
        name="packageBy"
        rules={[{ required: true, message: "Please enter who packaged it" }]}
      >
        <Input placeholder="Enter name of person who packaged it" />
      </Form.Item>
    </>
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Package No",
      dataIndex: "packageNo",
      key: "packageNo",
    },
    {
      title: "Description",
      dataIndex: "packageDescription",
      key: "packageDescription",
    },
    {
      title: "Package Date",
      dataIndex: "packageDate",
      key: "packageDate",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Package Status",
      dataIndex: "packageStatus",
      key: "packageStatus",
    },
    {
      title: "Packaged By",
      dataIndex: "packagedBy",
      key: "packagedBy",
    },

    {
      title: "Created At",
      dataIndex: "createAt",
      key: "createAt",
      render: (text) => new Date(text).toLocaleDateString(),
    },

    {
      title: "Updated At",
      dataIndex: "updateAt",
      key: "updateAt",
      render: (text) => new Date(text).toLocaleDateString(),
    },
  ];

  return (
    <>
      <CRUDTemplate formItem={formItem} columns={columns} path="package" />
    </>
  );
}

export default ManagePackage;
