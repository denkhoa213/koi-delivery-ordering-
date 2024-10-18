import React, { useState } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import uploadFile from "../../utils/file";

const FishProfileForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const onFinish = async (values) => {
    try {
      // Lấy URL của ảnh đã upload từ Firebase
      const payload = {
        ...values,
        image: imageUrl,
      };

      // Gọi API của bạn để lưu thông tin fish profile (nếu có)
      // const response = await axios.post('/fish-profile/create', payload);

      message.success("Fish profile created successfully!");
    } catch (error) {
      message.error("An error occurred: " + error.message);
    }
  };

  // Hàm xử lý khi người dùng upload ảnh
  const handleUpload = async ({ file }) => {
    try {
      setLoading(true);
      // Gọi hàm uploadFile để upload lên Firebase Storage
      const downloadURL = await uploadFile(file);
      setImageUrl(downloadURL);
      message.success(`${file.name} file uploaded successfully`);
    } catch (error) {
      message.error(`${file.name} file upload failed.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} name="fishProfile" layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please input the name!" }]}
      >
        <Input placeholder="Enter fish name" />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Please input the description!" }]}
      >
        <Input.TextArea placeholder="Enter fish description" />
      </Form.Item>

      <Form.Item
        label="Type"
        name="type"
        rules={[{ required: true, message: "Please input the type!" }]}
      >
        <Input placeholder="Enter fish type" />
      </Form.Item>

      <Form.Item
        label="Size"
        name="size"
        rules={[{ required: true, message: "Please input the size!" }]}
      >
        <Input placeholder="Enter fish size" />
      </Form.Item>

      <Form.Item
        label="Origin"
        name="origin"
        rules={[{ required: true, message: "Please input the origin!" }]}
      >
        <Input placeholder="Enter fish origin" />
      </Form.Item>

      <Form.Item
        label="Image"
        name="image"
        rules={[{ required: true, message: "Please upload an image!" }]}
      >
        <Upload
          name="file"
          customRequest={handleUpload} // Sử dụng customRequest để upload file lên Firebase
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />} loading={loading}>
            Click to Upload
          </Button>
        </Upload>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Uploaded Image"
            style={{ marginTop: "10px", width: "100px" }}
          />
        )}
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" disabled={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FishProfileForm;
