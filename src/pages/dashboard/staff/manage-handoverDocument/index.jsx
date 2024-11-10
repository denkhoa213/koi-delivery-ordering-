import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../../config/axios";
import {Button,Form,Input,Modal,Popconfirm,Select,Space,Table,} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";

function ManageHandoverDocuments() {
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    try {
      const response = await api.get("/handover-documents/view-all");
      const result = response.data.result.map((item) => ({
        ...item,
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
        const response = await api.put(`/handover-documents/update/${editingId}`, {
          handoverStatus: values.handoverStatus,
          orderCode: values.orderCode,
          packageId: values.packageId,
        });

        if (response.data.code === 200) {
          toast.success(response.data.message);
        }
      } else {
        const response = await api.post("/handover-documents/create", values);

        if (response.data.code === 200) {
          toast.success(response.data.message);

          const newHandoverId = response.data.result.handoverId;
          localStorage.setItem("handoverId", newHandoverId);
          setData((prevData) => [
            ...prevData,
            {
              ...values,
              id: newHandoverId,
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
      const response = await api.put(`/handover-documents/delete/${id}`);
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
        title: "Handover No",
        dataIndex: "handoverNo",
        key: "handoverNo",
      },
    {
      title: "Order Code",
      dataIndex: "orderCode",
      key: "orderCode", 
    },
    {
        title: "Package No",
        dataIndex: "packageNo", 
        key: "packageNo",
      },    
    {
      title: "Description",
      dataIndex: "handoverDescription",
      key: "handoverDescription",
    },
    {
      title: "Vehicle",
      dataIndex: "vehicle",
      key: "vehicle",
    },
    {
      title: "Handover Status",
      dataIndex: "handoverStatus",
      key: "handoverStatus",
      render: (status) => (
        <span style={{ color: status === "IN PROGRESS" ? "yellow" : "red" }}>
          {status}
        </span>
      ),
    },
    {
      title: "Destination",
      dataIndex: "destination",
      key: "destination",
    },
    {
      title: "Departure",
      dataIndex: "departure",
      key: "departure",
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
    },
    {
        title: "Create By",
        dataIndex: "createBy",
        key: "createBy",
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
        <span style={{ color: status === "COMPLETED" ? "green" : "red" }}>
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
                handoverStatus: category.handoverStatus,
              });
            }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete"
            description="Do you want to delete this handover?"
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
        Add New Handover Document
      </Button>
      <Table dataSource={data} columns={columns} />
      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={() => form.submit()}
        title="Handover"
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
          title="Handover"
        >
          {editingId ? (
            <Form.Item
              label="Handover Status"
              name="handoverStatus"
              rules={[
                { required: true, message: "Please select the handover status" },
              ]}
            >
              <Select>
                <Option value="PENDING">PENDING</Option>
                <Option value="IN PROGRESS">IN PROGRESS</Option>
                <Option value="COMPLETED">COMPLETED</Option>
              </Select>
            </Form.Item>
            
          ) : (
            <>
              <Form.Item
                label="Order Code"
                name="orderCode"
                rules={[
                  {
                    required: true,
                    message: "Please enter the order code",
                  },
                ]}
              >
                <Input placeholder="Enter Order Code" />
              </Form.Item>
              <Form.Item    
                label="Package No"
                name="packageNo"
                rules={[
                  {
                    required: true,
                    message: "Please enter the package no",
                  },
                ]}
              >
                <Input placeholder="Enter package Id" />
              </Form.Item>
              <Form.Item
                label="Handover Description"
                name="handoverDescription"
                rules={[
                  {
                    required: true,
                    message: "Please enter the handover description",
                  },
                ]}
              >
                <Input placeholder="Enter handover description" />
              </Form.Item>

              <Form.Item
                label="Handover Status"
                name="handoverStatus"
                rules={[
                  {
                    required: true,
                    message: "Please select the handover status",
                  },
                ]}
              >
              <Select>
                <Option value="PENDING">PENDING</Option>
                <Option value="IN PROGRESS">IN PROGRESS</Option>
                <Option value="COMPLETED">COMPLETED</Option>
              </Select>
              </Form.Item>

              
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}   

export default ManageHandoverDocuments;
