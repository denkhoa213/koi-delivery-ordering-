import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { toast } from "react-toastify"; // Import react-toastify for notifications
import "react-toastify/dist/ReactToastify.css"; // React-toastify styles
import api from "../../../../config/axios"; // Axios instance

function ViewFeedback() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch feedback data from API
    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const response = await api.get("/feedback/view-all");
            if (response.status === 200) {
                setFeedbacks(response.data.result);
            } else {
                toast.error("Failed to load feedbacks");
            }
        } catch (error) {
            toast.error("Error fetching feedback: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Load feedbacks on component mount
    useEffect(() => {
        fetchFeedbacks();
    }, []);

    // Define table columns
    const columns = [
        {
            title: "Mã đơn hàng",
            dataIndex: "orderId",
            key: "orderId",
        },
        {
            title: "Email khách hàng",
            dataIndex: "customerId",
            key: "customerId",
        },
        {
            title: "Mô tả phản hồi",
            dataIndex: "feedbackDescription",
            key: "feedbackDescription",
        },
        {
            title: "Đánh giá",
            dataIndex: "rating",
            key: "rating",
        },
    ];


    return (
        <div>
            <h1>Phản hồi</h1>
            <Table
                dataSource={feedbacks}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
}

export default ViewFeedback;
