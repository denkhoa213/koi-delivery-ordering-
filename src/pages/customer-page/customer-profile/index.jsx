import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Typography, Input, Button, Tabs, Form, Layout, Avatar, Upload } from 'antd';
import api from '../../../config/axios';
import { Content } from 'antd/es/layout/layout';
import { toast } from "react-toastify";
import { UploadOutlined } from '@ant-design/icons';
import "./index.scss";

const { Title } = Typography;
const { TabPane } = Tabs;

const CustomerProfile = () => {

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [form] = Form.useForm();
    const maxFileSize = 10000000;

    const fetchCustomerProfile = async () => {
        try {
            const response = await api.get('/customer/view-profile');
            if (response.data.code === 200
            ) {
                setCustomer(response.data.result);
            } else {
                toast.error(response.data.message);
                setError(response.data.message);
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi lấy thông tin từ khách hàng!!!");
            setError("Đã xảy ra lỗi khi lấy thông tin từ khách hàng!!!");
            console.error("Error", error);
        } finally {
            setLoading(false);
        }
    }

    const handleChangePassword = async () => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/; // Mật khẩu ít nhất 6 ký tự, bao gồm cả chữ và số.

        if (!passwordRegex.test(newPassword)) {
            toast.error("Mật khẩu mới phải có ít nhất 6 ký tự và bao gồm cả chữ và số!");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp!");
            return;
        }

        try {
            const response = await api.put('/auth/change-password', {
                oldPassword,
                newPassword,
                confirmPassword
            });

            if (response.status === 200) {
                toast.success("Mật khẩu đã được cập nhật thành công!");
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                toast.error(response.data.message || "Đã xảy ra lỗi!");
            }
        } catch (error) {
            // Xử lý lỗi từ server
            const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi phía server!";
            toast.error(errorMessage);
            console.error("Error:", error);
        }
    };


    const updateProfile = async (values) => {
        try {
            const response = await api.put('/customer/update-profile', values);
            if (response.status === 200) {
                toast.success("Cập nhật hồ sơ thành công!");
                fetchCustomerProfile();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật hồ sơ!";
            toast.error(errorMessage);
            console.error("Error:", error);
        }
    };

    const handleChangeAvatar = async (file) => {
        if (file.size > maxFileSize) {
            toast.error(`Dung lượng tệp phải nhỏ hơn ${maxFileSize / 1000000} MB!`);
            return false;
        }

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            // Hiển thị thông báo đang tải lên
            toast.info("Đang tải ảnh đại diện lên...");

            const response = await api.put('/customer/update-avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                // Cập nhật avatar trong state
                setCustomer((prevState) => ({
                    ...prevState,
                    avatar: response.data.result.avatarUrl, // Sử dụng URL avatar mới trả về từ server
                }));
                toast.success("Cập nhật ảnh đại diện thành công!");
            } else {
                toast.error(response.data.message || "Đã xảy ra lỗi khi cập nhật ảnh đại diện!");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi phía server khi cập nhật ảnh đại diện!";
            toast.error(errorMessage);
            console.error("Error updating avatar:", error);
        }
        return false; // Trả về false để Ant Design không tự upload
    };



    const onFinish = (values) => {
        setLoading(true);
        updateProfile(values);
        setLoading(false);
    };


    useEffect(() => {
        fetchCustomerProfile();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

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
                    <Card title="Hồ Sơ Của Tôi" style={{ width: '100%', maxWidth: 600, borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
                        <Tabs>
                            <TabPane tab="Thông tin cá nhân" key="1">
                                <Title level={4} className="personal-info__title">Thông tin chi tiết</Title>
                                <Row gutter={[16, 16]} className="personal-info">
                                    <Col span={16}>
                                        <Row gutter={[16, 16]}>
                                            <Col span={24} className="info-row">
                                                <strong>Tên:</strong> <span>{customer.name}</span>
                                            </Col>
                                            <Col span={24} className="info-row">
                                                <strong>Email:</strong> <span>{customer.email}</span>
                                            </Col>
                                            <Col span={24} className="info-row">
                                                <strong>Số điện thoại:</strong> <span>{customer.phone}</span>
                                            </Col>
                                            <Col span={24} className="info-row">
                                                <strong>Địa chỉ:</strong> <span>{customer.address}</span>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={8} className="avatar-container">
                                        <Avatar src={customer.avatar} size={128} />
                                        <div className="upload-button">
                                            <Upload
                                                accept="image/*"
                                                showUploadList={false}
                                                beforeUpload={handleChangeAvatar}
                                                style={{ display: 'inline-block' }}
                                            >
                                                <Button icon={<UploadOutlined />}>Thêm Ảnh</Button>
                                            </Upload>
                                        </div>
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
                                        <Input
                                            disabled={true}
                                            style={{ opacity: 0.8 }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Số điện thoại"
                                        name="phone"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập số điện thoại của bạn!' },
                                            {
                                                pattern: /^[0-9]{10}$/,
                                                message: 'Số điện thoại phải có 10 chữ số!'
                                            }
                                        ]}
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
                </Content>
            </Layout >
        </Layout >

    );
};

export default CustomerProfile;
