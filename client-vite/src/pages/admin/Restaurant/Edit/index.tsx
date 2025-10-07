import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Spin } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import restaurantService from '@/services/restaurants/restaurantService';
import Notification from '@/components/Notification';
import { Message } from '@/types/message';

const { TextArea } = Input;

const RestaurantEdit: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [message, setMessage] = useState<Message | null>(null);

    useEffect(() => {
        fetchRestaurantInfo();
    }, []);

    const fetchRestaurantInfo = async () => {
        setLoading(true);
        try {
            const data = await restaurantService.getRestaurantInfo();
            form.setFieldsValue({
                information: data.information
            });
        } catch (error) {
            console.error('Error fetching restaurant info:', error);
            setMessage({ type: 'error', text: 'Tải thông tin nhà hàng thất bại.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values: { information: string }) => {
        setSaving(true);
        try {
            await restaurantService.updateRestaurantInfo(values.information);
            setMessage({ type: 'success', text: 'Cập nhật thông tin nhà hàng thành công.' });
        } catch (error) {
            console.error('Error updating restaurant info:', error);
            setMessage({ type: 'error', text: 'Cập nhật thông tin nhà hàng thất bại.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <>
            <Notification
                message={message}
                onClose={() => setMessage(null)}
            />

            <Card title="Chỉnh sửa thông tin nhà hàng">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Thông tin giới thiệu nhà hàng"
                        name="information"
                        rules={[
                            { required: true, message: 'Vui lòng nhập thông tin giới thiệu!' },
                        ]}
                    >
                        <TextArea
                            rows={10}
                            placeholder="Nhập thông tin giới thiệu về nhà hàng..."
                            showCount
                            maxLength={2000}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={saving}
                            size="large"
                        >
                            Lưu thay đổi
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </>
    );
};

export default RestaurantEdit;