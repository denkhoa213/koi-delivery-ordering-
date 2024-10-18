import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  InputNumber,
  Upload,
  Image,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import api from "../../config/axios";
import { toast } from "react-toastify";
import uploadFile from "../../utils/file";

const { Option } = Select;

const OrderForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState("order");
  const [form] = Form.useForm();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [services, setServices] = useState([]); // State để lưu danh sách dịch vụ

  useEffect(() => {
    // Gọi hàm fetchServices khi component được mount
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get("/heal-service-category/view-all");
      setServices(response.data.result); // Thiết lập danh sách dịch vụ
    } catch (error) {
      toast.error("Lỗi khi tải danh sách dịch vụ");
    }
  };

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

  // Gửi đơn hàng
  const handleSubmitOrder = async (values) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.post("order/create", values, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrderId(response.data.result.id); // Lưu orderId vào state
      console.log("Order ID:", response.data.result.id); // Xem giá trị orderId
      toast.success("Đặt hàng thành công!");
      setCurrentStep("fishProfile"); // Chuyển qua bước tạo hồ sơ cá
    } catch (error) {
      console.error("Order submission error:", error); // Kiểm tra lỗi
      toast.error(error.response.data);
    }
  };
  // Xử lý submit hồ sơ cá
  const handleSubmitFishProfile = async (values) => {
    // Kiểm tra xem đã có hình ảnh chưa trước khi gửi
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      try {
        // Upload file lên Firebase và lấy URL
        const imageUrl = await uploadFile(file);
        values.image = imageUrl; // Gắn URL hình ảnh vào values trước khi gửi
      } catch (error) {
        toast.error("Lỗi khi tải lên hình ảnh");
        return;
      }
    }

    try {
      const response = await api.post("/fish-profile/create", values);
      toast.success("Tạo hồ sơ cá thành công!");
      setCurrentStep("services");
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  // Xử lý submit dịch vụ
  // Xử lý submit dịch vụ
  const handleSubmitServices = async (values) => {
    const selectedServices = values.selectedServices; // Lấy selectedServices từ values
    console.log("Current Order ID:", orderId); // Kiểm tra orderId trước khi gửi dịch vụ
    if (!orderId) {
      toast.error("Không tìm thấy orderId!");
      return;
    }

    if (!Array.isArray(selectedServices) || selectedServices.length === 0) {
      toast.error("Vui lòng chọn ít nhất một dịch vụ!");
      return;
    }

    try {
      for (const serviceId of selectedServices) {
        await api.post(`/health-service-order/create/${orderId}/${serviceId}`);
      }
      toast.success("Dịch vụ đã được thêm thành công!");
      setShowModal(false);
    } catch (error) {
      console.error("Service submission error:", error); // Kiểm tra lỗi
      if (error.response && error.response.data) {
        toast.error(error.response.data);
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    }
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Tải lên
      </div>
    </button>
  );

  return (
    <>
      <Button type="primary" onClick={() => setShowModal(true)}>
        Đặt hàng
      </Button>
      <Modal
        title={
          currentStep === "order"
            ? "Form Đặt Hàng"
            : currentStep === "fishProfile"
            ? "Form Hồ Sơ Cá"
            : "Chọn Dịch Vụ"
        }
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={() => form.submit()}
        okText={
          currentStep === "order"
            ? "Gửi Đơn Hàng"
            : currentStep === "fishProfile"
            ? "Gửi Hồ Sơ Cá"
            : "Gửi Dịch Vụ"
        }
        cancelText="Hủy"
      >
        {currentStep === "order" ? (
          <Form
            onFinish={handleSubmitOrder}
            form={form}
            layout="vertical"
            initialValues={{
              deliveryMethod: "",
              destination: "",
              departure: "",
              distance: 0,
              phone: "",
              amount: 0,
            }}
          >
            {/* Form cho thông tin đơn hàng */}
            <Form.Item
              name="deliveryMethod"
              label="Phương thức giao hàng"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn phương thức giao hàng!",
                },
              ]}
            >
              <Select placeholder="Chọn phương thức giao hàng">
                <Option value="Van">VAN</Option>
                <Option value="Plane">PLANE</Option>
                <Option value="Boat">BOAT</Option>
                <Option value="Train">TRAIN</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="destination"
              label="Điểm đến"
              rules={[{ required: true, message: "Vui lòng nhập điểm đến!" }]}
            >
              <Input placeholder="Nhập điểm đến" />
            </Form.Item>

            <Form.Item
              name="departure"
              label="Nơi đi"
              rules={[{ required: true, message: "Vui lòng nhập nơi đi!" }]}
            >
              <Input placeholder="Nhập nơi đi" />
            </Form.Item>

            <Form.Item
              name="distance"
              label="Khoảng cách (km)"
              rules={[
                { required: true, message: "Vui lòng nhập khoảng cách!" },
              ]}
            >
              <InputNumber
                placeholder="Nhập khoảng cách"
                min={0}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Số điện thoại phải có 10 chữ số!",
                },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item
              name="amount"
              label="Số tiền (USD)"
              rules={[{ required: true, message: "Vui lòng nhập số tiền!" }]}
            >
              <InputNumber
                placeholder="Nhập số tiền"
                min={0}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Form>
        ) : currentStep === "fishProfile" ? (
          <Form
            onFinish={handleSubmitFishProfile}
            form={form}
            layout="vertical"
            initialValues={{
              name: "",
              description: "",
              type: "",
              size: "",
              origin: "",
              image: "",
            }}
          >
            {/* Form cho thông tin hồ sơ cá */}
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

            <Form.Item
              name="image"
              label="Hình ảnh"
              rules={[
                { required: true, message: "Vui lòng tải lên hình ảnh!" },
              ]}
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                beforeUpload={() => false}
                onPreview={handlePreview}
                onChange={handleChange}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
            </Form.Item>
          </Form>
        ) : (
          <Form onFinish={handleSubmitServices} form={form} layout="vertical">
            {/* Form cho chọn dịch vụ */}
            <Form.Item
              name="selectedServices"
              label="Chọn dịch vụ"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn ít nhất một dịch vụ!",
                },
              ]}
            >
              <Select mode="multiple" placeholder="Chọn dịch vụ">
                {services.map((service) => (
                  <Option key={service.id} value={service.id}>
                    {service.serviceName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default OrderForm;
