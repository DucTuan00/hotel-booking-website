
import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Button } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import bookingService from '@/services/bookings/bookingService';
import { Booking } from '@/types/booking';

const { Option } = Select;

interface BookingFormProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (loading: boolean, data: Booking | null, error?: unknown) => void;
    initialValues?: Partial<Booking>;
    loading?: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({ visible, onCancel, onSubmit, initialValues, loading }) => {
    const [form] = Form.useForm();
    const [bookingStatus, setBookingStatus] = useState<Booking['status']>('Pending');

    useEffect(() => {
        if (visible) {
            if (initialValues && initialValues.status) {
                setBookingStatus(initialValues.status);
                form.setFieldsValue({
                    status: initialValues.status
                });
            } else {
                setBookingStatus('Pending');
                form.resetFields();
            }
        }
    }, [visible, initialValues, form]);

    const handleSubmit = async (values: { status: Booking['status'] }) => {
        onSubmit(true, null, undefined);
        try {
            let responseData: Booking | null = null;
            if (initialValues && initialValues.id) {
                responseData = await bookingService.updateBooking({ 
                    bookingId: initialValues.id, 
                    status: values.status 
                });
            }
            onSubmit(false, responseData, undefined);
        } catch (error) {
            console.error('Error updating booking status:', error);
            onSubmit(false, null, error);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title="Cập nhật trạng thái Booking"
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={500}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{ status: bookingStatus }}
            >
                <Form.Item
                    label="Trạng thái Booking"
                    name="status"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                    <Select
                        placeholder="Chọn trạng thái"
                        size="large"
                        prefix={<ClockCircleOutlined />}
                        onChange={setBookingStatus}
                    >
                        <Option value="Pending">Chờ xác nhận</Option>
                        <Option value="Confirmed">Đã xác nhận</Option>
                        <Option value="Cancelled">Đã hủy</Option>
                        <Option value="Completed">Hoàn thành</Option>
                    </Select>
                </Form.Item>

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
                        className="bg-red-800 hover:bg-red-900"
                    >
                        Cập nhật trạng thái
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BookingForm;