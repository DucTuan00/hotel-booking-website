import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Button, Checkbox, Row, Col } from 'antd';
import type { UploadFile } from 'antd';
import amenityService from '@/services/amenities/amenityService';
import roomService from '@/services/rooms/roomService';
import uploadService from '@/services/upload/uploadService';
import { Amenity } from '@/types/amenity';
import { Room, RoomType, CreateRoomInput, UpdateRoomInput } from '@/types/room';
import ImageItems from '@/pages/admin/Room/Form/ImageItems';

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

                // Set up existing Cloudinary images for preview
                const existingFiles: UploadFile[] = initialValues.images?.map((imageObj, index) => ({
                    uid: `existing-${index}`,
                    name: `image-${index}`,
                    status: 'done',
                    url: imageObj.path, // Cloudinary URL
                    response: { 
                        publicId: imageObj.id, // Cloudinary public_id
                        url: imageObj.path 
                    }
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
            
            if (fileList.length === 0) {
                onSubmit(false, null, "Vui lòng chọn ít nhất một hình ảnh");
                return;
            }
            
            if (fileList.length > 5) {
                onSubmit(false, null, "Tối đa 5 hình ảnh được phép");
                return;
            }
            
            // Separate new files and existing Cloudinary images
            const newFiles: File[] = [];
            const existingImages: Array<{ publicId: string; url: string }> = [];
            
            for (const file of fileList) {
                if (file.originFileObj) {
                    // New file to upload to Cloudinary
                    newFiles.push(file.originFileObj);
                } else if (file.response?.publicId && file.response?.url) {
                    // Existing Cloudinary image
                    existingImages.push({
                        publicId: file.response.publicId,
                        url: file.response.url
                    });
                }
            }
            
            // Upload new files to Cloudinary
            let newCloudinaryImages: Array<{ publicId: string; url: string }> = [];
            if (newFiles.length > 0) {
                const uploadResults = await uploadService.uploadMultipleImages(newFiles);
                newCloudinaryImages = uploadResults.map(result => ({
                    publicId: result.publicId,
                    url: result.url
                }));
            }
            
            // Combine existing and new Cloudinary images
            const allImages = [...existingImages, ...newCloudinaryImages];
            
            const roomData = {
                name: values.name,
                roomType: values.roomType,
                description: values.description || '',
                price: values.price,
                maxGuests: values.maxGuests,
                quantity: values.quantity,
                amenities: values.amenities || [],
                images: allImages.map(img => img.url)
            };
            
            let responseData: Room | null = null;
            
            if (isEditing && initialValues?.id) {
                const updateData: UpdateRoomInput = {
                    id: initialValues.id,
                    ...roomData
                };
                responseData = await roomService.updateRoom(initialValues.id, updateData);
            } else {
                const createData: CreateRoomInput = roomData;
                responseData = await roomService.createRoom(createData);
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

    return (
        <Modal
            title={isEditing ? 'Sửa thông tin phòng' : 'Thêm phòng mới'}
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={800}
            destroyOnHidden
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
                    <ImageItems
                        fileList={fileList}
                        onChange={setFileList}
                        maxCount={5}
                    />
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
