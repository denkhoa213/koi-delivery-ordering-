import React, { useState } from "react";
import { Form, Input, Select, Button, Upload, Checkbox } from "antd";
import { toast } from "react-toastify";
import uploadFile from "../../../utils/file"; //
import api from "../../../config/axios";

import FormLayout from "../../../components/layout/layout-form";
import { useNavigate } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const FishProfileForm = () => {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [hasCertificate, setHasCertificate] = useState(false);
  const [form] = Form.useForm();

  const fishCategories = [
    {
      id: 1,
      fish_category_name: "Type A",
      fish_category_description: "Super A",
    },
    {
      id: 2,
      fish_category_name: "Type B",
      fish_category_description: "Super B",
    },
    {
      id: 3,
      fish_category_name: "Type C",
      fish_category_description: "Super C",
    },
  ];

  const handleSubmitFishProfile = async (values) => {
    const orderId = localStorage.getItem("orderId");
    if (!orderId) {
      toast.error("Không tìm thấy đơn hàng! vui lòng đặt hàng trước.");
      navigate("/form-order");
      return;
    }

    // Upload file nếu có
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      try {
        const url = await uploadFile(file);
        values.image = url;
        toast.success("Tải lên hình ảnh thành công!"); // Thêm thông báo thành công
      } catch (error) {
        toast.error("Lỗi khi tải lên hình ảnh");
        return;
      }
    }

    values.orderId = orderId;
    try {
      const response = await api.post("fish-profile/create", values);
      toast.success("Tạo hồ sơ cá thành công!");
      if (hasCertificate) {
        navigate("/certificate");
      } else {
        navigate("/health-service");
      }
    } catch (error) {
      const errorMessage = error.response?.data || "Có lỗi xảy ra.";
      toast.error(errorMessage);
    }
  };
  const handleUploadChange = (info) => {
    setFileList(info.fileList);
  };

  return (
    <FormLayout>
      <Form onFinish={handleSubmitFishProfile} form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên cá"
          rules={[{ required: true, message: "Vui lòng nhập tên cá!" }]}
        >
          <Input placeholder="Nhập tên cá" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Input placeholder="Nhập mô tả" />
        </Form.Item>

        <Form.Item
          name="type"
          label="Loại cá"
          rules={[{ required: true, message: "Vui lòng chọn loại cá!" }]}
        >
          <Select placeholder="Chọn loại cá">
            {fishCategories.map((category) => (
              <Option key={category.id} value={category.fish_category_name}>
                {category.fish_category_description}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="size"
          label="Kích thước"
          rules={[{ required: true, message: "Vui lòng nhập kích thước!" }]}
        >
          <Input placeholder="Nhập kích thước (cm)" />
        </Form.Item>

        <Form.Item
          name="origin"
          label="Nguồn gốc"
          rules={[{ required: true, message: "Vui lòng nhập nguồn gốc!" }]}
        >
          <Input placeholder="Nhập nguồn gốc" />
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
          <Checkbox
            checked={hasCertificate}
            onChange={(e) => setHasCertificate(e.target.checked)}
          >
            Có chứng chỉ
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Đặt Hàng
          </Button>
        </Form.Item>
      </Form>
    </FormLayout>
  );
};

export default FishProfileForm;
