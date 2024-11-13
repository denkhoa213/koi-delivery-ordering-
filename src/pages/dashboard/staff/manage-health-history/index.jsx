import React, { useEffect, useState } from "react";
import { List, Form, Input, Button, Select, Card } from "antd";
import { toast } from "react-toastify";
import api from "../../../../config/axios";

const { TextArea } = Input;
const { Option } = Select;

const HealthcareHistoryManager = () => {
  const [form] = Form.useForm();
  const [invoiceData, setInvoiceData] = useState([]);
  const [healthcareHistoryData, setHealthcareHistoryData] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedHealthcareHistory, setSelectedHealthcareHistory] =
    useState(null);

  // Fetch invoices
  const fetchInvoice = async () => {
    try {
      const response = await api.get("invoice/view-all");
      setInvoiceData(response.data.result);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // Fetch healthcare delivery histories
  const fetchHealthcareHistory = async () => {
    try {
      const response = await api.get("healthcare-delivery-histories/view-all");
      setHealthcareHistoryData(response.data.result);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // Handle invoice selection
  const handleInvoiceSelect = (invoice) => {
    setSelectedInvoice(invoice);

    // Check if there's an existing healthcare history for this invoice
    const existingHistory = healthcareHistoryData.find(
      (history) => history.invoiceId === invoice.id
    );
    setSelectedHealthcareHistory(existingHistory || null);

    // If there's an existing healthcare history, populate the form
    if (existingHistory) {
      form.setFieldsValue({
        route: existingHistory.route,
        healthDescription: existingHistory.healthDescription,
        eatingDescription: existingHistory.eatingDescription,
        deliveryStatus: existingHistory.deliveryStatus,
      });
    } else {
      form.resetFields(); // Reset form if no history exists
    }
  };

  // Handle form submission (create or update healthcare history)
  const handleSubmit = async (values) => {
    // Get the `handoverId` from localStorage
    const handoverId = localStorage.getItem("handoverDocumentId");
    if (!handoverId) {
      toast.error("Lỗi");
      return;
    }

    const healthcareHistoryData = {
      invoiceId: selectedInvoice.id,
      handoverDocumentId: handoverId,
      route: values.route,
      healthDescription: values.healthDescription,
      eatingDescription: values.eatingDescription,
      deliveryStatus: values.deliveryStatus,
    };

    try {
      setLoading(true);
      let response;

      if (selectedHealthcareHistory) {
        // If there's an existing healthcare history, update it
        response = await api.put(
          `/healthcare-delivery-histories/update/${selectedHealthcareHistory.id}`,
          healthcareHistoryData
        );
      } else {
        // If no history exists, create a new one
        response = await api.post(
          "/healthcare-delivery-histories/create",
          healthcareHistoryData
        );
      }

      if (response.data.code === 200 || response.data.code === 201) {
        toast.success(response.data.message);
        fetchHealthcareHistory(); // Fetch the updated list after submission
        form.resetFields();
        setSelectedInvoice(null);
        setSelectedHealthcareHistory(null); // Clear selected healthcare history
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete healthcare history
  const handleDelete = async () => {
    if (!selectedHealthcareHistory) {
      toast.error("No healthcare history to delete.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.put(
        `/healthcare-delivery-histories/delete/${selectedHealthcareHistory.id}`
      );

      if (response.data.code === 200) {
        toast.success("Lịch sử chăm sóc sức khỏe đã được xóa");
        fetchHealthcareHistory(); // Refresh the list after delete
        form.resetFields();
        setSelectedInvoice(null);
        setSelectedHealthcareHistory(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
    fetchHealthcareHistory(); // Fetch all healthcare delivery histories on page load
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Danh sách hóa đơn</h2>
      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={invoiceData}
        renderItem={(invoice) => (
          <List.Item>
            <Card
              title={`Invoice No: ${invoice.invoiceNo}`}
              onClick={() => handleInvoiceSelect(invoice)}
              style={{ cursor: "pointer" }}
            >
              Order ID: {invoice.orderId}
            </Card>
          </List.Item>
        )}
      />

      <h2 style={{ marginTop: "30px" }}>Danh sách lịch sử chăm sóc sức khỏe</h2>
      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={healthcareHistoryData}
        renderItem={(history) => (
          <List.Item>
            <Card
              title={`Hóa đơn ID: ${history.invoiceId}`}
              onClick={() => handleInvoiceSelect({ id: history.invoiceId })}
              style={{ cursor: "pointer" }}
            >
              <p>Route: {history.route}</p>
              <p>Status: {history.deliveryStatus}</p>
              <p>Health Description: {history.healthDescription}</p>
              <p>Eating Description: {history.eatingDescription}</p>
            </Card>
          </List.Item>
        )}
      />

      {selectedInvoice && (
        <div style={{ marginTop: "30px" }}>
          <h2>
            Theo dõi lịch sử chăm sóc sức khỏe cho Hóa đơn:{" "}
            {selectedInvoice.invoiceNo}
          </h2>
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            initialValues={{
              deliveryStatus: "PENDING",
            }}
          >
            <Form.Item
              label="Route"
              name="route"
              rules={[{ required: true, message: "Please enter the route!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Health Description"
              name="healthDescription"
              rules={[
                {
                  required: true,
                  message: "Please enter the health description!",
                },
              ]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item
              label="Eating Description"
              name="eatingDescription"
              rules={[
                {
                  required: true,
                  message: "Please enter the eating description!",
                },
              ]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item
              label="Delivery Status"
              name="deliveryStatus"
              rules={[
                {
                  required: true,
                  message: "Please select the delivery status!",
                },
              ]}
            >
              <Select>
                <Option value="PENDING">PENDING</Option>
                <Option value="ON_GOING">ON_GOING</Option>
                <Option value="DELIVERED">DELIVERED</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                {selectedHealthcareHistory ? "Cập nhật" : "Tạo mới"} lịch sử
                chăm sóc sức khỏe
              </Button>
            </Form.Item>
          </Form>

          {selectedHealthcareHistory && (
            <Button
              type="danger"
              block
              onClick={handleDelete}
              loading={loading}
            >
              Xóa lịch sử chăm sóc sức khỏe
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default HealthcareHistoryManager;
