import React, { useEffect, useState } from 'react';
import { Layout, Card, Typography } from 'antd';
import { List } from 'antd';
import { Content } from 'antd/es/layout/layout';
import api from '../../../config/axios';
import { toast } from 'react-toastify';
import "./index.scss";
//import HealthService from '../form-page/healthService';
//import { CardTitle } from 'react-bootstrap';

const { Title } = Typography;

const CustomerOrder = () => {

    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [errorOrders, setErrorOrders] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    //const [invoiceDetails, setInvoiceDetails] = useState(null);


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

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    }

    // const fetchInvoiceDetails = async (invoiceId) => {
    //   try {
    //     const response = await api.get(`/healthcare-delivery-histories/view-by-invoice/${invoiceId}`);
    //     if (response.data.code === 200) {
    //       setInvoiceDetails(response.data.result);
    //     } else {
    //       message.error(response.data.message);
    //     }
    //   } catch (error) {
    //     message.error("Đã xảy ra lỗi khi lấy thông tin hóa đơn!");
    //     console.error("Error", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };


    // const onFinish = () => {
    //     setLoading(true);
    //     setLoading(false);
    // };


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
                    <Card title="Danh sách đơn hàng" style={{ width: '100%', maxWidth: 600, borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
                        {loadingOrders ? (
                            <div>Loading orders...</div>
                        ) : errorOrders ? (
                            <div>{errorOrders}</div>
                        ) : (
                            <List
                                itemLayout="horizontal"
                                dataSource={orders}
                                renderItem={order => (
                                    <List.Item onClick={() => handleOrderClick(order)}>
                                        <List.Item.Meta
                                            title={`Đơn hàng: ${order.orderCode}`}
                                            description={`Tổng tiền: ${order.totalAmount} VNĐ`}
                                        />
                                    </List.Item>
                                )}
                            />
                        )
                        }
                        {selectedOrder && (
                            <Card style={{ marginTop: 30 }} className="order-details">
                                <Title level={3}>Thông tin chi tiết đơn hàng</Title>
                                <div className="order-info">
                                    <span className="order-info__label">ID :</span>
                                    <span className="order-info__value">{selectedOrder.id}</span>
                                </div>
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
                            </Card>
                        )}
                    </Card>

                </Content>
            </Layout>
        </Layout>
    );
};

export default CustomerOrder;
