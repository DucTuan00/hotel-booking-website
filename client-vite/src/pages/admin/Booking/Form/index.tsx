
import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Button } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import bookingService from '@/services/bookings/bookingService';
import { Booking, BookingStatus } from '@/types/booking';

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
    const [bookingStatus, setBookingStatus] = useState<BookingStatus>(BookingStatus.PENDING);

    useEffect(() => {
        if (visible) {
            if (initialValues && initialValues.status) {
                setBookingStatus(initialValues.status);
                form.setFieldsValue({
                    status: initialValues.status
                });
            } else {
                setBookingStatus(BookingStatus.PENDING);
                form.resetFields();
            }
        }
    }, [visible, initialValues, form]);

    const handleSubmit = async (values: { status: BookingStatus }) => {
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
                        <Option value={BookingStatus.PENDING}>Chờ xác nhận</Option>
                        <Option value={BookingStatus.CONFIRMED}>Đã xác nhận</Option>
                        <Option value={BookingStatus.CANCELLED}>Đã hủy</Option>
                        <Option value={BookingStatus.REJECTED}>Đã từ chối</Option>
                        <Option value={BookingStatus.COMPLETED}>Hoàn thành</Option>
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
                    >
                        Cập nhật trạng thái
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BookingForm;