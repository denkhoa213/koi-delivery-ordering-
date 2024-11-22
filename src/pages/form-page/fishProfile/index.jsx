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
  InputNumber,
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
import Header from "../../../components/header";
import AppFooter from "../../../components/footer";

const { Option } = Select;
const { Title, Text } = Typography;

const FishProfileForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModalEditCertificate, setShowModalEditCertificate] =
    useState(false);
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [formCetificate] = Form.useForm();
  const [formEditCetificate] = Form.useForm();
  const [fishCategories, setFishCategories] = useState([]);
  const [viewFishOrder, setViewFishOrder] = useState([]);
  const [fishProfileId, setFishProfileId] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [showCertificates, setShowCertificates] = useState(false);

  const fetchFishCategories = async () => {
    try {
      const response = await api.get("fish-category/view-all");
      setFishCategories(response.data.result || []);
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const handleBack = () => {
    navigate(-1);
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
        toast.error(error.message("Lỗi tải hình ảnh!"));
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
      toast.error("Không có cá để tạo chứng chỉ!");
      return;
    }

    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      try {
        const url = await uploadFile(file);
        values.image = url;
        toast.success("Tải lên hình ảnh thành công!");
      } catch (error) {
        toast.error(error.message("Lỗi tải hình ảnh!"));
        return;
      }
    }

    try {
      for (const id of fishProfileId) {
        const response = await api.post(`/certificates/create/${id}`, values);
        toast.success(response.data.message);
      }
      fetchViewCertificate(fishProfileId);
      formCetificate.resetFields();
      setFileList([]);
      fetchViewCertificate();
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data || "Có lỗi xảy ra khi tạo chứng chỉ.");
    }
  };

  const handleEditCertificate = async (value) => {
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      try {
        const url = await uploadFile(file);
        value.image = url;
        toast.success("Tải lên hình ảnh thành công!");
      } catch (error) {
        toast.error(error.message("Lỗi tải hình ảnh!"));
        return;
      }
    }

    try {
      const certificateId = certificates[0].id;
      const response = await api.put(
        `/certificates/update/${certificateId}`,
        value
      );

      fetchViewFishOrder();
      fetchViewCertificate(fishProfileId);
      toast.success(response.data.message);
      formEditCetificate.resetFields();
      setFileList([]);
      setShowModalEditCertificate(false);
      setShowCertificates(true);
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const handleUploadChange = (info) => {
    setFileList(info.fileList);
  };

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/certificates/delete/${id}`);
      if (response.data.code === 200) {
        toast.success(response.data.message);
        fetchViewCertificate(fishProfileId);
      }
      fetchFishCategories();
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

  const handlePaymentClick = async () => {
    if (!orderId || orderId === "") {
      toast.error("Không có mã đơn hàng để thanh toán!");
      return;
    }

    try {
      const response = await api.get(`/fish-profile/view-by-order/${orderId}`);
      const fishOrderData = response.data.result;

      if (fishOrderData.length === 0) {
        // Nếu không có cá trong đơn hàng, hiển thị thông báo lỗi
        toast.error("Không có cá trong đơn hàng để thanh toán!");
        return;
      }

      // Nếu có cá, điều hướng
      navigate(`/total-order/${orderId}`);
    } catch (error) {
      const errorMessage =
        error.response?.data || "Có lỗi xảy ra khi kiểm tra hồ sơ cá!";
      toast.error(errorMessage);
    }
  };

  const columns = [
    {
      title: "Loại cá",
      dataIndex: "species",
      key: "species",
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
            setShowCertificates((prevState) => !prevState);
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
                age: value.age,
                weight: value.weight,
                color: value.color,
                sex: value.sex,
                species: value.species,
              });
              setFishProfileId([id]);
            }}
          >
            Thêm chứng chỉ
          </Button>
        </Space>
      ),
    },
  ];

  const certificateColumns = [
    {
      title: "Tên Chứng chỉ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giải thưởng",
      dataIndex: "award",
      key: "award",
    },
    {
      title: "Loài",
      dataIndex: "species",
      key: "species",
    },
    {
      title: "Giới tính",
      dataIndex: "sex",
      key: "sex",
    },
    {
      title: "Kích thước",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Tuổi",
      dataIndex: "age",
      key: "age",
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
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id, value) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setShowModalEditCertificate(true);
              formEditCetificate.setFieldsValue({
                name: value.name,
                size: value.size,
                image: value.image,
                age: value.age,
                weight: value.weight,
                color: value.color,
                sex: value.sex,
                species: value.species,
              });
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
    <>
      <Header />
      <div
        style={{
          padding: "20px",
          marginBottom: "80px",
          marginTop: "20px",
          backgroundColor: "#F5F5F5",
          minHeight: "100vh",
        }}
      >
        <Card
          title={
            <Title
              level={3}
              style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}
            >
              Thông tin hồ sơ cá Koi
            </Title>
          }
          bordered={false}
          style={{
            border: "2px solid #000",
            borderRadius: "8px",
          }}
        >
          <Form
            onFinish={handleSubmitFishProfile}
            form={form}
            layout="vertical"
            colon={false}
          >
            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Tên cá"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên cá!" },
                    {
                      max: 50,
                      message: "Tên cá không được vượt quá 50 ký tự!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập tên cá" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="description"
                  label="Mô tả"
                  rules={[
                    { required: true, message: "Vui lòng nhập mô tả!" },
                    {
                      max: 300,
                      message: "Mô tả không được vượt quá 200 ký tự!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập mô tả" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item
                  name="species"
                  label="Loại cá"
                  rules={[
                    { required: true, message: "Vui lòng chọn loại cá!" },
                  ]}
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
                    {
                      type: "number",
                      min: 1,
                      max: 100,
                      message: "Kích thước phải từ 1 đến 100 cm!",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={100}
                    addonAfter="Cm"
                    placeholder="Nhập kích thước"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item
                  name="sex"
                  label="Giới tính"
                  rules={[
                    { required: true, message: "Vui lòng chọn giới tính cá!" },
                  ]}
                >
                  <Select placeholder="Chọn giới tính">
                    <Select.Option value="MALE">Giống Đực</Select.Option>
                    <Select.Option value="FEMALE">Giống Cái</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="age"
                  label="Tuổi"
                  rules={[
                    { required: true, message: "Vui lòng nhập tuổi!" },
                    {
                      type: "number",
                      min: 1,
                      max: 20,
                      message: "Tuổi phải từ 1 đến 20!",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={20}
                    addonAfter="Năm"
                    placeholder="Nhập tuổi"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              <Col span={12}>
                <Form.Item
                  name="color"
                  label="Màu sắc"
                  rules={[
                    { required: true, message: "Vui lòng chọn màu sắc!" },
                  ]}
                >
                  <Select placeholder="Chọn màu sắc">
                    <Select.Option value="Đỏ">Đỏ</Select.Option>
                    <Select.Option value="Xanh dương">Xanh dương</Select.Option>
                    <Select.Option value="Xanh lá">Xanh lá</Select.Option>
                    <Select.Option value="Vàng">Vàng</Select.Option>
                    <Select.Option value="Trắng">Trắng</Select.Option>
                    <Select.Option value="Đen">Đen</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="weight"
                  label="Cân nặng"
                  rules={[
                    { required: true, message: "Vui lòng nhập cân nặng cá!" },
                    {
                      type: "number",
                      min: 1,
                      max: 20,
                      message: "Cân nặng phải từ 1 đến 20 kg!",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={20}
                    addonAfter="Kg"
                    placeholder="Nhập cân nặng"
                  />
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
                    {
                      max: 100,
                      message: "Nguồn gốc không được vượt quá 100 ký tự!",
                    },
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

            <Button
              onClick={handleBack}
              type="default"
              style={{
                width: "200px",
                marginTop: "20px",
                fontSize: "16px",
              }}
            >
              Quay lại
            </Button>

            <Divider />
            <Form.Item style={{ textAlign: "right" }}>
              <Space>
                <Button type="default" onClick={() => form.submit()}>
                  Tạo thêm cá mới
                </Button>

                <Button type="primary" onClick={handlePaymentClick}>
                  Thanh toán
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
              <Input placeholder="Nhập tên tên cá" readOnly />
            </Form.Item>

            <Form.Item
              name="species"
              label="Loài"
              rules={[{ required: true, message: "Vui lòng nhập loài!" }]}
            >
              <Input placeholder="Nhập loài" readOnly />
            </Form.Item>

            <Form.Item
              name="award"
              label="Giải thưởng"
              rules={[
                { required: true, message: "Vui lòng nhập giải thưởng!" },
              ]}
            >
              <Input placeholder="Nhập giải thưởng" />
            </Form.Item>

            <Form.Item
              name="sex"
              label="Giới tính"
              rules={[{ required: true, message: "Vui lòng nhập giới tính!" }]}
            >
              <Input placeholder="Nhập giới tính" readOnly />
            </Form.Item>

            <Form.Item
              name="size"
              label="Kích thước"
              rules={[{ required: true, message: "Vui lòng nhập kích thước!" }]}
            >
              <Input type="number" placeholder="Nhập kích thước" readOnly />
            </Form.Item>

            <Form.Item
              name="age"
              label="Tuổi"
              rules={[{ required: true, message: "Vui lòng nhập tuổi!" }]}
            >
              <Input type="number" placeholder="Nhập tuổi" readOnly />
            </Form.Item>

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
          </Form>
        </Modal>

        <Modal
          open={showModalEditCertificate}
          onCancel={() => setShowModalEditCertificate(false)}
          onOk={() => formEditCetificate.submit()}
          title="Cập nhật chứng chỉ"
        >
          <Form
            form={formEditCetificate}
            onFinish={handleEditCertificate}
            layout="vertical"
          >
            <Form.Item
              name="name"
              label="Tên cá"
              rules={[{ required: true, message: "Vui lòng nhập tên Tên cá" }]}
            >
              <Input placeholder="Nhập tên tên cá" readOnly />
            </Form.Item>

            <Form.Item
              name="species"
              label="Loài"
              rules={[{ required: true, message: "Vui lòng nhập loài!" }]}
            >
              <Input placeholder="Nhập loài" readOnly />
            </Form.Item>

            <Form.Item
              name="award"
              label="Giải thưởng"
              rules={[
                { required: true, message: "Vui lòng nhập giải thưởng!" },
              ]}
            >
              <Input placeholder="Nhập giải thưởng" />
            </Form.Item>

            <Form.Item
              name="sex"
              label="Giới tính"
              rules={[{ required: true, message: "Vui lòng nhập giới tính!" }]}
            >
              <Input placeholder="Nhập giới tính" readOnly />
            </Form.Item>

            <Form.Item
              name="size"
              label="Kích thước"
              rules={[{ required: true, message: "Vui lòng nhập kích thước!" }]}
            >
              <Input type="number" placeholder="Nhập kích thước" readOnly />
            </Form.Item>

            <Form.Item
              name="age"
              label="Tuổi"
              rules={[{ required: true, message: "Vui lòng nhập tuổi!" }]}
            >
              <Input type="number" placeholder="Nhập tuổi" readOnly />
            </Form.Item>

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
          </Form>
        </Modal>

        {showCertificates && (
          <div>
            <Divider>Danh sách chứng chỉ của cá Koi</Divider>
            {certificates.length > 0 ? (
              <Table
                dataSource={certificates}
                columns={certificateColumns}
                rowKey="id"
                pagination={false}
              />
            ) : (
              <Text>Không có chứng chỉ nào cho cá này.</Text>
            )}
          </div>
        )}
      </div>
      <AppFooter />
    </>
  );
};

export default FishProfileForm;
