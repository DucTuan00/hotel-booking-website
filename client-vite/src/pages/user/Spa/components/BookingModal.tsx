import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Button, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import spaBookingService from '@/services/spa/spaBookingService';
import authService from '@/services/auth/authService';
import Notification from '@/components/Notification';
import { Message } from '@/types/message';

const { TextArea } = Input;
const { Title } = Typography;

interface BookingData {
    fullName: string;
    phone: string;
    bookingDate: dayjs.Dayjs;
    content?: string;
}

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<Message | null>(null);
    const navigate = useNavigate();

    const handleClose = () => {
        onClose();
        form.resetFields();
        setMessage(null);
    };

    const handleSubmit = async (values: BookingData) => {
        // Check authentication first
        try {
            await authService.verifyToken();
        } catch {
            setMessage({
                type: 'error',
                text: 'Vui lòng đăng nhập để tiếp tục đặt lịch spa'
            });
            
            setTimeout(() => {
                handleClose();
                navigate('/login', { 
                    state: { 
                        from: window.location.pathname,
                        returnUrl: window.location.pathname + window.location.search
                    } 
                });
            }, 2000);
            return;
        }

        setLoading(true);
        try {
            await spaBookingService.createSpaBooking({
                fullName: values.fullName,
                phone: values.phone,
                bookingDate: values.bookingDate.format('YYYY-MM-DD'),
                content: values.content
            });
            
            setMessage({
                type: 'success',
                text: 'Đặt lịch spa thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.'
            });
            
            setTimeout(() => {
                handleClose();
            }, 1000);
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!'
            });
        } finally {
            setLoading(false);
        }
    };

    const disabledDate = (current: dayjs.Dayjs) => {
        return current && current < dayjs().startOf('day');
    };

    return (
        <Modal
            title={
                <Title 
                    level={3} 
                    className="!mb-0 !text-center" 
                    style={{ fontFamily: 'Playfair Display, serif' }}
                >
                    ĐẶT LỊCH SPA
                </Title>
            }
            open={isOpen}
            onCancel={handleClose}
            footer={null}
            centered
            width={500}
            closeIcon={<CloseOutlined className="text-xl" />}
            styles={{
                header: {
                    borderBottom: '1px solid #f0f0f0',
                    paddingBottom: '16px'
                }
            }}
        >
            {message && (
                <Notification
                    message={message}
                    onClose={() => setMessage(null)}
                />
            )}
            
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    bookingDate: dayjs()
                }}
                className="pt-6"
            >
                <Form.Item
                    name="fullName"
                    label="Họ và tên"
                    rules={[
                        { required: true, message: 'Vui lòng nhập họ và tên!' },
                        { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' }
                    ]}
                >
                    <Input 
                        placeholder="Nhập họ và tên" 
                        size="large"
                        className="rounded-lg"
                    />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Điện thoại"
                    rules={[
                        { required: true, message: 'Vui lòng nhập số điện thoại!' },
                        { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                    ]}
                >
                    <Input 
                        placeholder="Nhập số điện thoại" 
                        size="large"
                        className="rounded-lg"
                    />
                </Form.Item>

                <Form.Item
                    name="bookingDate"
                    label="Ngày đặt"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày đặt!' }]}
                >
                    <DatePicker
                        placeholder="Chọn ngày đặt"
                        format="DD/MM/YYYY"
                        disabledDate={disabledDate}
                        size="large"
                        className="w-full rounded-lg"
                    />
                </Form.Item>

                <Form.Item
                    name="content"
                    label="Nội dung"
                >
                    <TextArea 
                        placeholder="Nhập yêu cầu đặc biệt (tùy chọn)"
                        rows={4}
                        className="rounded-lg"
                    />
                </Form.Item>

                <Form.Item className="mb-0 pt-4">
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={loading}
                        className="w-full bg-[#D4902A] hover:bg-[#B8761E] border-[#D4902A] hover:border-[#B8761E] font-semibold text-lg py-6 h-auto uppercase tracking-wider rounded-lg"
                    >
                        {loading ? 'ĐANG XỬ LÝ...' : 'ĐẶT NGAY'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BookingModal;
