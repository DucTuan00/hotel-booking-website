import React, { useEffect } from 'react';
import { Form, Input, Button, Space } from 'antd';
import { Amenity } from '@/types/amenity';

interface AmenityFormProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: Omit<Amenity, 'id'>) => Promise<void>;
    initialValues?: Partial<Amenity>;
    loading?: boolean;
}

const AmenityForm: React.FC<AmenityFormProps> = ({ 
    visible, 
    onCancel, 
    onSubmit, 
    initialValues, 
    loading = false 
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            if (initialValues) {
                form.setFieldsValue(initialValues);
            } else {
                form.resetFields();
            }
        }
    }, [visible, initialValues, form]);

    const handleSubmit = async (values: { name: string }) => {
        await onSubmit(values);
    };

    if (!visible) return null;

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
        >
            <Form.Item
                label="Tên tiện nghi"
                name="name"
                rules={[
                    { required: true, message: 'Vui lòng nhập tên tiện nghi!' },
                    { min: 2, message: 'Tên tiện nghi phải có ít nhất 2 ký tự!' },
                ]}
            >
                <Input placeholder="Nhập tên tiện nghi..." />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                <Space>
                    <Button onClick={onCancel}>
                        Hủy
                    </Button>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        loading={loading}
                    >
                        {initialValues?.id ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default AmenityForm;