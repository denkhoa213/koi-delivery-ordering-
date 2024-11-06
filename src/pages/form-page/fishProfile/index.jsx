import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Upload, Row, Col, Card } from "antd";
import { toast } from "react-toastify";
import uploadFile from "../../../utils/file"; // Giả sử uploadFile là một hàm hỗ trợ tải file
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const FishProfileForm = () => {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [fishCategories, setFishCategories] = useState([]);

  const fetchFishCategories = async () => {
    try {
      const response = await api.get("fish-category/view-all");
      setFishCategories(response.data.result || []);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleSubmitFishProfile = async (values) => {
    // Upload file nếu có
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      try {
        const url = await uploadFile(file);
        values.image = url;
        toast.success("Tải lên hình ảnh thành công!");
      } catch (error) {
        toast.error(error);
        return;
      }
    }

    try {
      const response = await api.post("fish-profile/create", values);
      const fishProfileId = response.data.result.id;
      localStorage.setItem("fishProfileId", fishProfileId);
      toast.success("Tạo hồ sơ cá thành công!");
      navigate(`/form-order`);
    } catch (error) {
      const errorMessage = error.response?.data || "Có lỗi xảy ra.";
      toast.error(errorMessage);
    }
  };

  const handleUploadChange = (info) => {
    setFileList(info.fileList);
  };

  useEffect(() => {
    fetchFishCategories();
  }, []);

  return (
    <Card title="Thông tin hồ sơ cá Koi" bordered={false}>
      <Form onFinish={handleSubmitFishProfile} form={form} layout="vertical">
        <Row gutter={16}>
          {/* Cột bên trái */}
          <Col span={24}>
            <Row gutter={16}>
              {/* Cặp Tên cá - Mô tả nằm trên cùng một hàng */}
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Tên cá"
                  rules={[{ required: true, message: "Vui lòng nhập tên cá!" }]}
                >
                  <Input placeholder="Nhập tên cá" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="description"
                  label="Mô tả"
                  rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                >
                  <Input placeholder="Nhập mô tả" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              {/* Cặp Loại cá - Kích thước */}
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="Loại cá"
                  rules={[
                    { required: true, message: "Vui lòng chọn loại cá!" },
                  ]}
                >
                  <Select
                    placeholder="Chọn loại cá"
                    loading={!fishCategories.length}
                  >
                    {fishCategories.map((category) => (
                      <Option
                        key={category.id}
                        value={category.fishCategoryName}
                      >
                        {category.fishCategoryName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="size"
                  label="Kích thước"
                  rules={[
                    { required: true, message: "Vui lòng nhập kích thước!" },
                  ]}
                >
                  <Input placeholder="Nhập kích thước (cm)" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              {/* Cặp Nguồn gốc - Tải lên hình ảnh */}
              <Col span={12}>
                <Form.Item
                  name="origin"
                  label="Nguồn gốc"
                  rules={[
                    { required: true, message: "Vui lòng nhập nguồn gốc!" },
                  ]}
                >
                  <Input placeholder="Nhập nguồn gốc" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Tải lên hình ảnh">
                  <Upload
                    fileList={fileList}
                    onChange={handleUploadChange}
                    beforeUpload={() => false} // Ngăn chặn tự động tải lên
                  >
                    <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Nút ở góc phải phía dưới */}
        <Form.Item style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit" style={{ width: "auto" }}>
            Xác nhận hồ sơ cá
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FishProfileForm;
