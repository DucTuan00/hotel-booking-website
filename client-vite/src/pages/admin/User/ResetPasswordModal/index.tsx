import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import userService from '@/services/users/userService';

export interface ResetPasswordModalProps {
    visible: boolean;
    userId: string;
    userName: string;
    onCancel: () => void;
    onSuccess: () => void;
    onError: (message: string) => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
    visible,
    userId,
    userName,
    onCancel,
    onSuccess,
    onError,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (values: { newPassword: string }) => {
        setLoading(true);
        try {
            await userService.resetUserPassword(userId, { newPassword: values.newPassword });
            form.resetFields();
            onSuccess();
        } catch (error: any) {
            console.error('Error resetting password:', error);
            const errorMsg = error.response?.data?.message || 'Đặt lại mật khẩu thất bại.';
            onError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title={
                <span style={{ fontFamily: 'inherit' }}>
                    Đặt lại mật khẩu
                </span>
            }
            open={visible}
            onCancel={handleCancel}
            footer={null}
            destroyOnClose
        >
            <p style={{ marginBottom: 16 }}>
                Đặt lại mật khẩu cho: <strong>{userName}</strong>
            </p>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Mật khẩu mới"
                    name="newPassword"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Nhập mật khẩu mới"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    label="Xác nhận mật khẩu mới"
                    name="confirmPassword"
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Nhập lại mật khẩu mới"
                        size="large"
                    />
                </Form.Item>

                <Form.Item className="mb-0 text-right">
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <Button onClick={handleCancel} disabled={loading}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Đặt lại mật khẩu
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ResetPasswordModal;
