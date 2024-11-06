import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../../config/axios";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import { Option } from "antd/es/mentions";

function ManagePackage() {
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      const response = await api.get("/package/view-all");
      const result = response.data.result.map((item) => ({
        ...item,
        packageDate: item.packageDate ? moment(item.packageDate) : null,
      }));
      setData(result);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      if (editingId) {
        // Cập nhật gói đã tồn tại chỉ với trường "packageStatus"
        const response = await api.put(`/package/update/${editingId}`, {
          packageStatus: values.packageStatus,
        });

        if (response.data.code === 200) {
          toast.success(response.data.message);
        }
      } else {
        // Tạo gói mới
        const response = await api.post("/package/create", values);

        if (response.data.code === 200) {
          toast.success(response.data.message);

          const newPackageId = response.data.result.packageId;
          localStorage.setItem("packageId", newPackageId);
          setData((prevData) => [
            ...prevData,
            {
              ...values,
              id: newPackageId, // Lưu packageId vào trong dữ liệu
            },
          ]);
        }
      }

      fetchData(); // Tải lại dữ liệu từ server
      form.resetFields();
      setShowModal(false);
      setEditingId(null);
    } catch (error) {
      toast.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.put(`/package/delete/${id}`);
      toast.success(response.data.message);
      fetchData();
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
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
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "packageStatus",
      dataIndex: "packageStatus",
      key: "packageStatus",
      render: (status) => (
        <span style={{ color: status === "PACKING" ? "green" : "red" }}>
          {status}
        </span>
      ),
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
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Updated At",
      dataIndex: "updateAt",
      key: "updateAt",
      render: (text) => new Date(text).toLocaleString(),
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
      render: (id, category) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setShowModal(true);
              setEditingId(id);
              form.setFieldsValue({
                packageStatus: category.packageStatus,
              });
            }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete"
            description="Do you want to delete this category?"
            onConfirm={() => handleDelete(id)}
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setShowModal(true);
          setEditingId(null);
        }}
        style={{ marginBottom: "16px" }}
      >
        Add New Package
      </Button>
      <Table dataSource={data} columns={columns} />
      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={() => form.submit()}
        title="Package"
        confirmLoading={loading}
        okText="Save"
        cancelText="Cancel"
        width={600}
      >
        <Form
          form={form}
          labelCol={{
            span: 24,
          }}
          onFinish={handleSubmit}
          layout="vertical"
          title="Package"
        >
          {editingId ? (
            <Form.Item
              label="Package Status"
              name="packageStatus"
              rules={[
                { required: true, message: "Please select the package status" },
              ]}
            >
              <Select>
                <Option value="UNPACKED">UNPACKED</Option>
                <Option value="PACKED">PACKED</Option>
                <Option value="PACKING">PACKING</Option>
              </Select>
            </Form.Item>
          ) : (
            <>
              <Form.Item
                label="Package Description"
                name="packageDescription"
                rules={[
                  {
                    required: true,
                    message: "Please enter the package description",
                  },
                ]}
              >
                <Input placeholder="Enter package description" />
              </Form.Item>

              <Form.Item
                label="Package Date"
                name="packageDate"
                rules={[
                  {
                    required: true,
                    message: "Please select the package date!",
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="Package Status"
                name="packageStatus"
                rules={[
                  {
                    required: true,
                    message: "Please select the package status",
                  },
                ]}
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
                rules={[
                  {
                    required: true,
                    message:
                      "Please enter the name of the person who packaged this",
                  },
                ]}
              >
                <Input placeholder="Enter packager's name" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}

export default ManagePackage;
