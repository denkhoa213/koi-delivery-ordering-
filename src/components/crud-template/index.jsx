import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../../config/axios";
import { Button, Form, Input, Modal, Popconfirm, Select, Table } from "antd";

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
        <>
          <Button
            type="primary"
            onClick={() => {
              setShowModal(true);
              form.setFieldsValue(category);
            }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete"
            description=" Do you want to delete this category?"
            onConfirm={() => handleDelete(id)}
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];
  //GET
  const fecthData = async () => {
    try {
      const response = await api.get(path);
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

      if (values.id) {
        // => Update
        const response = await api.put(`${path}/${values.id}`, values);
      } else {
        // => Create
        const response = await api.post(path, values);
      }

      toast.success("Successfully saved!");
      fecthData();
      form.resetFields();
      setShowModal(false);
    } catch (error) {
      toast.error(error.response.data);
    } finally {
      setLoading(false);
    }
  };
  //DELETE
  const handleDelete = async (id) => {
    try {
      await api.put(`${path}/${id}`);
      toast.success("Successfully delete!");
      fecthData();
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  useEffect(() => {
    fecthData();
  }, []);

  return (
    <div>
      <Button onClick={() => setShowModal(true)}>Add</Button>
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
