import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../../config/axios';
import { Card, Layout, Tabs, List, Modal, Typography, DatePicker, Row, Col } from 'antd';

const { Content } = Layout;
const { TabPane } = Tabs;
const { Title } = Typography;
const { RangePicker } = DatePicker;

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [setDateRange] = useState([null]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await api.get('/payos/view-by-user');
                if (response.data.code === 200) {
                    setTransactions(response.data.result);
                    setFilteredTransactions(response.data.result); // Ban đầu hiển thị tất cả
                } else {
                    toast.error(response.data.message);
                    setError(response.data.message);
                }
            } catch (error) {
                toast.error('Đã xảy ra lỗi khi lấy thông tin từ khách hàng!');
                setError('Đã xảy ra lỗi khi lấy thông tin từ khách hàng!');
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const handleTransactionClick = (transaction) => {
        setSelectedTransaction(transaction);
        setModalVisible(true);
    };

    const handleDateChange = (dates) => {
        setDateRange(dates);
        if (dates && dates[0] && dates[1]) {
            const [startDate, endDate] = dates;
            const filtered = transactions.filter((transaction) => {
                const transactionDate = new Date(transaction.date); // Giả sử `transaction.date` là chuỗi ngày
                return (
                    transactionDate >= new Date(startDate) &&
                    transactionDate <= new Date(endDate)
                );
            });
            setFilteredTransactions(filtered);
        } else {
            setFilteredTransactions(transactions); // Hiển thị tất cả nếu không chọn ngày
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

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
                    <Card title="Lịch Sử Giao Dịch" style={{ width: '100%', borderRadius: '10px' }}>
                        <Row style={{ marginBottom: 16 }}>
                            <Col span={16}>
                                <RangePicker onChange={handleDateChange} style={{ width: '100%' }} />
                            </Col>
                        </Row>
                        <Tabs>
                            <TabPane tab="Danh sách giao dịch" key="1">
                                <Title level={4}>Thông tin giao dịch</Title>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={filteredTransactions}
                                    renderItem={(transaction) => (
                                        <List.Item onClick={() => handleTransactionClick(transaction)}>
                                            <List.Item.Meta
                                                title={`Mã giao dịch: ${transaction.code}`}
                                                description={`Số tiền: ${transaction.amount} VNĐ - Trạng thái: ${transaction.status} - Ngày giao dịch: ${transaction.paymentDate}`}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </TabPane>
                        </Tabs>

                        <Modal
                            title="Chi tiết giao dịch"
                            visible={modalVisible}
                            onCancel={() => setModalVisible(false)}
                            footer={null}
                        >
                            {selectedTransaction ? (
                                <>
                                    <p>
                                        <strong>Mã giao dịch:</strong> {selectedTransaction.code}
                                    </p>
                                    <p>
                                        <strong>Số tiền:</strong> {selectedTransaction.amount} VNĐ
                                    </p>
                                    <p>
                                        <strong>Trạng thái:</strong> {selectedTransaction.status}
                                    </p>
                                    <p>
                                        <strong>Ngày giao dịch:</strong> {selectedTransaction.paymentDate}
                                    </p>
                                </>
                            ) : (
                                <p>Không có thông tin giao dịch.</p>
                            )}
                        </Modal>
                    </Card>
                </Content>
            </Layout>
        </Layout>
    );
};

export default TransactionHistory;
