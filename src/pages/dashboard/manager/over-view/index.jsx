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
      const response = await api.get("/dashboard/manager");
      setData(response.data);
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chartData = [
    {
      name: "Week",
      orderInWeek: data?.result?.orderInWeek,
      orderInMonth: data?.result?.orderInMonth,
    },
  ];

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f5f7fa",
        borderRadius: "10px",
      }}
    >
      <Row gutter={[16, 16]} justify="center">
        {[
          {
            title: "Total User",
            value: data?.result?.totalUser,
            color: "#3f8600",
          },
          {
            title: "Total Order",
            value: data?.result?.totalOrder,
            color: "#007bff",
          },
          {
            title: "Order In Week",
            value: data?.result?.orderInWeek,
            color: "#ff5722",
          },
          {
            title: "Order In Month",
            value: data?.result?.orderInMonth,
            color: "#6f42c1",
          },
        ].map((stat, index) => (
          <Col span={6} key={index}>
            <Card
              bordered={false}
              style={{
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
              }}
            >
              <Statistic
                title={
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {stat.title}
                  </span>
                }
                value={stat.value}
                valueStyle={{
                  color: stat.color,
                  fontSize: "24px",
                  fontWeight: "600",
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Profit statistics */}
      <Row gutter={[16, 16]} justify="center" style={{ marginTop: "20px" }}>
        {[
          {
            title: "Profit In Week",
            value: data?.result?.profitInWeek,
            color: "#20c997",
          },
          {
            title: "Profit In Month",
            value: data?.result?.profitInMonth,
            color: "#17a2b8",
          },
          {
            title: "Total Profit",
            value: data?.result?.totalProfit,
            color: "#ffc107",
          },
        ].map((stat, index) => (
          <Col span={6} key={index}>
            <Card
              bordered={false}
              style={{
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
              }}
            >
              <Statistic
                title={
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {stat.title}
                  </span>
                }
                value={stat.value}
                valueStyle={{
                  color: stat.color,
                  fontSize: "24px",
                  fontWeight: "600",
                }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Bar Chart for Orders */}
      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "10px",
        }}
      >
        <h3
          style={{
            textAlign: "center",
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Orders In Week vs Month
        </h3>
        <BarChart
          width={800}
          height={300}
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="orderInWeek" fill="#8884d8" barSize={30} />
          <Bar dataKey="orderInMonth" fill="#82ca9d" barSize={30} />
        </BarChart>
      </div>
    </div>
  );
}

export default OverViewTotal;
