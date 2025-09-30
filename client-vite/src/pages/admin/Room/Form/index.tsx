import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Upload, Button, Checkbox, Row, Col, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import amenityService from '@/services/amenities/amenityService';
import roomService from '@/services/rooms/roomService';
import { Amenity } from '@/types/amenity';
import { Room, RoomType } from '@/types/room';

const { TextArea } = Input;
const { Option } = Select;

interface RoomFormProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (loading: boolean, data: Room | null, error?: unknown) => void;
    initialValues?: Partial<Room>;
    loading?: boolean;
}

const RoomForm: React.FC<RoomFormProps> = ({ visible, onCancel, onSubmit, initialValues, loading }) => {
    const [form] = Form.useForm();
    const [availableAmenities, setAvailableAmenities] = useState<Amenity[]>([]);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const isEditing = !!initialValues?.id;

    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                const data = await amenityService.getAllAmenities({});
                setAvailableAmenities(data.amenities);
            } catch (error) {
                console.error("Could not fetch amenities:", error);
                setAvailableAmenities([]);
            }
        };
        fetchAmenities();
    }, []);

    useEffect(() => {
        if (visible) {
            if (initialValues?.id) {
                // Editing mode
                form.setFieldsValue({
                    name: initialValues.name,
                    roomType: initialValues.roomType,
                    description: initialValues.description,
                    price: initialValues.price,
                    maxGuests: initialValues.maxGuests,
                    quantity: initialValues.quantity,
                    amenities: initialValues.amenities?.map((amenity: Amenity) => amenity.id) || []
                });

                // Set up existing images for preview
                const existingFiles: UploadFile[] = initialValues.images?.map((imageObj, index) => ({
                    uid: `existing-${index}`,
                    name: `image-${index}`,
                    status: 'done',
                    url: `http://localhost:3000/${imageObj.path}`,
                    response: { imageId: imageObj.id, path: imageObj.path }
                })) || [];
                setFileList(existingFiles);
            } else {
                // Create mode
                form.resetFields();
                setFileList([]);
            }
        }
    }, [visible, initialValues, form]);

    const handleSubmit = async (values: {
        name: string;
        roomType: RoomType;
        description: string;
        price: number;
        maxGuests: number;
        quantity: number;
        amenities?: string[];
    }) => {
        try {
            onSubmit(true, null, undefined);
            
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('roomType', values.roomType);
            formData.append('description', values.description || '');
            formData.append('price', values.price.toString());
            formData.append('maxGuests', values.maxGuests.toString());
            formData.append('quantity', values.quantity.toString());
            
            // Add amenities
            if (values.amenities && values.amenities.length > 0) {
                values.amenities.forEach(amenityId => {
                    formData.append('amenities', amenityId);
                });
            }
            
            // Add new image files (not existing ones)
            const newFiles = fileList.filter(file => 
                file.originFileObj && file.status !== 'error'
            );
            
            if (!isEditing && newFiles.length === 0) {
                onSubmit(false, null, "Vui lòng chọn ít nhất một hình ảnh");
                return;
            }
            
            newFiles.forEach(file => {
                if (file.originFileObj) {
                    formData.append('images', file.originFileObj);
                }
            });
            
            let responseData: Room | null = null;
            
            if (isEditing && initialValues?.id) {
                // Update room
                responseData = await roomService.updateRoom(initialValues.id, formData);
            } else {
                // Create room
                responseData = await roomService.createRoom(formData);
            }
            
            onSubmit(false, responseData, undefined);
        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'creating'} room:`, error);
            onSubmit(false, null, error);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setFileList([]);
        onCancel();
    };

    const uploadProps: UploadProps = {
        listType: 'picture-card',
        fileList,
        onChange: ({ fileList: newFileList }) => setFileList(newFileList),
        beforeUpload: () => false, // Prevent auto upload
        onPreview: async (file) => {
            if (!file.url && !file.preview) {
                file.preview = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file.originFileObj as File);
                    reader.onload = () => resolve(reader.result as string);
                });
            }
            const image = new Image();
            image.src = file.url || file.preview || '';
            const imgWindow = window.open(file.url || file.preview);
            imgWindow?.document.write(image.outerHTML);
        },
        onRemove: async (file) => {
            // If this is an existing image (has response.imageId), delete it from server
            if (file.response?.imageId && isEditing) {
                try {
                    await roomService.deleteRoomImage(file.response.imageId);
                    message.success('Đã xóa hình ảnh');
                } catch (error) {
                    console.error('Error deleting image:', error);
                    message.error('Lỗi xóa hình ảnh');
                    return false;
                }
            }
            
            return true; 
        }
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Tải ảnh</div>
        </div>
    );

    return (
        <Modal
            title={isEditing ? 'Sửa thông tin phòng' : 'Thêm phòng mới'}
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={800}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Tên phòng"
                            name="name"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên phòng!' },
                                { min: 2, message: 'Tên phòng phải có ít nhất 2 ký tự!' }
                            ]}
                        >
                            <Input placeholder="Nhập tên phòng" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Loại phòng"
                            name="roomType"
                            rules={[{ required: true, message: 'Vui lòng chọn loại phòng!' }]}
                        >
                            <Select placeholder="Chọn loại phòng">
                                <Option value={RoomType.SINGLE}>Single</Option>
                                <Option value={RoomType.DOUBLE}>Double</Option>
                                <Option value={RoomType.SUITE}>Suite</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                >
                    <TextArea rows={4} placeholder="Nhập mô tả phòng" />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            label="Giá (VNĐ/đêm)"
                            name="price"
                            rules={[
                                { required: true, message: 'Vui lòng nhập giá!' },
                                { type: 'number', min: 1, message: 'Giá phải lớn hơn 0!' }
                            ]}
                        >
                            <InputNumber
                                min={1}
                                max={10000000}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                style={{ width: '100%' }}
                                placeholder="Nhập giá"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Số người tối đa"
                            name="maxGuests"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số người!' },
                                { type: 'number', min: 1, max: 10, message: 'Số người từ 1-10!' }
                            ]}
                        >
                            <InputNumber min={1} max={10} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Số lượng phòng"
                            name="quantity"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số lượng!' },
                                { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0!' }
                            ]}
                        >
                            <InputNumber min={1} max={100} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Tiện ích" name="amenities">
                    <Checkbox.Group>
                        <Row>
                            {availableAmenities.map((amenity) => (
                                <Col span={8} key={amenity.id}>
                                    <Checkbox value={amenity.id}>{amenity.name}</Checkbox>
                                </Col>
                            ))}
                        </Row>
                    </Checkbox.Group>
                </Form.Item>

                <Form.Item label="Hình ảnh phòng">
                    <Upload {...uploadProps}>
                        {fileList.length >= 5 ? null : uploadButton}
                    </Upload>
                    <p style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>
                        Tối đa 5 hình ảnh. Định dạng: JPG, PNG
                    </p>
                </Form.Item>

                <Form.Item className="mb-0 text-right">
                    <Button onClick={handleCancel} className="mr-2" disabled={loading}>
                        Hủy
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        {isEditing ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RoomForm;
