import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { toast } from "react-toastify"; // Import react-toastify for notifications
import "react-toastify/dist/ReactToastify.css"; // React-toastify styles
import api from "../../../../config/axios"; // Axios instance

function ViewReport() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch feedback data from API
    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await api.get("/report/view-all");
            if (response.status === 200) {
                setReports(response.data.result);
            } else {
                toast.error("Failed to load reports");
            }
        } catch (error) {
            toast.error("Error fetching reports: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Load feedbacks on component mount
    useEffect(() => {
        fetchReports();
    }, []);

    // Define table columns
    const columns = [
        {
            title: "ID báo cáo",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "ID đơn hàng",
            dataIndex: "orderId",
            key: "orderId",
        },
        {
            title: "ID khách hàng",
            dataIndex: "userId",
            key: "userId",
        },
        {
            title: "Tiêu đề đánh giá",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Mô tả báo cáo",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Trà lời",
            dataIndex: "answer",
            key: "answer",
        }

    ];


    return (
        <div>
            <h1>Báo cáo</h1>
            <Table
                dataSource={reports}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
}

export default ViewReport;
