import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";
import React, { useEffect, useState } from "react";
import api from "../../../../config/axios";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

function OverViewTotal() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await api.get("/dashboard");
      setData(response.data);
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Prepare data for BarChart
  const chartData = [
    {
      name: "Week",
      orderInWeek: data?.orderInWeek,
      orderInMonth: data?.orderInMonth,
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[16, 16]} justify="center">
        {/* First Column */}
        <Col span={6}>
          <Card
            bordered={false}
            style={{ boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)" }}
          >
            <Statistic
              title="Total User"
              value={data?.totalUser}
              valueStyle={{
                color: "#3f8600",
                fontSize: "24px",
              }}
            />
          </Card>
        </Col>

        {/* Second Column */}
        <Col span={6}>
          <Card
            bordered={false}
            style={{ boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)" }}
          >
            <Statistic
              title="Total Order"
              value={data?.totalOrder}
              valueStyle={{
                color: "#3f8600",
                fontSize: "24px",
              }}
            />
          </Card>
        </Col>

        {/* Third Column */}
        <Col span={6}>
          <Card
            bordered={false}
            style={{ boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)" }}
          >
            <Statistic
              title="Order In Week"
              value={data?.orderInWeek}
              valueStyle={{
                color: "#3f8600",
                fontSize: "24px",
              }}
            />
          </Card>
        </Col>

        {/* Fourth Column */}
        <Col span={6}>
          <Card
            bordered={false}
            style={{ boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)" }}
          >
            <Statistic
              title="Order In Month"
              value={data?.orderInMonth}
              valueStyle={{
                color: "#3f8600",
                fontSize: "24px",
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Additional profit statistics */}
      <Row gutter={[16, 16]} justify="center" style={{ marginTop: "20px" }}>
        {/* Profit in Week */}
        <Col span={6}>
          <Card
            bordered={false}
            style={{ boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)" }}
          >
            <Statistic
              title="Profit In Week"
              value={data?.profitInWeek}
              valueStyle={{
                color: "#3f8600",
                fontSize: "24px",
              }}
            />
          </Card>
        </Col>

        {/* Profit in Month */}
        <Col span={6}>
          <Card
            bordered={false}
            style={{ boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)" }}
          >
            <Statistic
              title="Profit In Month"
              value={data?.profitInMonth}
              valueStyle={{
                color: "#3f8600",
                fontSize: "24px",
              }}
            />
          </Card>
        </Col>

        {/* Total Profit */}
        <Col span={6}>
          <Card
            bordered={false}
            style={{ boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)" }}
          >
            <Statistic
              title="Total Profit"
              value={data?.totalProfit}
              valueStyle={{
                color: "#3f8600",
                fontSize: "24px",
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Bar Chart for Orders */}
      <div style={{ marginTop: "40px", padding: "0 50px" }}>
        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
          Orders In Week vs Month
        </h3>
        <BarChart
          width={800}
          height={300}
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="orderInWeek" fill="#8884d8" />
          <Bar dataKey="orderInMonth" fill="#82ca9d" />
        </BarChart>
      </div>
    </div>
  );
}

export default OverViewTotal;
