import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Spin } from 'antd';

const { Option } = Select;

const UserForm = ({ onCancel, onSubmit, initialValues, loading }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues); // Set giá trị form khi edit
        } else {
            form.resetFields(); // Reset form khi thêm mới
        }
    }, [form, initialValues]);

    const onFinish = (values) => {
        onSubmit(values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Spin spinning={loading}>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                initialValues={initialValues} // Mặc định values nếu có
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input user name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input user email!', type: 'email' }]}
                >
                    <Input type="email" />
                </Form.Item>

                <Form.Item
                    label="Role"
                    name="role"
                    rules={[{ required: true, message: 'Please select user role!' }]}
                >
                    <Select placeholder="Select a role">
                        <Option value="Admin">Admin</Option>
                        <Option value="Editor">Editor</Option>
                        <Option value="User">User</Option>
                    </Select>
                </Form.Item>

                <Form.Item style={{ textAlign: 'right' }}>
                    <Button onClick={onCancel} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {initialValues ? 'Save' : 'Add'}
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default UserForm;