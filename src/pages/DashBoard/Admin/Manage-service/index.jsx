import {
  Button,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Table,
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import uploadFile from "../../../../utils/file";

function ManageService() {
  //quản lí sinh viên

  const [students, setStudents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  const api = "https://66e7de9cb17821a9d9da495c.mockapi.io/Student";

  const fetchStudent = async () => {
    // Lấy dữ liệu từ be

    //promise => function bất đồng bộ => cần time để thực hiện
    //await  đợi tới khi mà api trả về kết quả
    const response = await axios.get(api);

    console.log(response.data);
    setStudents(response.data);
    // GET => lấy dữ liệu
  };
  //[] dependency Array
  useEffect(() => {
    // hành động
    // chạy 1 cái hành động gì đó
    // event
    // [] => chạy khi load trang lần đầu
    //[number] => chạy mỗi khi number thay đổi
    fetchStudent();
  }, []);

  const columns = [
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
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => {
        return <Image src={image} alt="" width={150} />;
      },
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id) => {
        return (
          <>
            <Popconfirm
              title="Delete"
              description="Do you want to delete this student?"
              onConfirm={() => handleDeleteStudent(id)}
            >
              <Button type="primary" danger>
                Delete
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const handleOpenModal = () => {
    // tác động vào biến openModal
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmitStudent = async (student) => {
    //xử lí lấy thông tin student trong form => post xuống api

    //upload ảnh lên trước
    if (fileList.length > 0) {
      const file = fileList[0];
      console.log(file);
      const url = await uploadFile(file.originFileObj);
      student.image = url;
    }

    try {
      setSubmitting(true); //bắt đầu load
      const response = await axios.post(api, student);
      // => thành công
      toast.success("Sucessfully create student");
      setOpenModal(false);

      //Clear dữ liệu cũ
      form.resetFields();

      // lấy lại danh sách mới
      fetchStudent();
    } catch (err) {
      toast.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await axios.delete(`${api}/${studentId}`);
      toast.success("Delete sucessfully");
      fetchStudent();
    } catch (ex) {
      toast.error("Failed to delete student");
    }
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  return (
    <div>
      <h1>Student Management</h1>
      <button onClick={handleOpenModal}>Create Student</button>
      <Table columns={columns} dataSource={students} />
      {/* nếu open là true => modal hiện, false => modal ẩn đi*/}
      {/* onCancel => antd cung cấp*/}
      <Modal
        confirmLoading={submitting}
        onOk={() => form.submit()}
        title="Create new student"
        open={openModal}
        onCancel={handleCloseModal}
      >
        {/* form: đại diện cho Form này */}
        <Form onFinish={handleSubmitStudent} form={form}>
          {/* name => tên biến */}
          {/* rule => định nghĩa validation => [] */}
          <Form.Item
            label="Stuent name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input Student Name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* SE170200 */}
          <Form.Item
            label="Stuent code"
            name="code"
            rules={[
              {
                required: true,
                message: "Please input Student code!",
              },
              {
                pattern: "^SE\\d{6}$",
                message: "Invalid format!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Stuent score"
            name="score"
            rules={[
              {
                required: true,
                message: "Please input Student score!",
              },
              {
                type: "number",
                min: 0,
                max: 10,
                message: "Invalid Score!",
              },
            ]}
          >
            <InputNumber step={0.5} />
          </Form.Item>

          <Form.Item label="image" name="image">
            <Upload
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
          </Form.Item>
        </Form>
        <h1>Create new student</h1>
      </Modal>

      {previewImage && (
        <Image
          wrapperStyle={{
            display: "none",
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
}

export default ManageService;
