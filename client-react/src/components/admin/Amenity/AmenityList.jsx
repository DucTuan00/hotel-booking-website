import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import AmenityForm from './AmenityForm';
import DeleteConfirm from '../Common/DeleteConfirm';

const AmenityList = () => {
    const [amenities, setAmenities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingAmenity, setEditingAmenity] = useState(null);
    const [deleteAmenityId, setDeleteAmenityId] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

    // Dữ liệu mẫu amenity (thay bằng API call sau)
    const dummyAmenities = [
        { id: 1, name: 'Wifi miễn phí', description: 'Truy cập internet tốc độ cao miễn phí' },
        { id: 2, name: 'Hồ bơi', description: 'Hồ bơi ngoài trời' },
        // ... more dummy amenities
    ];

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setAmenities(dummyAmenities);
            setLoading(false);
        }, 500);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Tên tiện nghi', dataIndex: 'name', key: 'name' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small">Sửa</Button>
                    <Popconfirm
                        title="Bạn chắc chắn muốn xóa tiện nghi này?"
                        onConfirm={() => handleDeleteConfirm(record.id)}
                        onCancel={() => { }}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger icon={<DeleteOutlined />} size="small">Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const showModal = () => {
        setIsModalVisible(true);
        setEditingAmenity(null);
    };

    const handleEdit = (amenity) => {
        setIsModalVisible(true);
        setEditingAmenity(amenity);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleFormSubmit = (values) => {
        setLoading(true);
        setTimeout(() => {
            if (editingAmenity) {
                const updatedAmenities = amenities.map(amenity => amenity.id === editingAmenity.id ? { ...editingAmenity, ...values } : amenity);
                setAmenities(updatedAmenities);
                message.success('Tiện nghi đã được cập nhật thành công!');
            } else {
                const newAmenity = { id: amenities.length + 1, ...values };
                setAmenities([...amenities, newAmenity]);
                message.success('Tiện nghi đã được thêm thành công!');
            }
            setIsModalVisible(false);
            setLoading(false);
        }, 500);
    };

    const handleDeleteConfirm = (amenityId) => {
        setDeleteAmenityId(amenityId);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
    };

    const confirmDeleteAmenity = () => {
        setLoading(true);
        setTimeout(() => {
            const updatedAmenities = amenities.filter(amenity => amenity.id !== deleteAmenityId);
            setAmenities(updatedAmenities);
            message.success('Tiện nghi đã được xóa thành công!');
            setIsDeleteModalVisible(false);
            setLoading(false);
        }, 500);
    };

    return (
        <div>
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                    Thêm tiện nghi mới
                </Button>
            </div>
            <Table columns={columns} dataSource={amenities} loading={loading} rowKey="id" />

            <Modal
                title={editingAmenity ? "Sửa tiện nghi" : "Thêm tiện nghi mới"}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <AmenityForm
                    onCancel={handleCancel}
                    onSubmit={handleFormSubmit}
                    initialValues={editingAmenity}
                    loading={loading}
                />
            </Modal>

            <DeleteConfirm
                visible={isDeleteModalVisible}
                onConfirm={confirmDeleteAmenity}
                onCancel={handleDeleteCancel}
                itemName="tiện nghi"
                loading={loading}
            />
        </div>
    );
};

export default AmenityList;