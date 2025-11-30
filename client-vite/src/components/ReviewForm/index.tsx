import React, { useState } from 'react';
import { Form, Rate, Input, Button } from 'antd';
import reviewService from '@/services/reviews/reviewService';
import Notification from '@/components/Notification';

const { TextArea } = Input;

interface ReviewFormProps {
    bookingId: string;
    roomId: string;
    roomName: string;
    onSuccess?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
    bookingId,
    roomId,
    roomName,
    onSuccess
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (values: { rating: number; comment?: string }) => {
        setLoading(true);
        try {
            await reviewService.createReview({
                bookingId,
                roomId,
                rating: values.rating,
                comment: values.comment
            });

            setNotification({
                type: 'success',
                text: 'Đánh giá của bạn đã được gửi thành công!'
            });

            form.resetFields();
            
            if (onSuccess) {
                setTimeout(() => {
                    onSuccess();
                }, 1500);
            }
        } catch (error: any) {
            setNotification({
                type: 'error',
                text: error.response?.data?.message || 'Không thể gửi đánh giá. Vui lòng thử lại!'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Notification
                message={notification}
                onClose={() => setNotification(null)}
            />
            <div>
                <p className="text-xl font-semibold mb-4 break-words">
                    Đánh giá phòng: {roomName}
                </p>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ rating: 5 }}
                >
                    <Form.Item
                        name="rating"
                        label="Đánh giá"
                        rules={[{ required: true, message: 'Vui lòng chọn số sao!' }]}
                    >
                        <Rate
                            allowHalf
                            style={{ fontSize: 32, color: '#D4902A' }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="comment"
                        label="Nhận xét của bạn"
                    >
                        <TextArea
                            rows={4}
                            placeholder="Chia sẻ trải nghiệm của bạn về phòng này..."
                            maxLength={500}
                            showCount
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            size="large"
                            style={{ backgroundColor: '#D4902A', borderColor: '#D4902A' }}
                        >
                            Gửi đánh giá
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default ReviewForm;
