import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  Row,
  Col,
  Card,
  Table,
  Space,
  Modal,
  Typography,
  Divider,
  Popconfirm,
} from "antd";
import { toast } from "react-toastify";
import uploadFile from "../../../utils/file";
import api from "../../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { Title, Text } = Typography;

const FishProfileForm = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [formCetificate] = Form.useForm();
  const [fishCategories, setFishCategories] = useState([]);
  const [viewFishOrder, setViewFishOrder] = useState([]);
  const [fishProfileId, setFishProfileId] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [certificateModalVisible, setCertificateModalVisible] = useState(false);

  const fetchFishCategories = async () => {
    try {
      const response = await api.get("fish-category/view-all");
      setFishCategories(response.data.result || []);
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const fetchViewFishOrder = async () => {
    try {
      if (!orderId) {
        toast.error("Không tìm thấy mã đơn hàng!");
        return;
      }

      const response = await api.get(`/fish-profile/view-by-order/${orderId}`);
      const fishOrderData = response.data.result;
      if (fishOrderData.length > 0) {
        const fishProfileId = fishOrderData.map((fish) => fish.id);
        setViewFishOrder(fishOrderData);
        setFishProfileId(fishProfileId);
        console.log("fishProfileId:", fishProfileId);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data || "Có lỗi xảy ra khi tải hồ sơ cá!";
      toast.error(errorMessage);
    }
  };

  const fetchViewCertificate = async (fishProfileId) => {
    if (!fishProfileId || fishProfileId.length === 0) {
      return;
    }

    try {
      const response = await api.get(
        `/certificates/view-by-fish-profile/${fishProfileId}`
      );
      setCertificates(response.data.result);
    } catch (error) {
      toast.error(error.response?.data || "Có lỗi xảy ra khi tải chứng chỉ.");
    }
  };

  const handleSubmitFishProfile = async (values) => {
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      try {
        const url = await uploadFile(file);
        values.image = url;
        toast.success("Tải lên hình ảnh thành công!");
      } catch (error) {
        toast.error("Lỗi khi tải lên hình ảnh!");
        return;
      }
    }

    values.orderId = orderId;

    try {
      const response = await api.post(`fish-profile/create/${orderId}`, values);
      if (response.data.code === 200) {
        toast.success(response.data.message);
        form.resetFields();
        fetchViewFishOrder();
        setFileList([]);
      }
    } catch (error) {
      const errorMessage = error.response?.data || "Có lỗi xảy ra.";
      toast.error(errorMessage);
    }
  };

  const handleAddCertificate = async (values) => {
    if (!fishProfileId || fishProfileId.length === 0) {
      toast.error("Không có fishProfileId để tạo chứng chỉ!");
      return;
    }

    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      try {
        const url = await uploadFile(file);
        values.image = url;
        toast.success("Tải lên hình ảnh thành công!");
      } catch (error) {
        toast.error("Lỗi khi tải lên hình ảnh!");
        return;
      }
    }

    try {
      for (const id of fishProfileId) {
        const response = await api.post(`/certificates/create/${id}`, values);
        toast.success(
          `Chứng chỉ đã được tạo cho cá với ID: ${id} - ${response.data.message}`
        );
      }

      form.resetFields();
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data || "Có lỗi xảy ra khi tạo chứng chỉ.");
    }
  };

  const handleUploadChange = (info) => {
    setFileList(info.fileList);
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.put(`/fish-profile/delete/${id}`);
      if (response.data.code === 200) {
        toast.success(response.data.message);
        fetchViewFishOrder();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data || "Có lỗi xảy ra khi xóa hồ sơ cá!";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchFishCategories();
    fetchViewFishOrder();
    fetchViewCertificate();
  }, []);

  const handlePaymentClick = () => {
    navigate(`/total-order/${orderId}`);
  };
  const columns = [
    {
      title: "Loại cá",
      dataIndex: "fishCategory",
      key: "fishCategory",
    },
    {
      title: "Tên cá",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Kích thước",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Nguồn gốc",
      dataIndex: "origin",
      key: "origin",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (text) => (
        <img
          src={text}
          alt="Fish"
          style={{ width: 100, borderRadius: "8px" }}
        />
      ),
    },
    {
      title: "Chứng chỉ",
      dataIndex: "id",
      key: "id",
      render: (id, value) => (
        <Button
          type="primary"
          onClick={() => {
            fetchViewCertificate(value.id);
            setCertificateModalVisible(true);
            setFishProfileId([id]);
          }}
        >
          Xem chứng chỉ
        </Button>
      ),
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id, value) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setShowModal(true);
              formCetificate.setFieldsValue({
                name: value.name,
                size: value.size,
                image: value.image,
              });
              setFishProfileId([id]);
            }}
          >
            Thêm chứng chỉ
          </Button>

          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setShowModal(true);
              form.setFieldsValue(value);
            }}
          >
            Cập nhật
          </Button>

          <Popconfirm
            title="Delete"
            description="Do you want to delete this?"
            onConfirm={() => handleDelete(id)}
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      <Card
        title={<Title level={3}>Thông tin hồ sơ cá Koi</Title>}
        bordered={false}
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Form onFinish={handleSubmitFishProfile} form={form} layout="vertical">
          <Divider>Thông tin cá Koi</Divider>
          <Row gutter={[24, 16]}>
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

          <Row gutter={[24, 16]}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Loại cá"
                rules={[{ required: true, message: "Vui lòng chọn loại cá!" }]}
              >
                <Select
                  placeholder="Chọn loại cá"
                  loading={!fishCategories.length}
                  optionLabelProp="label"
                >
                  {fishCategories.map((category) => (
                    <Option
                      key={category.id}
                      value={category.fishCategoryName}
                      label={category.fishCategoryName}
                    >
                      <strong>{category.fishCategoryName}</strong>
                      <Text
                        type="secondary"
                        style={{ fontSize: "12px", display: "block" }}
                      >
                        {category.fishCategoryDescription}
                      </Text>
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
                <Input placeholder="Nhập kích thước" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 16]}>
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
              <Form.Item
                label="Tải lên hình ảnh"
                name="image"
                rules={[
                  { required: true, message: "Vui lòng tải lên hình ảnh!" },
                ]}
              >
                <Upload
                  fileList={fileList}
                  onChange={handleUploadChange}
                  beforeUpload={() => false}
                >
                  <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Divider />
          <Form.Item style={{ textAlign: "right" }}>
            <Space>
              <Button type="primary" onClick={handlePaymentClick}>
                Thanh toán
              </Button>

              <Button type="default" onClick={() => form.submit()}>
                Tạo thêm cá mới
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Divider>Danh sách hồ sơ cá Koi</Divider>
      <Table
        dataSource={viewFishOrder}
        columns={columns}
        bordered
        rowKey="id"
      />

      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={() => formCetificate.submit()}
        title="Thêm chứng chỉ"
      >
        <Form
          form={formCetificate}
          onFinish={handleAddCertificate}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên cá"
            rules={[{ required: true, message: "Vui lòng nhập tên Tên cá" }]}
          >
            <Input placeholder="Nhập tên chứng chỉ" />
          </Form.Item>

          <Form.Item
            name="species"
            label="Loài"
            rules={[{ required: true, message: "Vui lòng nhập loài!" }]}
          >
            <Input placeholder="Nhập loài" />
          </Form.Item>

          <Form.Item
            name="award"
            label="Giải thưởng"
            rules={[{ required: true, message: "Vui lòng nhập giải thưởng!" }]}
          >
            <Input placeholder="Nhập giải thưởng" />
          </Form.Item>

          <Form.Item
            name="sex"
            label="Giới tính"
            rules={[{ required: true, message: "Vui lòng nhập giới tính!" }]}
          >
            <Input placeholder="Nhập giới tính" />
          </Form.Item>

          <Form.Item
            name="size"
            label="Kích thước"
            rules={[{ required: true, message: "Vui lòng nhập kích thước!" }]}
          >
            <Input type="number" placeholder="Nhập kích thước" />
          </Form.Item>

          <Form.Item
            name="age"
            label="Tuổi"
            rules={[{ required: true, message: "Vui lòng nhập tuổi!" }]}
          >
            <Input type="number" placeholder="Nhập tuổi" />
          </Form.Item>

          <Form.Item
            label="Tải lên hình ảnh"
            name="image"
            rules={[{ required: true, message: "Vui lòng tải lên hình ảnh!" }]}
          >
            <Upload
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={certificateModalVisible}
        onCancel={() => setCertificateModalVisible(false)}
        title="Chứng chỉ cá"
      >
        <div>
          {certificates.length > 0 ? (
            certificates.map((certificate) => (
              <Card
                key={certificate.id}
                style={{
                  marginBottom: 16,
                  borderRadius: 8,
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  padding: "16px",
                }}
                hoverable
              >
                <Row gutter={16}>
                  <Col span={24}>
                    <Title level={4}>{certificate.name}</Title>
                  </Col>
                  <Col span={12}>
                    <Text strong>Giải thưởng:</Text> {certificate.award}
                  </Col>
                  <Col span={12}>
                    <Text strong>Loài:</Text> {certificate.species}
                  </Col>
                </Row>
                <Divider />
              </Card>
            ))
          ) : (
            <Text>Không có chứng chỉ nào cho cá này.</Text>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default FishProfileForm;
