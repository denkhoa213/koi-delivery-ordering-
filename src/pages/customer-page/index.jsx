import React, { useEffect, useState } from 'react';
import { Layout, Menu, Card, Col, Row, Typography, Input, Button, Tabs, message, Form } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import api from '../../config/axios';
import { List } from 'antd';
//import { CardTitle } from 'react-bootstrap';


const { Sider, Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

const CustomerPage = () => {
    const [selectedKey, setSelectedKey] = useState('1');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [errorOrders, setErrorOrders] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [form] = Form.useForm();

    const fetchCustomerProfile = async () => {
        try {
            const response = await api.get('/customer/get-profile');
            if (response.data.code === 200
            ) {
                setCustomer(response.data.result);
            } else {
                message.error(response.data.message);
                setError(response.data.message); //Cập nhật trạng thái lỗi
            }
        } catch (error) {
            message.error("Đã xảy ra lỗi khi lấy thông tin từ khách hàng!!!");
            setError("Đã xảy ra lỗi khi lấy thông tin từ khách hàng!!!"); // Cập nhật trạng thái lỗi
            console.error("Error", error);
        } finally {
            setLoading(false);
        }
    }

    const handleMenuClick = (key) => {
        setSelectedKey(key);
    };

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    }

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            message.error("Mật khẩu xác nhận không khớp!");
            return;
        }

        try {

            const response = await api.put('/auth/change-password', {
                oldPassword,
                newPassword,
                confirmPassword
            });


            // Thông báo thành công nếu API trả về status 200
            if (response.status === 200) {
                message.success("Mật khẩu đã được cập nhật thành công!");
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            // Hiển thị chi tiết lỗi nếu có
            const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi phía server!";
            message.error(errorMessage);
            console.error("Error:", error);
        }
    };

    const updateProfile = async (values) => {
        try {
            const response = await api.put('/customer/update-profile', values);
            if (response.status === 200) {
                message.success("Cập nhật hồ sơ thành công!");
                // Optionally, you can fetch the updated profile again
                fetchCustomerProfile();
            } else {
                message.error(response.data.message);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật hồ sơ!";
            message.error(errorMessage);
            console.error("Error:", error);
        }
    };

    const fetchCustomerOrders = async () => {
        try {
            const response = await api.get('/order/get-by-customer');
            if (response.data.code === 200) {
                setOrders(response.data.result);
            } else {
                message.error(response.data.message);
                setErrorOrders(response.data.message);
            }
        } catch (error) {
            message.error("Đã xảy ra lỗi khi lấy danh sách đơn hàng!");
            setErrorOrders("Đã xảy ra lỗi khi lấy danh sách đơn hàng!");
            console.error("Error", error);
        } finally {
            setLoadingOrders(false);
        }
    }

    const onFinish = (values) => {
        setLoading(true);
        updateProfile(values);
        setLoading(false);
    };


    useEffect(() => {
        fetchCustomerProfile();
        fetchCustomerOrders();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={200} style={{ background: '#fff' }}>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    style={{ height: '100%', borderRight: 0 }}
                >
                    <Menu.Item key="1" icon={<UserOutlined />} onClick={() => handleMenuClick('1')}>
                        Hồ sơ của tôi
                    </Menu.Item>
                    <Menu.Item key="2" icon={<img src="https://down-vn.img.susercontent.com/file/f0049e9df4e536bc3e7f140d071e9078" alt="Custom Icon" style={{ width: '20px', height: '20px' }} />} onClick={() => handleMenuClick('2')}>
                        Đơn đặt hàng
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout style={{ padding: '0 24px 24px' }}>
                <Content
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                        background: '#fff',
                    }}
                >
                    {selectedKey === '1' && customer && (
                        <Card title="Hồ Sơ Của Tôi" style={{ width: '100%', maxWidth: 600, borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
                            <Tabs defaultActiveKey="1">
                                <TabPane tab="Thông tin cá nhân" key="1">
                                    <Title level={4}>Thông tin chi tiết</Title>
                                    <Row gutter={[16, 16]}>
                                        <Col span={24}>
                                            <strong>Tên:</strong> <span style={{ fontSize: '16px', color: '#555' }}>{customer.name}</span>
                                        </Col>
                                        <Col span={24}>
                                            <strong>Email:</strong> <span style={{ fontSize: '16px', color: '#555' }}>{customer.email}</span>
                                        </Col>
                                        <Col span={24}>
                                            <strong>Số điện thoại:</strong> <span style={{ fontSize: '16px', color: '#555' }}>{customer.phone}</span>
                                        </Col>
                                        <Col span={24}>
                                            <strong>Địa chỉ:</strong> <span style={{ fontSize: '16px', color: '#555' }}>{customer.address}</span>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane tab="Thay đổi thông tin cá nhân" key="3">
                                    <Title level={4}>Cập nhật thông tin</Title>
                                    <Form form={form} layout="vertical" onFinish={onFinish} initialValues={customer}>
                                        <Form.Item
                                            label="Tên"
                                            name="name"
                                            rules={[{ required: true, message: 'Vui lòng nhập tên của bạn!' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            label="Email"
                                            name="email"
                                            rules={[{ required: true, message: 'Vui lòng nhập email của bạn!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            label="Số điện thoại"
                                            name="phone"
                                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại của bạn!' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            label="Địa chỉ"
                                            name="address"
                                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ của bạn!' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit" loading={loading}>
                                                Cập nhật
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </TabPane>
                                <TabPane tab="Đổi mật khẩu" key="2">
                                    <Row gutter={[16, 16]}>
                                        <Col span={24}>
                                            <Input.Password
                                                placeholder="Mật khẩu cũ"
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                            />
                                        </Col>
                                        <Col span={24}>
                                            <Input.Password
                                                placeholder="Mật khẩu mới"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                        </Col>
                                        <Col span={24}>
                                            <Input.Password
                                                placeholder="Xác nhận mật khẩu"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                        </Col>
                                        <Col span={24}>
                                            <Button type="primary" style={{ width: '100%' }} onClick={handleChangePassword}>
                                                Cập nhật mật khẩu
                                            </Button>
                                        </Col>
                                    </Row>
                                </TabPane>
                            </Tabs>
                        </Card>
                    )}
                    {selectedKey === '2' && (
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
                                                description={`Ngày đặt: ${new Date(order.orderDate).toLocaleDateString()} - Tổng tiền: ${order.totalAmount} VNĐ`}
                                            />
                                        </List.Item>
                                    )}
                                />
                            )
                            }
                            {selectedOrder && (
                                <Card style={{ marginTop: 30 }}>
                                    <Title level={3}>Thông tin chi tiết đơn hàng</Title>
                                    <p>ID: {selectedOrder.id}</p>
                                    <p>Tên đơn hàng: {selectedOrder.orderCode}</p>
                                    <p>Phương thức vận chuyển: {selectedOrder.deliveryMethod}</p>
                                    <p>Giá: {selectedOrder.totalAmount}</p>
                                    <p>Điểm gửi: {selectedOrder.departure}</p>
                                    <p>Điểm nhận: {selectedOrder.destination}</p>
                                    <p>Trạng thái: {selectedOrder.status}</p>
                                </Card>
                            )}
                        </Card>
                    )}
                </Content>
            </Layout>
        </Layout>
    );
};

export default CustomerPage;
