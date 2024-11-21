import React, { useEffect, useState } from 'react';
import { Layout, Card, Typography, Tabs, Button, Modal, Input, Rate, Table } from 'antd';
import { List } from 'antd';
import { Content } from 'antd/es/layout/layout';
import api from '../../../config/axios';
import { toast } from 'react-toastify';
import "./index.scss";
import { TabPane } from 'react-bootstrap';

const { Title } = Typography;

const CustomerOrder = () => {

    const [orders, setOrders] = useState([]);
    const [setLoadingOrders] = useState(true);
    const [setErrorOrders] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [fishProfiles, setFishProfiles] = useState([]);

    const [reportModalVisible, setReportModalVisible] = useState(false);
    const [reportTitle, setReportTitle] = useState("");
    const [reportDescription, setReportDescription] = useState("");

    //Lọc đơn hàng
    const completedOrders = orders.filter(order => order.status === 'COMPLETED');
    const availableOrders = orders.filter(order => order.status === 'AVAILABLE');
    const inprogressOrders = orders.filter(order => order.status === 'IN_PROGRESS');

    const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
    const [feedback, setFeedback] = useState({
        feedbackDescription: "",
        rating: 0,
    });

    const fetchCustomerOrders = async () => {
        try {
            const response = await api.get('/order/view-by-customer');
            if (response.data.code === 200) {
                setOrders(response.data.result);
            } else {
                toast.error(response.data.message);
                setErrorOrders(response.data.message);
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi lấy danh sách đơn hàng!");
            setErrorOrders("Đã xảy ra lỗi khi lấy danh sách đơn hàng!");
            console.error("Error", error);
        } finally {
            setLoadingOrders(false);
        }
    }

    // Hiển thị modal phản hồi
    const showFeedbackModal = (order) => {
        setFeedbackModalVisible(true);
        setSelectedOrder(order);
    };

    // Đóng modal phản hồi
    const closeFeedbackModal = () => {
        setFeedbackModalVisible(false);
        setFeedback({
            rating: 0,
            feedbackDescription: "",
        });
    };

    const submitFeedback = async () => {
        if (!feedback.feedbackDescription || feedback.rating === 0) {
            toast.warning("Vui lòng nhập đủ thông tin phản hồi!");
            return;
        }

        try {
            const response = await api.post(`/feedback/create/${selectedOrder.id}`, feedback);
            if (response.data.code === 200) {
                toast.success("Phản hồi đã được gửi thành công!");
                closeFeedbackModal();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi gửi phản hồi!");
            console.error("Error", error);
        }
    };

    const submitReport = async () => {
        if (!reportTitle || !reportDescription) {
            toast.warning("Vui lòng nhập mô tả báo cáo!");
            return;
        }
        try {
            const response = await api.post(`/report/create/${selectedOrder.id}`, { title: reportTitle, description: reportDescription });
            if (response.data.code === 200) {
                toast.success("Báo cáo đã được gửi thành công!");
                closeReportModal();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi gửi báo cáo!");
            console.error("Error", error);
        }
    };

    const showReportModal = (order) => {
        setReportModalVisible(true);
        setSelectedOrder(order);
    };

    const closeReportModal = () => {
        setReportModalVisible(false);
        setReportTitle("");
        setReportDescription("");
    };

    const handleOrderClick = async (order) => {
        setSelectedOrder(order);
        try {
            const response = await api.get(`/fish-profile/view-by-order/${order.id}`);
            if (response.data.code === 200) {
                setFishProfiles(response.data.result);
            } else {
                toast.error(response.data.message);
                setFishProfiles([]); // Reset fish profiles if there's an error
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi lấy thông tin Fish Profiles!");
            console.error("Error", error);
            setFishProfiles([]); // Reset fish profiles if there's an error
        }
    }


    useEffect(() => {
        fetchCustomerOrders();
    }, []);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Layout style={{ padding: '0 24px 24px' }}>
                <Content
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                        background: '#fff',
                    }}
                >

                    <Card title="Danh sách đơn hàng" style={{ width: '790px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
                        <Tabs
                            onChange={() => setSelectedOrder(null)}
                        >
                            <TabPane tab="Danh sách đơn hàng đang chờ" key="1">
                                <Title level={4} className="order-wait">Thông tin chi tiết</Title>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={availableOrders}
                                    renderItem={order => (
                                        <List.Item onClick={() => handleOrderClick(order)}>
                                            <List.Item.Meta
                                                title={`Đơn hàng: ${order.orderCode}`}
                                                description={`Tổng tiền: ${order.totalAmount} VNĐ - Trạng thái thanh toán: ${order.paymentStatus}`}
                                            />
                                            <Button
                                                type="danger"
                                                onClick={() => showReportModal(order)}
                                                style={{ marginLeft: 8 }}
                                            >
                                                Báo cáo
                                            </Button>
                                        </List.Item>
                                    )}
                                />
                            </TabPane>
                            <TabPane tab="Danh sách đơn hàng đang giao" key="2">
                                <Title level={4} className="order-in-progress">Thông tin chi tiết</Title>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={inprogressOrders}
                                    renderItem={order => (
                                        <List.Item onClick={() => handleOrderClick(order)}>
                                            <List.Item.Meta
                                                title={`Đơn hàng: ${order.orderCode}`}
                                                description={`Tổng tiền: ${order.totalAmount} VNĐ - Trạng thái thanh toán: ${order.paymentStatus}`}
                                            />
                                            <Button
                                                type="danger"
                                                onClick={() => showReportModal(order)}
                                                style={{ marginLeft: 8 }}
                                            >
                                                Báo cáo
                                            </Button>
                                        </List.Item>
                                    )}
                                />
                            </TabPane>
                            <TabPane tab="Danh sách đơn hàng đã hoàn thành" key="3">
                                <Title level={4} className="order-completed">Thông tin chi tiết</Title>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={completedOrders}
                                    renderItem={order => (
                                        <List.Item onClick={() => handleOrderClick(order)}>
                                            <List.Item.Meta
                                                title={`Đơn hàng: ${order.orderCode}`}
                                                description={`Tổng tiền: ${order.totalAmount} VNĐ - Trạng thái thanh toán: ${order.paymentStatus}`}
                                            />
                                            <Button
                                                type="primary"
                                                onClick={() => showFeedbackModal(order)}
                                            >
                                                Gửi phản hồi
                                            </Button>
                                            <Button
                                                type="danger"
                                                onClick={() => showReportModal(order)}
                                                style={{ marginLeft: 8 }}
                                            >
                                                Báo cáo
                                            </Button>
                                        </List.Item>
                                    )}
                                />
                            </TabPane>
                        </Tabs>
                    </Card>

                    <Modal
                        title="Gửi phản hồi"
                        visible={feedbackModalVisible}
                        onCancel={closeFeedbackModal}
                        onOk={submitFeedback}
                        okText="Gửi"
                        cancelText="Hủy"
                    >
                        <Rate
                            style={{ marginTop: 16, fontSize: 28 }}
                            value={feedback.rating}
                            onChange={(value) => setFeedback({ ...feedback, rating: value })}
                        />

                        <Input.TextArea
                            placeholder="Nhập phản hồi của bạn..."
                            rows={4}
                            style={{ marginTop: 16 }}
                            value={feedback.feedbackDescription}
                            onChange={(e) => setFeedback({ ...feedback, feedbackDescription: e.target.value })}
                        />
                    </Modal>

                    <Modal
                        title="Báo cáo"
                        visible={reportModalVisible}
                        onCancel={closeReportModal}
                        onOk={submitReport}
                        okText="Gửi"
                        cancelText="Hủy"
                    >
                        <Input
                            placeholder="Nhập tiêu đề báo cáo của bạn..."
                            style={{ marginBottom: 16 }}
                            value={reportTitle}
                            onChange={(e) => setReportTitle(e.target.value)}
                        />
                        <Input.TextArea
                            placeholder="Nhập mô tả báo cáo của bạn..."
                            rows={4}
                            value={reportDescription}
                            onChange={(e) => setReportDescription(e.target.value)}
                        />
                    </Modal>

                    {selectedOrder && (
                        <Card
                            style={{ marginTop: 30 }}
                            className="order-details"
                            title="Thông tin chi tiết đơn hàng"
                            extra={
                                <Button
                                    type="text"
                                    onClick={() => setSelectedOrder(null)}
                                >
                                    Đóng
                                </Button>
                            }
                        >
                            <div className="order-info">
                                <span className="order-info__label">Tên đơn hàng :</span>
                                <span className="order-info__value">{selectedOrder.orderCode}</span>
                            </div>
                            <div className="order-info">
                                <span className="order-info__label">Phương thức vận chuyển :</span>
                                <span className="order-info__value">{selectedOrder.deliveryMethod}</span>
                            </div>
                            <div className="order-info">
                                <span className="order-info__label">Giá :</span>
                                <span className="order-info__value">{selectedOrder.totalAmount}</span>
                            </div>
                            <div className="order-info">
                                <span className="order-info__label">Điểm gửi :</span>
                                <span className="order-info__value">{selectedOrder.departure}</span>
                            </div>
                            <div className="order-info">
                                <span className="order-info__label">Điểm nhận :</span>
                                <span className="order-info__value">{selectedOrder.destination}</span>
                            </div>
                            <div className="order-info">
                                <span className="order-info__label">Ngày đặt hàng :</span>
                                <span className="order-info__value">{selectedOrder.createAt}</span>
                            </div>
                            <div className="order-info">
                                <span className="order-info__label">Trạng thái :</span>
                                <span className="order-info__value">{selectedOrder.status}</span>
                            </div>
                            <div style={{ marginTop: 30 }}>
                                <Title level={5}>Fish Profiles</Title>
                            </div>
                            <Table
                                dataSource={fishProfiles}
                                columns={[
                                    { title: 'Species', dataIndex: 'species', key: 'species' },
                                    { title: 'Name', dataIndex: 'name', key: 'name' },
                                    { title: 'Description', dataIndex: 'description', key: 'description' },
                                    { title: 'Sex', dataIndex: 'sex', key: 'sex' },
                                    { title: 'Size', dataIndex: 'size', key: 'size' },
                                    { title: 'Age', dataIndex: 'age', key: 'age' },
                                    { title: 'Origin', dataIndex: 'origin', key: 'origin' },
                                    { title: 'Weight', dataIndex: 'weight', key: 'weight' },
                                    { title: 'Color', dataIndex: 'color', key: 'color' },
                                    { title: 'Image', dataIndex: 'image', key: 'image', render: (text) => <img src={text} alt="fish" style={{ width: 50 }} /> },
                                ]}
                                rowKey="id"
                                pagination={false}
                            />

                        </Card>
                    )}

                </Content>
            </Layout>
        </Layout>
    );
};

export default CustomerOrder;
