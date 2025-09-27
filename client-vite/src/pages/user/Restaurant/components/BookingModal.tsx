import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Radio, Button, message, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Title } = Typography;

interface BookingData {
    title: 'anh' | 'chi';
    fullName: string;
    phone: string;
    date: string;
    message?: string;
}

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        onClose();
        form.resetFields();
    };

    const handleSubmit = async (values: BookingData) => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('Booking data:', {
                ...values,
                date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : ''
            });
            
            message.success('Đặt bàn thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
            onClose();
            form.resetFields();
        } catch {
            message.error('Có lỗi xảy ra. Vui lòng thử lại!');
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
                    ĐẶT DỊCH VỤ
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
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    title: 'anh',
                    date: dayjs()
                }}
                className="pt-6"
            >
                <Form.Item
                    label="Họ và tên"
                    className="mb-4"
                >
                    <Form.Item 
                        name="title" 
                        className="!mb-2"
                        rules={[{ required: true }]}
                    >
                        <Radio.Group className="w-full">
                            <Radio value="anh" className="mr-6">Anh</Radio>
                            <Radio value="chi">Chị</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item 
                        name="fullName" 
                        className="!mb-0"
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
                    name="date"
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
                    name="message"
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