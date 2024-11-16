import React, { useState, useEffect } from "react";
import { Button, Input, Form, Select, Row, Col, Card, Table } from "antd";
import { toast } from "react-toastify";
import api from "../../../../config/axios";

const { TextArea } = Input;

const CheckHealth = () => {
  const [orders, setOrders] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [healthData, setHealthData] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchOrders();
    fetchPackages();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/order/view-order-available");
      setOrders(response.data.result);
    } catch (error) {
      toast.error(error.message || "Lỗi khi tải đơn hàng!");
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await api.get("/package/view-all");
      setPackages(response.data.result);
    } catch (error) {
      toast.error(error.message || "Lỗi khi tải gói hàng!");
    }
  };

  const fetchHealthDataByOrderDetailId = async (orderDetailId) => {
    try {
      const response = await api.get(
        `/checking-koi-health/view-by-order-detail-id/${orderDetailId}`
      );
      console.log(response.data.result); // Kiểm tra dữ liệu trả về
      setHealthData(response.data.result);
    } catch (error) {
      toast.error(error.message || "Lỗi khi tải dữ liệu sức khỏe!");
    }
  };

  const handleSelectOrder = (orderId) => {
    const selected = orders.find((order) => order.id === orderId);
    setSelectedOrder(selected);
    form.setFieldsValue({
      orderDetailId: selected.id,
      packageId: selected.packageId,
    });
    fetchHealthDataByOrderDetailId(selected.id);
  };

  const handleCreateCheckHealth = async (values) => {
    try {
      const response = await api.post("/checking-koi-health/create", values);
      if (response.data.code === 200) {
        toast.success(response.data.message);
        fetchHealthDataByOrderDetailId(values.orderDetailId);
      } else {
        throw new Error(response.data.message || "Lỗi khi tạo kiểm tra!");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteCheckHealth = async (id) => {
    try {
      const response = await api.put(`/checking-koi-health/delete/${id}`);
      if (response.data.code === 200) {
        toast.success(response.data.message);
        fetchHealthDataByOrderDetailId(selectedOrder.id);
      } else {
        throw new Error(response.data.message || "Lỗi khi xóa!");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tình Trạng Sức Khỏe",
      dataIndex: "healthStatus",
      key: "healthStatus",
    },
    {
      title: "Mô Tả Tình Trạng Sức Khỏe",
      dataIndex: "healthStatusDescription",
      key: "healthStatusDescription",
    },
    {
      title: "Cân Nặng (kg)",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "Màu Sắc",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Tuổi",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Hành Động",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => form.setFieldsValue(record)}
            style={{
              marginRight: "8px",
              backgroundColor: "#3498db",
              borderColor: "#3498db",
            }}
          >
            Cập Nhật
          </Button>
          <Button
            type="danger"
            onClick={() => handleDeleteCheckHealth(record.id)}
            style={{
              backgroundColor: "#e74c3c",
              borderColor: "#e74c3c",
            }}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "30px", backgroundColor: "#f9fafb" }}>
      <h1
        style={{ textAlign: "center", color: "#34495e", marginBottom: "30px" }}
      >
        Kiểm Tra Sức Khỏe Koi
      </h1>

      <Form
        layout="vertical"
        style={{ marginBottom: "25px", maxWidth: "600px", margin: "0 auto" }}
      >
        <Form.Item label="Chọn Đơn Hàng">
          <Select
            onChange={handleSelectOrder}
            placeholder="Chọn một đơn hàng"
            style={{ width: "100%", borderRadius: "5px" }}
          >
            {orders.map((order) => (
              <Select.Option key={order.id} value={order.id}>
                {`Đơn hàng #${order.id}`}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>

      {selectedOrder && (
        <Card
          title="Thông Tin Kiểm Tra Sức Khỏe"
          style={{
            marginBottom: "30px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#ffffff",
            padding: "20px",
          }}
        >
          <Form
            form={form}
            onFinish={handleCreateCheckHealth}
            layout="vertical"
          >
            <Form.Item name="orderDetailId" hidden>
              <Input type="number" value={selectedOrder.id} disabled />
            </Form.Item>

            <Form.Item
              name="packageId"
              label="Chọn Gói"
              rules={[{ required: true }]}
            >
              <Select placeholder="Chọn gói" style={{ borderRadius: "5px" }}>
                {packages.map((pkg) => (
                  <Select.Option key={pkg.id} value={pkg.id}>
                    {`${pkg.packageNo} - ${pkg.packageDescription}`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="healthStatus"
              label="Tình Trạng Sức Khỏe"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Chọn tình trạng sức khỏe"
                style={{ borderRadius: "5px" }}
              >
                <Select.Option value="HEALTHY">HEALTHY</Select.Option>
                <Select.Option value="ILLNESS">ILLNESS</Select.Option>
                <Select.Option value="WEAKNESS">WEAKNESS</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="healthStatusDescription"
              label="Mô Tả Tình Trạng Sức Khỏe"
              rules={[{ required: true }]}
            >
              <TextArea rows={4} style={{ borderRadius: "5px" }} />
            </Form.Item>

            <Row gutter={20}>
              <Col span={8}>
                <Form.Item
                  name="weight"
                  label="Cân Nặng"
                  rules={[{ required: true }]}
                >
                  <Input type="number" style={{ borderRadius: "5px" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="type"
                  label="Loại"
                  rules={[{ required: true }]}
                >
                  <Input style={{ borderRadius: "5px" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="color"
                  label="Màu Sắc"
                  rules={[{ required: true }]}
                >
                  <Input style={{ borderRadius: "5px" }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="age" label="Tuổi" rules={[{ required: true }]}>
              <Input type="number" style={{ borderRadius: "5px" }} />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  width: "100%",
                  backgroundColor: "#1abc9c",
                  borderColor: "#1abc9c",
                  borderRadius: "5px",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#16a085")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1abc9c")
                }
              >
                Tạo Kiểm Tra
              </Button>
            </Form.Item>
          </Form>

          {healthData.length > 0 && (
            <Table
              columns={columns}
              dataSource={healthData}
              rowKey="id"
              pagination={false}
              bordered
            />
          )}
        </Card>
      )}
    </div>
  );
};

export default CheckHealth;
