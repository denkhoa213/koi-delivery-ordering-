import React, { useState } from "react";
import { Button, Form, Input, Modal, Upload, DatePicker } from "antd";
import { toast } from "react-toastify";
import api from "../../../config/axios";

const CustomsDeclarationForm = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const handleSubmit = async (values) => {
    try {
      // Prepare data for submission
      const declarationData = {
        ...values,
        declarationDate: values.declarationDate.toISOString(),
        referenceeDate: values.referenceeDate.toISOString(),
        image:
          fileList.length > 0
            ? await uploadFile(fileList[0].originFileObj)
            : null, // Upload file if exists
      };

      const response = await api.post(
        "/api/v1/customsdecalaration/create",
        declarationData
      );
      toast.success("Khai báo hải quan thành công!");
      console.log("Customs Declaration ID:", response.data.result.id); // Kiểm tra ID khai báo
    } catch (error) {
      console.error("Error submitting customs declaration:", error);
      toast.error("Có lỗi xảy ra khi khai báo hải quan");
    }
  };

  // Function to handle file upload
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/upload", formData); // Adjust endpoint as necessary
    return response.data.url; // Assuming the response contains the URL of the uploaded file
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        label="Số Giấy Khai"
        name="declarationNo"
        rules={[{ required: true, message: "Vui lòng nhập số giấy khai!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Ngày Khai Báo"
        name="declarationDate"
        rules={[{ required: true, message: "Vui lòng chọn ngày khai báo!" }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Người Khai Báo"
        name="declaratonBy"
        rules={[{ required: true, message: "Vui lòng nhập người khai báo!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Số Tham Chiếu"
        name="referenceNo"
        rules={[{ required: true, message: "Vui lòng nhập số tham chiếu!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Ngày Tham Chiếu"
        name="referenceeDate"
        rules={[{ required: true, message: "Vui lòng chọn ngày tham chiếu!" }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Tên Hải Quan"
        name="customsName"
        rules={[{ required: true, message: "Vui lòng nhập tên hải quan!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Tải Lên Hình Ảnh" name="image">
        <Upload
          fileList={fileList}
          beforeUpload={(file) => {
            setFileList([file]);
            return false; // Prevent automatic upload
          }}
          onRemove={() => setFileList([])} // Remove file
          maxCount={1} // Limit to one file
        >
          <Button>Chọn Hình Ảnh</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Gửi Khai Báo
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CustomsDeclarationForm;
