import React, { useState } from "react";
import { Form, Input, Button, Upload } from "antd";
import { toast } from "react-toastify";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import uploadFile from "../../../utils/file";
import FormLayout from "../../../components/layout/layout-form";

const CertificateForm = () => {
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmitCertificate = async (values) => {
    const orderId = localStorage.getItem("orderId");
    if (!orderId) {
      toast.error("Không tìm thấy đơn hàng! Vui lòng đặt hàng trước.");
      navigate("/form-order");
      return;
    }

    // Upload file nếu có
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      try {
        const url = await uploadFile(file);
        values.image = url;
      } catch (error) {
        toast.error("Lỗi khi tải lên hình ảnh");
        return;
      }
    }

    values.orderId = orderId;

    try {
      const response = await api.post(
        `/certificates/create/${values.orderId}`,
        values
      );
      toast.success(response.data.message);
      navigate(`/fish-profile/${orderId}`);
    } catch (error) {
      const errorMessage = error.response?.data || "Có lỗi xảy ra.";
      toast.error(errorMessage);
    }
  };

  const handleUploadChange = (info) => {
    setFileList(info.fileList);
  };

  return (
    <FormLayout title="Certificate">
      <Form onFinish={handleSubmitCertificate} form={form} layout="vertical">
        <Form.Item
          name="certificateName"
          label="Tên chứng chỉ"
          rules={[{ required: true, message: "Vui lòng nhập tên chứng chỉ!" }]}
        >
          <Input placeholder="Nhập tên chứng chỉ" />
        </Form.Item>

        <Form.Item
          name="certificateDescription"
          label="Mô tả chứng chỉ"
          rules={[
            { required: true, message: "Vui lòng nhập mô tả chứng chỉ!" },
          ]}
        >
          <Input.TextArea placeholder="Nhập mô tả chứng chỉ" />
        </Form.Item>

        <Form.Item
          name="health"
          label="Sức khỏe"
          rules={[
            { required: true, message: "Vui lòng nhập thông tin sức khỏe!" },
          ]}
        >
          <Input placeholder="Nhập thông tin sức khỏe" />
        </Form.Item>

        <Form.Item
          name="origin"
          label="Nguồn gốc"
          rules={[{ required: true, message: "Vui lòng nhập nguồn gốc!" }]}
        >
          <Input placeholder="Nhập nguồn gốc" />
        </Form.Item>

        <Form.Item
          name="award"
          label="Giải thưởng"
          rules={[
            { required: true, message: "Vui lòng nhập thông tin giải thưởng!" },
          ]}
        >
          <Input placeholder="Nhập thông tin giải thưởng" />
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
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Tạo Chứng Chỉ
          </Button>
        </Form.Item>
      </Form>
    </FormLayout>
  );
};

export default CertificateForm;
