import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Upload,
  DatePicker,
  Card,
  Row,
  Col,
  Radio,
} from "antd";
import { toast } from "react-toastify";
import api from "../../../config/axios";
import uploadFile from "../../../utils/file";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const CustomsDeclarationForm = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [selectedOption, setSelectedOption] = useState("customs"); // Track user selection
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const orderId = localStorage.getItem("orderId");
    if (!orderId) {
      toast.error("Không tìm thấy đơn hàng! Vui lòng đặt hàng trước.");
      navigate("/form-order");
      return;
    }

    values.orderId = orderId;

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

    try {
      const response = await api.post(
        `/customs-declaration/create/${orderId}`,
        values
      );

      // Check the user's selection and navigate accordingly
      if (selectedOption === "customsAndCertificate") {
        // If both customs declaration and certificate are selected
        navigate(`/certificate/${orderId}`);
      } else if (selectedOption === "customs") {
        // If only customs declaration is selected
        navigate(`/health-service/${orderId}`);
      }

      toast.success(response.data.message);
      console.log("Customs Declaration ID:", response.data.result.id);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleUploadChange = (info) => {
    setFileList(info.fileList);
  };

  // Handle radio button change
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <Card title="Thông tin khai báo hải quan" bordered={false}>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Row gutter={16}>
          {/* Customs Name */}
          <Col span={12}>
            <Form.Item
              label="Customs Name"
              name="customsName"
              rules={[
                { required: true, message: "Please enter the customs name!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>

          {/* Declaration Number */}
          <Col span={12}>
            <Form.Item
              label="Declaration Number"
              name="declarationNo"
              rules={[
                {
                  required: true,
                  message: "Please enter the declaration number!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Declaration Date */}
          <Col span={12}>
            <Form.Item
              label="Declaration Date"
              name="declarationDate"
              rules={[
                {
                  required: true,
                  message: "Please select the declaration date!",
                },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          {/* Declarant */}
          <Col span={12}>
            <Form.Item
              label="Declarant"
              name="declarationBy"
              rules={[
                {
                  required: true,
                  message: "Please enter the declarant's name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {/* Reference Number */}
          <Col span={12}>
            <Form.Item
              label="Reference Number"
              name="referenceNo"
              rules={[
                {
                  required: true,
                  message: "Please enter the reference number!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>

          {/* Reference Date */}
          <Col span={12}>
            <Form.Item
              label="Reference Date"
              name="referenceDate"
              rules={[
                {
                  required: true,
                  message: "Please select the reference date!",
                },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Image Upload */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Tải lên hình ảnh" name="imageUpload">
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

        {/* User Option */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Chọn loại dịch vụ" name="optionSelection">
              <Radio.Group value={selectedOption} onChange={handleOptionChange}>
                <Radio value="customs">Khai báo hải quan</Radio>
                <Radio value="customsAndCertificate">
                  Khai báo hải quan và chứng chỉ
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        {/* Submit Button */}
        <Form.Item style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit" style={{ width: "auto" }}>
            Gửi Khai Báo
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CustomsDeclarationForm;
