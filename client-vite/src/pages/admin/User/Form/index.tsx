import React, { useEffect } from 'react';
import { Form, Input, Button, Select, Modal } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons';

const { Option } = Select;

export interface UserFormValues {
    name: string;
    email: string;
    phone: string;
    role: 'user' | 'admin';
    password?: string;
}

export interface UserFormProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: UserFormValues) => void;
    initialValues?: Partial<UserFormValues>;
    loading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ visible, onCancel, onSubmit, initialValues, loading }) => {
    const [form] = Form.useForm();
    const isEditing = !!initialValues;

    useEffect(() => {
        if (visible) {
            if (initialValues) {
                form.setFieldsValue({
                    name: initialValues.name,
                    email: initialValues.email,
                    phone: initialValues.phone,
                    role: initialValues.role || 'user',
                });
            } else {
                form.resetFields();
            }
        }
    }, [visible, initialValues, form]);

    const handleSubmit = async (values: UserFormValues) => {
        onSubmit(values);
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title={isEditing ? 'Sửa người dùng' : 'Thêm mới người dùng'}
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Tên người dùng"
                    name="name"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên người dùng!' },
                        { min: 2, message: 'Tên phải có ít nhất 2 ký tự!' }
                    ]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Nhập tên người dùng"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' }
                    ]}
                >
                    <Input
                        prefix={<MailOutlined />}
                        placeholder="Nhập email"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                        { required: true, message: 'Vui lòng nhập số điện thoại!' },
                        { pattern: /^[0-9+\-\s]+$/, message: 'Số điện thoại không hợp lệ!' }
                    ]}
                >
                    <Input
                        prefix={<PhoneOutlined />}
                        placeholder="Nhập số điện thoại"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    label="Vai trò"
                    name="role"
                    rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                >
                    <Select 
                        placeholder="Chọn vai trò" 
                        size="large"
                    >
                        <Option value="admin">Admin</Option>
                        <Option value="user">User</Option>
                    </Select>
                </Form.Item>

                {!isEditing && (
                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu!' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Nhập mật khẩu"
                            size="large"
                        />
                    </Form.Item>
                )}

                <Form.Item className="mb-0 text-right">
                    <Button 
                        onClick={handleCancel} 
                        className="mr-2"
                        disabled={loading}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        {isEditing ? 'Lưu' : 'Thêm'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UserForm;