import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../../../config/axios";
import { Button, Table, Modal, Input, Form, Select, Descriptions } from "antd";

const CheckHealth = () => {
  const [viewHandOver, setViewHandOver] = useState([]);
  const [fishProfile, setFishProfile] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isHealthModalVisible, setIsHealthModalVisible] = useState(false);
  const [isViewFishModalVisible, setIsViewFishModalVisible] = useState(false);
  const [selectedFish, setSelectedFish] = useState([]);

  const [form] = Form.useForm();

  const fetchHandOver = async () => {
    try {
      const response = await api.get(
        "/handover-documents/view-by-delivery-staff"
      );
      setViewHandOver(response.data.result);
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const fetchFishProfile = async (orderId) => {
    if (!orderId) {
      toast.error("Order ID không hợp lệ!");
      return;
    }
    try {
      const response = await api.get(`/fish-profile/view-by-order/${orderId}`);
      const fishData = response.data.result;

      const updatedFishData = await Promise.all(
        fishData.map(async (fish) => {
          try {
            const healthResponse = await api.get(
              `/checking-koi-health/existed-checking-koi-heath/${fish.id}`
            );
            return {
              ...fish,
              isHealthChecked: healthResponse.data.result,
            };
          } catch (error) {
            toast.error(error.healthResponse.data);
            return { ...fish, isHealthChecked: false };
          }
        })
      );

      setFishProfile(updatedFishData);
      setSelectedOrderId(orderId);
    } catch (error) {
      toast.error(error.response.data);
    }
  };
  useEffect(() => {
    fetchHandOver();
    viewHealthByFishProfile();
  }, []);

  const handleHealthSubmit = async (values) => {
    try {
      const payload = {
        healthStatus: values.healthStatus,
        healthStatusDescription: values.healthStatusDescription,
        weight: selectedFish.weight,
        type: selectedFish.type,
        color: selectedFish.color,
        age: selectedFish.age,
        species: selectedFish.species,
        sex: selectedFish.sex,
      };

      const response = await api.post(
        `/checking-koi-health/create/${selectedFish.id}`,
        payload
      );

      toast.success(response.data.message);

      setSelectedFish({
        ...selectedFish,
        healthStatus: values.healthStatus,
        healthStatusDescription: values.healthStatusDescription,
        isHealthChecked: true,
      });
      setIsHealthModalVisible(false);
      fetchFishProfile(selectedOrderId); // Làm mới danh sách cá
      form.resetFields();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Không thể kiểm tra sức khỏe cá!"
      );
    }
  };

  const viewHealthByFishProfile = async (fish) => {
    try {
      const response = await api.get(
        `/checking-koi-health/view-by-fish-profile/${fish.id}`
      );
      const healthData = response.data.result;

      // Lấy bản ghi mới nhất dựa trên trường `updateAt`
      const latestHealthData = healthData.sort(
        (a, b) => new Date(b.updateAt) - new Date(a.updateAt)
      )[0];

      setSelectedFish({
        ...fish,
        healthStatus: latestHealthData?.healthStatus || "Chưa kiểm tra",
        healthStatusDescription:
          latestHealthData?.healthStatusDescription || "Chưa có thông tin",
        isHealthChecked: !!latestHealthData,
      });

      setIsViewFishModalVisible(true);
    } catch (error) {
      console.error("Error fetching health data:", error);
    }
  };

  const columns = [
    {
      title: "Số biên bản bàn giao",
      dataIndex: "handoverNo",
      key: "handoverNo",
    },
    {
      title: "Mô tả",
      dataIndex: "handoverDescription",
      key: "handoverDescription",
    },
    {
      title: "Phương tiện",
      dataIndex: "vehicle",
      key: "vehicle",
    },
    {
      title: "Điểm đến",
      dataIndex: "destination",
      key: "destination",
    },
    {
      title: "Điểm khởi hành",
      dataIndex: "departure",
      key: "departure",
    },
    {
      title: "Tổng giá",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text) => <span>{text.toLocaleString()} VNĐ</span>,
    },
    {
      title: "Trạng thái bàn giao",
      dataIndex: "handoverStatusEnum",
      key: "handoverStatusEnum",
      render: (handoverStatusEnum) => {
        let statusColor = "#d9d9d9"; // Màu mặc định (xám)

        if (handoverStatusEnum === "COMPLETED") {
          statusColor = "#d9d9d9"; // Màu xanh cho COMPLETED
        }

        return (
          <span
            style={{
              backgroundColor: statusColor,
              color: "#fff",
              padding: "5px 10px",
              borderRadius: "5px",
            }}
          >
            {handoverStatusEnum}
          </span>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Button type="primary" onClick={() => fetchFishProfile(record.orderId)}>
          Xem cá
        </Button>
      ),
    },
  ];

  const fishColumns = [
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
      render: (url) => <img src={url} alt="Fish" style={{ width: "100px" }} />,
    },
    {
      title: "Trạng thái kiểm tra sức khỏe",
      key: "isHealthChecked",
      render: (value) => (
        <span style={{ color: value.isHealthChecked ? "green" : "red" }}>
          {value.isHealthChecked ? "Đã kiểm tra" : "Chưa kiểm tra"}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id, value) => (
        <div>
          <Button
            type="default"
            onClick={() => {
              setSelectedFish(value);
              setIsHealthModalVisible(true);
              form.setFieldsValue({
                healthStatus: "",
                healthStatusDescription: "",
              });
            }}
          >
            Kiểm tra sức khỏe
          </Button>

          <Button type="default" onClick={() => viewHealthByFishProfile(value)}>
            Xem thông tin sức khỏe
          </Button>
        </div>
      ),
    },
  ];

  const hideFishProfile = () => {
    setSelectedOrderId(null);
    setFishProfile([]);
  };

  return (
    <div>
      <Table dataSource={viewHandOver} columns={columns} />

      {selectedOrderId && (
        <div>
          <h2>Danh sách cá cho Order Code: {selectedOrderId}</h2>
          <Button type="default" onClick={hideFishProfile}>
            Ẩn
          </Button>
          <Table dataSource={fishProfile} columns={fishColumns} />
        </div>
      )}

      <Modal
        title="Kiểm tra sức khỏe cá"
        open={isHealthModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsHealthModalVisible(false)}
      >
        <Form form={form} labelCol={{ span: 24 }} onFinish={handleHealthSubmit}>
          <Form.Item
            label="Trạng thái sức khỏe"
            name="healthStatus"
            rules={[
              { required: true, message: "Vui lòng chọn trạng thái sức khỏe!" },
            ]}
          >
            <Select placeholder="Chọn trạng thái sức khỏe">
              <Select.Option value="HEALTHY">HEALTHY</Select.Option>
              <Select.Option value="ILLNESS">ILLNESS</Select.Option>
              <Select.Option value="WEAKENED">WEAKENED</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Mô tả tình trạng sức khỏe"
            name="healthStatusDescription"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item label="Cân nặng">
            <Input value={selectedFish?.weight || 0} readOnly />
          </Form.Item>
          <Form.Item label="Giới tính">
            <Input value={selectedFish?.sex || ""} readOnly />
          </Form.Item>
          <Form.Item label="Loại">
            <Input value={selectedFish?.species || ""} readOnly />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Thông Tin Chi Tiết Cá"
        open={isViewFishModalVisible}
        onCancel={() => setIsViewFishModalVisible(false)}
        footer={null}
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Tên Cá">
            {selectedFish?.name || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Tình Trạng Sức Khỏe">
            {selectedFish?.healthStatus || "Chưa kiểm tra"}
          </Descriptions.Item>
          <Descriptions.Item label="Mô Tả Tình Trạng">
            {selectedFish?.healthStatusDescription || "Chưa có thông tin"}
          </Descriptions.Item>
          <Descriptions.Item label="Cân Nặng (kg)">
            {selectedFish?.weight || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Loài Cá">
            {selectedFish?.species || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Màu Sắc">
            {selectedFish?.color || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Nguồn Gốc">
            {selectedFish?.origin || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Giới Tính">
            {selectedFish?.sex || "N/A"}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  );
};

export default CheckHealth;
