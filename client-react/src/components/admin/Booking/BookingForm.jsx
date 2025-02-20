import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, InputNumber, DatePicker, Spin } from 'antd';
import moment from 'moment';

const { Option } = Select;

const BookingForm = ({ onCancel, onSubmit, initialValues, loading }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues) {
            // Format date values for DatePicker if editing
            const formattedInitialValues = {
                ...initialValues,
                checkInDate: moment(initialValues.checkInDate),
                checkOutDate: moment(initialValues.checkOutDate),
            };
            form.setFieldsValue(formattedInitialValues);
        } else {
            form.resetFields();
        }
    }, [form, initialValues]);

    const onFinish = (values) => {
        // Format date values back to string before submit
        const formattedValues = {
            ...values,
            checkInDate: values.checkInDate.format('YYYY-MM-DD'),
            checkOutDate: values.checkOutDate.format('YYYY-MM-DD'),
        };
        onSubmit(formattedValues);
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
                    label="User ID"
                    name="userId"
                    rules={[{ required: true, message: 'Vui lòng nhập User ID!' }]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Room ID"
                    name="roomId"
                    rules={[{ required: true, message: 'Vui lòng nhập Room ID!' }]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Ngày Check-in"
                    name="checkInDate"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày Check-in!' }]}
                >
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>

                <Form.Item
                    label="Ngày Check-out"
                    name="checkOutDate"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày Check-out!' }]}
                >
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>

                <Form.Item
                    label="Số khách"
                    name="numberOfGuests"
                    rules={[{ required: true, message: 'Vui lòng nhập số khách!' }]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Trạng thái Booking"
                    name="bookingStatus"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái Booking!' }]}
                >
                    <Select placeholder="Chọn trạng thái">
                        <Option value="Pending">Chờ xác nhận</Option>
                        <Option value="Confirmed">Đã xác nhận</Option>
                        <Option value="Cancelled">Đã hủy</Option>
                        <Option value="Completed">Hoàn thành</Option>
                    </Select>
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

export default BookingForm;