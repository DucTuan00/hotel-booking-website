import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Button, Card, Spin, Space, Typography } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import userService from '@/services/users/userService';
import { User, UpdateUserInput, UpdatePasswordInput } from '@/types/user';
import Notification from '@/components/Notification';

const { Title, Text } = Typography;

const AdminProfile: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const navigate = useNavigate();

    const [profileForm] = Form.useForm();
    const [passwordForm] = Form.useForm();

    // Check if user is Google user
    const isGoogleUser = currentUser?.googleId != null;

    const fetchUserInfo = useCallback(async () => {
        try {
            setLoading(true);
            const user = await userService.getUserInfo();
            setCurrentUser(user);
            profileForm.setFieldsValue({
                name: user.name,
                email: user.email,
                phone: user.phone || '',
            });
        } catch {
            setMessage({ type: 'error', text: 'Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.' });
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } finally {
            setLoading(false);
        }
    }, [navigate, profileForm]);

    useEffect(() => {
        fetchUserInfo();
    }, [fetchUserInfo]);

    const handleUpdateProfile = async (values: UpdateUserInput) => {
        try {
            setSaving(true);

            // For Google users: only send phone
            // For normal users: send name and phone (email is readonly)
            const updateData: UpdateUserInput = isGoogleUser
                ? { phone: values.phone }
                : { name: values.name, phone: values.phone };

            await userService.updateUserProfile(updateData);

            setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });

            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error?.message || 'Có lỗi xảy ra khi cập nhật thông tin!'
            });
        } finally {
            setSaving(false);
        }
    };

    const handleUpdatePassword = async (values: UpdatePasswordInput) => {
        try {
            setSaving(true);

            await userService.updatePassword({
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
            });

            setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
            passwordForm.resetFields();
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error?.message || 'Có lỗi xảy ra khi đổi mật khẩu!'
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            {/* Page Title */}
            <div style={{ marginBottom: '24px' }}>
                <Title level={2} style={{ marginBottom: '8px' }}>
                    Thông Tin Tài Khoản
                </Title>
                <Text type="secondary">
                    Quản lý thông tin cá nhân của bạn
                </Text>
            </div>

            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Profile Information Card */}
                <Card
                    title="Thông tin cá nhân"
                    style={{ borderRadius: '8px' }}
                >
                    <Form
                        form={profileForm}
                        layout="vertical"
                        onFinish={handleUpdateProfile}
                    >
                        {/* Name Field - Read-only for Google users */}
                        <Form.Item
                            label="Tên"
                            name="name"
                            rules={[
                                { required: !isGoogleUser, message: 'Vui lòng nhập tên!' },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                                placeholder="Nhập tên của bạn"
                                size="large"
                                disabled={isGoogleUser}
                                style={{
                                    backgroundColor: isGoogleUser ? '#f5f5f5' : 'white',
                                }}
                            />
                        </Form.Item>

                        {/* Email Field - Always read-only */}
                        <Form.Item
                            label="Email"
                            name="email"
                        >
                            <Input
                                prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                                placeholder="Email"
                                size="large"
                                disabled
                                style={{
                                    backgroundColor: '#f5f5f5',
                                }}
                            />
                        </Form.Item>

                        {/* Phone Field - Editable for all users */}
                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[
                                { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' },
                            ]}
                        >
                            <Input
                                prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />}
                                placeholder="Nhập số điện thoại"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={saving}
                                style={{
                                    backgroundColor: '#D4902A',
                                    borderColor: '#D4902A',
                                    fontWeight: 500,
                                    height: '48px',
                                    paddingLeft: '32px',
                                    paddingRight: '32px',
                                }}
                            >
                                Lưu thay đổi
                            </Button>
                        </Form.Item>
                    </Form>

                    {isGoogleUser && (
                        <div
                            style={{
                                marginTop: '16px',
                                padding: '16px',
                                borderRadius: '8px',
                                backgroundColor: '#f5f5f5',
                                border: '1px solid #d9d9d9',
                            }}
                        >
                            <Text type="secondary">
                                Bạn đang đăng nhập bằng Google. Tên và email được quản lý bởi Google và không thể thay đổi.
                            </Text>
                        </div>
                    )}
                </Card>

                {/* Change Password Card - Only for normal users */}
                {!isGoogleUser && (
                    <Card
                        title="Đổi mật khẩu"
                        style={{ borderRadius: '8px' }}
                    >
                        <Form
                            form={passwordForm}
                            layout="vertical"
                            onFinish={handleUpdatePassword}
                        >
                            <Form.Item
                                label="Mật khẩu cũ"
                                name="oldPassword"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu cũ!' },
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                                    placeholder="Nhập mật khẩu cũ"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Mật khẩu mới"
                                name="newPassword"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                                    placeholder="Nhập mật khẩu mới"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Nhập lại mật khẩu mới"
                                name="confirmPassword"
                                dependencies={['newPassword']}
                                rules={[
                                    { required: true, message: 'Vui lòng nhập lại mật khẩu mới!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu không khớp!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                                    placeholder="Nhập lại mật khẩu mới"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    loading={saving}
                                    style={{
                                        backgroundColor: '#8B1A1A',
                                        borderColor: '#8B1A1A',
                                        fontWeight: 500,
                                        height: '48px',
                                        paddingLeft: '32px',
                                        paddingRight: '32px',
                                    }}
                                >
                                    Đổi mật khẩu
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                )}
            </Space>

            {/* Notification */}
            <Notification message={message} onClose={() => setMessage(null)} />
        </div>
    );
};

export default AdminProfile;
