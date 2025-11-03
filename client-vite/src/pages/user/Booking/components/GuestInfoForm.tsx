import React from 'react';
import { Form, Input } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const GuestInfoForm: React.FC = () => {
    return (
        <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Thông tin khách hàng</h3>
            
            <Form.Item
                name="firstName"
                label="Họ"
                rules={[
                    { required: true, message: 'Vui lòng nhập họ!' },
                    { min: 2, message: 'Họ phải có ít nhất 2 ký tự!' }
                ]}
            >
                <Input 
                    size="large"
                    prefix={<UserOutlined />}
                    placeholder="Nhập họ"
                />
            </Form.Item>

            <Form.Item
                name="lastName"
                label="Tên"
                rules={[
                    { required: true, message: 'Vui lòng nhập tên!' },
                    { min: 2, message: 'Tên phải có ít nhất 2 ký tự!' }
                ]}
            >
                <Input 
                    size="large"
                    prefix={<UserOutlined />}
                    placeholder="Nhập tên"
                />
            </Form.Item>

            <Form.Item
                name="email"
                label="Email"
                rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                ]}
            >
                <Input 
                    size="large"
                    prefix={<MailOutlined />}
                    placeholder="example@email.com"
                />
            </Form.Item>

            <Form.Item
                name="phoneNumber"
                label="Số điện thoại"
                rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                ]}
            >
                <Input 
                    size="large"
                    prefix={<PhoneOutlined />}
                    placeholder="0123456789"
                />
            </Form.Item>
        </div>
    );
};

export default GuestInfoForm;
