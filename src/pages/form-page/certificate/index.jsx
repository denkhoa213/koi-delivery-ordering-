import React, { useState } from "react";
import { Form, Input, Button, Upload, Col, Row, Card } from "antd";
import { toast } from "react-toastify";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axios";
import uploadFile from "../../../utils/file";

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
        toast.error(error);
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
      navigate(`/total-order`);
    } catch (error) {
      const errorMessage = error.response?.data || "Có lỗi xảy ra.";
      toast.error(errorMessage);
    }
  };

  const handleUploadChange = (info) => {
    setFileList(info.fileList);
  };

  return (
    <Card title="Tạo Chứng Chỉ" bordered={false}>
      <Form onFinish={handleSubmitCertificate} form={form} layout="vertical">
        <Row gutter={16}>
          {/* Certificate Name */}
          <Col span={12}>
            <Form.Item
              name="certificateName"
              label="Tên chứng chỉ"
              rules={[
                { required: true, message: "Vui lòng nhập tên chứng chỉ!" },
              ]}
            >
              <Input placeholder="Nhập tên chứng chỉ" />
            </Form.Item>
          </Col>

          {/* Certificate Description */}
          <Col span={12}>
            <Form.Item
              name="certificateDescription"
              label="Mô tả chứng chỉ"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả chứng chỉ!" },
              ]}
            >
              <Input.TextArea placeholder="Nhập mô tả chứng chỉ" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Health Information */}
          <Col span={12}>
            <Form.Item
              name="health"
              label="Sức khỏe"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập thông tin sức khỏe!",
                },
              ]}
            >
              <Input placeholder="Nhập thông tin sức khỏe" />
            </Form.Item>
          </Col>

          {/* Origin */}
          <Col span={12}>
            <Form.Item
              name="origin"
              label="Nguồn gốc"
              rules={[{ required: true, message: "Vui lòng nhập nguồn gốc!" }]}
            >
              <Input placeholder="Nhập nguồn gốc" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Award Information */}
          <Col span={12}>
            <Form.Item
              name="award"
              label="Giải thưởng"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập thông tin giải thưởng!",
                },
              ]}
            >
              <Input placeholder="Nhập thông tin giải thưởng" />
            </Form.Item>
          </Col>

          {/* Image Upload */}
          <Col span={12}>
            <Form.Item label="Tải lên hình ảnh">
              <Upload
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={() => false} // Prevent auto upload
              >
                <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        {/* Submit Button */}
        <Form.Item style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit" style={{ width: "auto" }}>
            Gửi chứng chỉ
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CertificateForm;
