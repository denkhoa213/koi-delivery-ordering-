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
                setError(response.data.message); //Cập nhật trạng thái lỗi
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi lấy thông tin từ khách hàng!!!");
            setError("Đã xảy ra lỗi khi lấy thông tin từ khách hàng!!!"); // Cập nhật trạng thái lỗi
            console.error("Error", error);
        } finally {
            setLoading(false);
        }
    }

    const handleChangePassword = async () => {
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


            // Thông báo thành công nếu API trả về status 200
            if (response.status === 200) {
                toast.success("Mật khẩu đã được cập nhật thành công!");
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            // Hiển thị chi tiết lỗi nếu có
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
                // Optionally, you can fetch the updated profile again
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
            toast.error(`File size must be smaller than ${maxFileSize / 1000000} MB!`);
            return false;
        }

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const response = await api.put('/customer/update-profile', formData);
            if (response.status === 200) {
                setCustomer((prevState) => ({
                    ...prevState,
                    avatar: response.data.avatarUrl,
                }));
                toast.success("Cập nhật avatar thành công!");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật avatar!";
            toast.error(errorMessage);
        }
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
                </Content>
            </Layout >
        </Layout >

    );
};

export default CustomerProfile;
