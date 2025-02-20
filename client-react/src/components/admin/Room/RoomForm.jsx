import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, InputNumber, Spin } from 'antd';

const { Option } = Select;

const RoomForm = ({ onCancel, onSubmit, initialValues, loading }) => {
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
                    label="Tên phòng"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên phòng!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Loại phòng"
                    name="roomType"
                    rules={[{ required: true, message: 'Vui lòng chọn loại phòng!' }]}
                >
                    <Select placeholder="Chọn loại phòng">
                        <Option value="Standard">Standard</Option>
                        <Option value="Deluxe">Deluxe</Option>
                        <Option value="Suite">Suite</Option>
                        <Option value="VIP">VIP</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Giá (USD)"
                    name="price"
                    rules={[{ required: true, message: 'Vui lòng nhập giá phòng!' }]}
                >
                    <InputNumber min={0} style={{ width: '100%' }} formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} />
                </Form.Item>

                <Form.Item
                    label="Sức chứa"
                    name="capacity"
                    rules={[{ required: true, message: 'Vui lòng nhập sức chứa phòng!' }]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
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

export default RoomForm;