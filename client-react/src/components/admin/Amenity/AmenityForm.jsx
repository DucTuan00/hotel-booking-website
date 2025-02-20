import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Spin } from 'antd';

const AmenityForm = ({ onCancel, onSubmit, initialValues, loading }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
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
                initialValues={initialValues}
            >
                <Form.Item
                    label="Tên tiện nghi"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên tiện nghi!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả tiện nghi!' }]}
                >
                    <Input.TextArea />
                </Form.Item>

                <Form.Item style={{ textAlign: 'right' }}>
                    <Button onClick={onCancel} style={{ marginRight: 8 }}>
                        Hủy
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {initialValues ? 'Lưu' : 'Thêm'}
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default AmenityForm;