import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, Modal, Popconfirm, Space, Table } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import api from "../../config/axios";

function CRUDTemplate({ columns, formItem, path }) {
  const [datas, setDatas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const tableColumn = [
    ...columns,
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
              form.setFieldsValue(category);
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
  //GET
  const fecthData = async () => {
    try {
      const response = await api.get(`${path}/view-all`);
      setDatas(response.data.result);
    } catch (err) {
      toast.error(err.response.data);
    }
  };
  //CREATE OR UPDATE
  const handleSubmit = async (values) => {
    console.log(values);
    try {
      setLoading(true);

      let response;
      if (values.id) {
        // Update
        response = await api.put(`${path}/update/${values.id}`, values);
      } else {
        // Create
        response = await api.post(`${path}/create`, values);
      }

      if (response.data.code === 200) {
        toast.success(response.data.message);
      }

      fecthData();
      form.resetFields();
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  //DELETE
  const handleDelete = async (id) => {
    try {
      const response = await api.put(`${path}/delete/${id}`);
      toast.success(response.data.message);
      fecthData();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fecthData();
  }, []);

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setShowModal(true)}
        style={{ marginBottom: "16px" }}
      >
        Add
      </Button>
      <Table dataSource={datas} columns={tableColumn} />
      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={() => form.submit()}
        title="HealServiceCategory"
        confirmLoading={loading}
      >
        <Form
          form={form}
          labelCol={{
            span: 24,
          }}
          onFinish={handleSubmit}
        >
          {formItem}
        </Form>
      </Modal>
    </div>
  );
}

export default CRUDTemplate;
