import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Upload, Button, message, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { RestaurantService, CreateRestaurantServiceInput, UpdateRestaurantServiceInput } from '@/types/restaurant';
import restaurantServiceService from '@/services/restaurants/restaurantServiceService';
import uploadService from '@/services/upload/uploadService';

interface RestaurantServiceFormProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (isLoading: boolean, data: RestaurantService | null, error?: unknown) => void;
    editingService: RestaurantService | null;
}

const RestaurantServiceForm: React.FC<RestaurantServiceFormProps> = ({
    visible,
    onCancel,
    onSubmit,
    editingService
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (visible) {
            if (editingService) {
                form.setFieldsValue({
                    title: editingService.title,
                    description: editingService.description,
                    price: editingService.price,
                });
                setFileList([]);
            } else {
                form.resetFields();
                setFileList([]);
            }
        }
    }, [visible, editingService, form]);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        onSubmit(true, null);

        try {
            let imagePath = editingService?.imagePath || '';
            
            // Upload image first if new file selected
            if (fileList[0] && fileList[0].originFileObj) {
                const uploadResult = await uploadService.uploadImage(fileList[0].originFileObj);
                imagePath = uploadResult.url;
            }

            const data = {
                title: values.title,
                description: values.description || '',
                price: values.price || 0,
                imagePath
            };

            let result;
            if (editingService) {
                const updateData: UpdateRestaurantServiceInput = {
                    id: editingService.id,
                    ...data
                };
                result = await restaurantServiceService.updateRestaurantService(editingService.id, updateData);
            } else {
                const createData: CreateRestaurantServiceInput = data;
                result = await restaurantServiceService.createRestaurantService(createData);
            }

            onSubmit(false, result.service);
        } catch (error) {
            console.error('Error submitting form:', error);
            onSubmit(false, null, error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setFileList([]);
        onCancel();
    };

    const handleUploadChange = ({ fileList: newFileList }: any) => {
        setFileList(newFileList);
    };

    const uploadProps = {
        name: 'image',
        listType: 'picture' as const,
        fileList,
        onChange: handleUploadChange,
        beforeUpload: (file: File) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('Chỉ có thể tải lên file JPG/PNG!');
            }
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                message.error('Hình ảnh phải nhỏ hơn 5MB!');
            }
            return false;
        },
    };

    return (
        <Modal
            title={editingService ? 'Chỉnh sửa dịch vụ nhà hàng' : 'Thêm dịch vụ nhà hàng'}
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Tên dịch vụ"
                    name="title"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên dịch vụ!' },
                        { min: 2, message: 'Tên dịch vụ phải có ít nhất 2 ký tự!' }
                    ]}
                >
                    <Input placeholder="Nhập tên dịch vụ" />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                >
                    <Input.TextArea 
                        rows={4} 
                        placeholder="Nhập mô tả dịch vụ"
                    />
                </Form.Item>

                <Form.Item
                    label="Giá"
                    name="price"
                    rules={[
                        { type: 'number', min: 0, message: 'Giá phải là số dương!' }
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        placeholder="Nhập giá dịch vụ"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        min={0}
                    />
                </Form.Item>

                <Form.Item
                    label="Hình ảnh"
                    name="image"
                >
                    <div>
                        {/* Show current image if editing */}
                        {editingService && editingService.imagePath && fileList.length === 0 && (
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Image
                                        width={100}
                                        height={80}
                                        src={`http://localhost:3000/${editingService.imagePath}`}
                                        alt="Current service image"
                                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                                    />
                                </div>
                            </div>
                        )}
                        
                        <Upload {...uploadProps}>
                            <Button icon={<UploadOutlined />}>
                                {editingService && editingService.imagePath && fileList.length === 0 
                                    ? 'Thay đổi hình ảnh' 
                                    : 'Tải lên hình ảnh'
                                }
                            </Button>
                        </Upload>
                    </div>
                </Form.Item>

                <Form.Item>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <Button onClick={handleCancel}>
                            Hủy
                        </Button>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={loading}
                        >
                            {editingService ? 'Cập nhật' : 'Thêm'}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RestaurantServiceForm;