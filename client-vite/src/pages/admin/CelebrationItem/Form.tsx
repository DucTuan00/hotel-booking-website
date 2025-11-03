import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Upload, Button, message, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { CelebrateItem, CreateCelebrateItemInput, UpdateCelebrateItemInput } from '@/types/celebrate';
import celebrateItemService from '@/services/celebrations/celebrateItemService';
import uploadService from '@/services/upload/uploadService';

interface CelebrateItemFormProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (isLoading: boolean, data: CelebrateItem | null, error?: unknown) => void;
    editingItem: CelebrateItem | null;
}

const CelebrateItemForm: React.FC<CelebrateItemFormProps> = ({
    visible,
    onCancel,
    onSubmit,
    editingItem
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (visible) {
            if (editingItem) {
                form.setFieldsValue({
                    name: editingItem.name,
                    description: editingItem.description,
                    price: editingItem.price,
                });
                setFileList([]);
            } else {
                form.resetFields();
                setFileList([]);
            }
        }
    }, [visible, editingItem, form]);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        onSubmit(true, null);

        try {
            let imagePath = editingItem?.imagePath || '';
            
            // Upload image first if new file selected
            if (fileList[0] && fileList[0].originFileObj) {
                const uploadResult = await uploadService.uploadImage(fileList[0].originFileObj);
                imagePath = uploadResult.url;
            }

            const data = {
                name: values.name,
                description: values.description || '',
                price: values.price || 0,
                imagePath
            };

            let result;
            if (editingItem) {
                const updateData: UpdateCelebrateItemInput = {
                    id: editingItem.id,
                    ...data
                };
                result = await celebrateItemService.updateCelebrateItem(editingItem.id, updateData);
            } else {
                const createData: CreateCelebrateItemInput = data;
                result = await celebrateItemService.createCelebrateItem(createData);
            }

            onSubmit(false, result.item);
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
            title={editingItem ? 'Chỉnh sửa Celebration Item' : 'Thêm Celebration Item'}
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
                    label="Tên món"
                    name="name"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên món!' },
                        { min: 2, message: 'Tên món phải có ít nhất 2 ký tự!' }
                    ]}
                >
                    <Input placeholder="Nhập tên món" />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                >
                    <Input.TextArea 
                        rows={4} 
                        placeholder="Nhập mô tả món"
                    />
                </Form.Item>

                <Form.Item
                    label="Giá"
                    name="price"
                    rules={[
                        { required: true, message: 'Vui lòng nhập giá!' },
                        { type: 'number', min: 0, message: 'Giá phải là số dương!' }
                    ]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        placeholder="Nhập giá món"
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
                        {editingItem && editingItem.imagePath && fileList.length === 0 && (
                            <div style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Image
                                        width={100}
                                        height={80}
                                        src={editingItem.imagePath}
                                        alt="Current item image"
                                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                                    />
                                </div>
                            </div>
                        )}
                        
                        <Upload {...uploadProps}>
                            <Button icon={<UploadOutlined />}>
                                {editingItem && editingItem.imagePath && fileList.length === 0 
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
                            {editingItem ? 'Cập nhật' : 'Thêm'}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CelebrateItemForm;
