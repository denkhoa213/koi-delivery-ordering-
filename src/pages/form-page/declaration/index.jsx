import React, { useState } from "react";
import { Button, Form, Input, Modal, Upload, DatePicker } from "antd";
import { toast } from "react-toastify";
import api from "../../../config/axios";
import uploadFile from "../../../utils/file";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const CustomsDeclarationForm = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const orderId = localStorage.getItem("orderId");
    if (!orderId) {
      toast.error("Không tìm thấy đơn hàng! Vui lòng đặt hàng trước.");
      return;
    }

    // Chuẩn bị giá trị để gửi
    values.orderId = orderId;

    // Xử lý tải lên ảnh nếu có tệp
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      try {
        const url = await uploadFile(file); // Giả định hàm uploadFile tải ảnh lên và trả về URL
        values.image = url;
      } catch (error) {
        toast.error("Lỗi khi tải lên hình ảnh");
        return;
      }
    }

    try {
      const response = await api.post(
        `/customs-declaration/create/${orderId}`,
        values
      );
      navigate("/health-service");
      toast.success("Khai báo hải quan thành công!");
      console.log("Customs Declaration ID:", response.data.result.id);
    } catch (error) {
      console.error("Lỗi khi gửi khai báo hải quan:", error);
      toast.error("Có lỗi xảy ra khi khai báo hải quan");
    }
  };

  const handleUploadChange = (info) => {
    setFileList(info.fileList);
  };
  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        label="Customs Name"
        name="customsName"
        rules={[{ required: true, message: "Please enter the customs name!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Declaration Number"
        name="declarationNo"
        rules={[
          { required: true, message: "Please enter the declaration number!" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Declaration Date"
        name="declarationDate"
        rules={[
          { required: true, message: "Please select the declaration date!" },
        ]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Declarant"
        name="declarationBy"
        rules={[
          { required: true, message: "Please enter the declarant's name!" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Reference Number"
        name="referenceNo"
        rules={[
          { required: true, message: "Please enter the reference number!" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Reference Date"
        name="referenceDate"
        rules={[
          { required: true, message: "Please select the reference date!" },
        ]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item label="Tải lên hình ảnh">
        <Upload
          fileList={fileList}
          onChange={handleUploadChange}
          beforeUpload={() => false} // Ngăn chặn tự động tải lên
        >
          <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
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
