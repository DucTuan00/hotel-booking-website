import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Button, Card, Spin } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { COLORS, TYPOGRAPHY } from '@/config/constants';
import userService from '@/services/users/userService';
import { User, UpdateUserInput, UpdatePasswordInput } from '@/types/user';
import Notification from '@/components/Notification';

const UserProfile: React.FC = () => {
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

            const response = await userService.updateUserProfile(updateData);
            
            setCurrentUser(response.user);
            setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
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
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div 
            className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
            style={{ 
                backgroundColor: COLORS.gray[50],
            }}
        >
            <div className="max-w-3xl mx-auto">
                {/* Page Title */}
                <div className="mb-8">
                    <h1
                        className="text-3xl md:text-4xl font-bold text-center mb-2"
                        style={{
                            fontFamily: TYPOGRAPHY.fontFamily.primary,
                            color: COLORS.primary,
                        }}
                    >
                        Hồ Sơ Của Tôi
                    </h1>
                    <p
                        className="text-center text-base"
                        style={{
                            fontFamily: TYPOGRAPHY.fontFamily.secondary,
                            color: COLORS.gray[600],
                        }}
                    >
                        Quản lý thông tin cá nhân của bạn
                    </p>
                </div>

                {/* Profile Information Card */}
                <Card
                    className="mb-6 shadow-lg"
                    style={{
                        borderRadius: '12px',
                        border: `1px solid ${COLORS.gray[200]}`,
                    }}
                >
                    <h2
                        className="text-xl font-semibold mb-6"
                        style={{
                            fontFamily: TYPOGRAPHY.fontFamily.secondary,
                            color: COLORS.gray[800],
                        }}
                    >
                        Thông tin cá nhân
                    </h2>

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
                                prefix={<UserOutlined style={{ color: COLORS.gray[400] }} />}
                                placeholder="Nhập tên của bạn"
                                size="large"
                                disabled={isGoogleUser}
                                style={{
                                    fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                    backgroundColor: isGoogleUser ? COLORS.gray[100] : 'white',
                                }}
                            />
                        </Form.Item>

                        {/* Email Field - Always read-only */}
                        <Form.Item
                            label="Email"
                            name="email"
                        >
                            <Input
                                prefix={<MailOutlined style={{ color: COLORS.gray[400] }} />}
                                placeholder="Email"
                                size="large"
                                disabled
                                style={{
                                    fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                    backgroundColor: COLORS.gray[100],
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
                                prefix={<PhoneOutlined style={{ color: COLORS.gray[400] }} />}
                                placeholder="Nhập số điện thoại"
                                size="large"
                                style={{
                                    fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                }}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={saving}
                                block
                                style={{
                                    backgroundColor: COLORS.primary,
                                    borderColor: COLORS.primary,
                                    fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                    fontWeight: TYPOGRAPHY.fontWeight.semibold,
                                    height: '48px',
                                }}
                            >
                                Lưu thay đổi
                            </Button>
                        </Form.Item>
                    </Form>

                    {isGoogleUser && (
                        <div
                            className="mt-4 p-4 rounded-lg"
                            style={{
                                backgroundColor: COLORS.gray[50],
                                border: `1px solid ${COLORS.gray[200]}`,
                            }}
                        >
                            <p
                                className="text-sm"
                                style={{
                                    fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                    color: COLORS.gray[600],
                                }}
                            >
                                Bạn đang đăng nhập bằng Google. Tên và email được quản lý bởi Google và không thể thay đổi.
                            </p>
                        </div>
                    )}
                </Card>

                {/* Change Password Card - Only for normal users */}
                {!isGoogleUser && (
                    <Card
                        className="shadow-lg"
                        style={{
                            borderRadius: '12px',
                            border: `1px solid ${COLORS.gray[200]}`,
                        }}
                    >
                        <h2
                            className="text-xl font-semibold mb-6"
                            style={{
                                fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                color: COLORS.gray[800],
                            }}
                        >
                            Đổi mật khẩu
                        </h2>

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
                                    prefix={<LockOutlined style={{ color: COLORS.gray[400] }} />}
                                    placeholder="Nhập mật khẩu cũ"
                                    size="large"
                                    style={{
                                        fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                    }}
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
                                    prefix={<LockOutlined style={{ color: COLORS.gray[400] }} />}
                                    placeholder="Nhập mật khẩu mới"
                                    size="large"
                                    style={{
                                        fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                    }}
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
                                    prefix={<LockOutlined style={{ color: COLORS.gray[400] }} />}
                                    placeholder="Nhập lại mật khẩu mới"
                                    size="large"
                                    style={{
                                        fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                    }}
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    loading={saving}
                                    block
                                    style={{
                                        backgroundColor: COLORS.secondary,
                                        borderColor: COLORS.secondary,
                                        fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                        fontWeight: TYPOGRAPHY.fontWeight.semibold,
                                        height: '48px',
                                    }}
                                >
                                    Đổi mật khẩu
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                )}
            </div>

            {/* Notification */}
            <Notification message={message} onClose={() => setMessage(null)} />
        </div>
    );
};

export default UserProfile;
