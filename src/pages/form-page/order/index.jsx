import { Button, Form, Input, InputNumber, Select, Checkbox } from "antd";
import { Option } from "antd/es/mentions";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../config/axios";
import FormLayout from "../../../components/layout/layout-form";

function OrderForm() {
  const [isPlaneDelivery, setIsPlaneDelivery] = useState(false);
  const navigate = useNavigate();
  const [deliveryMethod, setDeliveryMethod] = useState([]);
  const [form] = Form.useForm();

  const fetchDelivery = async () => {
    try {
      const response = await api.get("/delivery-method/view-all");
      console.log(response.data.result); // Log dữ liệu trả về
      setDeliveryMethod(response.data.result);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDeliveryMethodChange = (value) => {
    setIsPlaneDelivery(value.toUpperCase() === "PLANE");
  };

  const handleSubmitOrder = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const dataToSubmit = {
        deliveryMethod: values.deliveryMethod,
        destination: values.destination,
        departure: values.departure,
        distance: values.distance,
        phone: values.phone,
        amount: values.amount,
        vat: values.vat,
        vatAmount: values.vatAmount,
        totalAmount: values.totalAmount,
        customsDeclaration: values.customsDeclaration ? "true" : "false",
      };

      const response = await api.post("order/create", dataToSubmit, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const orderId = response.data.result.id;
      localStorage.setItem("orderId", orderId);
      toast.success(response.data.message);
      if (values.customsDeclaration) {
        navigate(`/form-declaration/${orderId}`);
      } else {
        navigate(`/fish-profile/${orderId}`);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchDelivery();
  }, []);

  // Tính total amout theo khoản cách
  const distance = Form.useWatch("distance", form);
  const vat = Form.useWatch("vat", form);

  useEffect(() => {
    if (distance && vat >= 0) {
      const baseAmount = distance * 1000;
      const calculatedVatAmount = (baseAmount * vat) / 100;
      const calculatedTotalAmount = baseAmount + calculatedVatAmount;

      form.setFieldsValue({
        amount: baseAmount,
        vatAmount: calculatedVatAmount,
        totalAmount: calculatedTotalAmount,
      });
    }
  }, [distance, vat, form]);

  return (
    <FormLayout title="Order">
      <Form form={form} onFinish={handleSubmitOrder} layout="vertical">
        <Form.Item
          name="deliveryMethod"
          label="Delivery Method"
          rules={[
            {
              required: true,
              message: "Please select a delivery method!",
            },
          ]}
        >
          <Select
            placeholder="Select delivery method"
            onChange={handleDeliveryMethodChange}
          >
            {deliveryMethod.map((delivery) => (
              <Select.Option
                key={delivery.id}
                value={delivery.deliveryMethodName}
              >
                {delivery.deliveryMethodName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {isPlaneDelivery && (
          <Form.Item name="customsDeclaration" valuePropName="checked">
            <Checkbox>Yêu cầu khai báo hải quan</Checkbox>
          </Form.Item>
        )}

        <Form.Item
          label="Destination"
          name="destination"
          rules={[{ required: true, message: "Please enter the destination!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Departure"
          name="departure"
          rules={[{ required: true, message: "Please enter the departure!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Distance"
          name="distance"
          rules={[
            { required: true, message: "Please enter the distance!" },
            {
              type: "number",
              min: 0,
              message: "Distance must be a positive number!",
            },
          ]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[
            { required: true, message: "Please enter the phone number!" },
            {
              pattern: /^[0-9]{10}$/,
              message: "Phone number must be 10 digits!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true, message: "Please enter the amount!" }]}
        >
          <InputNumber min={0} step={0.01} disabled />
        </Form.Item>

        <Form.Item
          label="VAT (%)"
          name="vat"
          rules={[
            { required: true, message: "Please enter the VAT percentage!" },
            {
              type: "number",
              min: 0,
              max: 100,
              message: "VAT must be between 0 and 100!",
            },
          ]}
        >
          <InputNumber min={0} max={100} step={0.01} />
        </Form.Item>

        <Form.Item
          label="VAT Amount"
          name="vatAmount"
          rules={[{ required: true, message: "Please enter the VAT amount!" }]}
        >
          <InputNumber min={0} step={0.01} disabled />
        </Form.Item>

        <Form.Item
          label="Total Amount"
          name="totalAmount"
          rules={[
            { required: true, message: "Please enter the total amount!" },
          ]}
        >
          <InputNumber min={0} step={0.01} disabled />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Đặt Hàng
          </Button>
        </Form.Item>
      </Form>
    </FormLayout>
  );
}

export default OrderForm;
