import React, { useState } from 'react';
import { Button, Form, Input, Steps, Card } from 'antd';
import { MailOutlined, SafetyOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import * as passwordResetService from '@/services/auth/passwordResetService';
import Notification from "@/components/Notification";
import { Message } from '@/types/message';

const { Step } = Steps;

const ForgotPassword: React.FC = () => {
    const [message, setMessage] = useState<Message | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    // Step 1: Send verification code
    const handleSendCode = async (values: { email: string }) => {
        setLoading(true);
        try {
            await passwordResetService.sendPasswordResetCode({ email: values.email });
            setEmail(values.email);
            setCurrentStep(1);
            setMessage({
                type: 'success',
                text: 'Mã xác thực đã được gửi đến email của bạn!',
            });
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Gửi mã xác thực thất bại',
            });
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify code and reset password
    const handleResetPassword = async (values: {
        code: string;
        newPassword: string;
        confirmPassword: string;
    }) => {
        if (values.newPassword !== values.confirmPassword) {
            setMessage({
                type: 'error',
                text: 'Mật khẩu không khớp',
            });
            return;
        }

        setLoading(true);
        try {
            await passwordResetService.resetPassword({
                email,
                code: values.code,
                newPassword: values.newPassword,
            });
            setMessage({
                type: 'success',
                text: 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới.',
            });
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Đặt lại mật khẩu thất bại',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Notification
                message={message}
                onClose={() => setMessage(null)}
            />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
                <Card className="w-full max-w-md shadow-2xl">
                    <div className="text-center mb-8">
                        <p className="text-3xl font-semibold !mb-2">Đặt lại mật khẩu</p>
                        <p className="text-gray-600">Làm theo các bước để khôi phục tài khoản</p>
                    </div>

                    <Steps current={currentStep} className="mb-8">
                        <Step title="Nhập Email" icon={<MailOutlined />} />
                        <Step title="Xác thực & Đặt lại" icon={<SafetyOutlined />} />
                    </Steps>

                    {currentStep === 0 && (
                        <Form form={form} onFinish={handleSendCode} layout="vertical">
                            <Form.Item
                                label="Địa chỉ Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email của bạn' },
                                    { type: 'email', message: 'Vui lòng nhập email hợp lệ' },
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined className="text-gray-400" />}
                                    placeholder="email@example.com"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    size="large"
                                    block
                                    style={{
                                        backgroundColor: '#8B1A1A',
                                        borderColor: '#8B1A1A',
                                    }}
                                >
                                    Gửi mã xác thực
                                </Button>
                            </Form.Item>

                            <div className="text-center">
                                <Button type="link" onClick={() => navigate('/login')}>
                                    Quay lại đăng nhập
                                </Button>
                            </div>
                        </Form>
                    )}

                    {currentStep === 1 && (
                        <Form form={form} onFinish={handleResetPassword} layout="vertical">
                            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
                                <p className="text-sm text-blue-800">
                                    <strong>Email:</strong> {email}
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                    Mã xác thực 6 chữ số đã được gửi đến email của bạn. Vui lòng kiểm tra
                                    hộp thư và nhập mã bên dưới.
                                </p>
                            </div>

                            <Form.Item
                                label="Mã xác thực"
                                name="code"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mã xác thực' },
                                    { len: 6, message: 'Mã phải có 6 chữ số' },
                                    { pattern: /^\d+$/, message: 'Mã chỉ được chứa số' },
                                ]}
                            >
                                <Input
                                    prefix={<SafetyOutlined className="text-gray-400" />}
                                    placeholder="Nhập mã 6 chữ số"
                                    size="large"
                                    maxLength={6}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Mật khẩu mới"
                                name="newPassword"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="text-gray-400" />}
                                    placeholder="Nhập mật khẩu mới"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Xác nhận mật khẩu"
                                name="confirmPassword"
                                rules={[
                                    { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu không khớp'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="text-gray-400" />}
                                    placeholder="Xác nhận mật khẩu mới"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    size="large"
                                    block
                                    style={{
                                        backgroundColor: '#8B1A1A',
                                        borderColor: '#8B1A1A',
                                    }}
                                >
                                    Đặt lại mật khẩu
                                </Button>
                            </Form.Item>

                            <div className="text-center">
                                <Button
                                    type="link"
                                    onClick={() => {
                                        setCurrentStep(0);
                                        form.resetFields();
                                    }}
                                >
                                    Gửi lại mã
                                </Button>
                                <span className="mx-2 text-gray-400">|</span>
                                <Button type="link" onClick={() => navigate('/login')}>
                                    Quay lại đăng nhập
                                </Button>
                            </div>
                        </Form>
                    )}
                </Card>
            </div>
        </>
    );
};

export default ForgotPassword;
