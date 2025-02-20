import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import RoomForm from './RoomForm';
import DeleteConfirm from '../Common/DeleteConfirm';

const RoomList = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [deleteRoomId, setDeleteRoomId] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

    // Dữ liệu mẫu phòng (thay bằng API call sau)
    const dummyRooms = [
        { id: 1, name: 'Phòng Deluxe 101', roomType: 'Deluxe', price: 150, capacity: 2 },
        { id: 2, name: 'Suite VIP 201', roomType: 'Suite', price: 300, capacity: 4 },
        // ... more dummy rooms
    ];

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setRooms(dummyRooms);
            setLoading(false);
        }, 500);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Tên phòng', dataIndex: 'name', key: 'name' },
        { title: 'Loại phòng', dataIndex: 'roomType', key: 'roomType' },
        { title: 'Giá (USD)', dataIndex: 'price', key: 'price' },
        { title: 'Sức chứa', dataIndex: 'capacity', key: 'capacity' },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small">Sửa</Button>
                    <Popconfirm
                        title="Bạn chắc chắn muốn xóa phòng này?"
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
        setEditingRoom(null);
    };

    const handleEdit = (room) => {
        setIsModalVisible(true);
        setEditingRoom(room);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleFormSubmit = (values) => {
        setLoading(true);
        setTimeout(() => {
            if (editingRoom) {
                const updatedRooms = rooms.map(room => room.id === editingRoom.id ? { ...editingRoom, ...values } : room);
                setRooms(updatedRooms);
                message.success('Phòng đã được cập nhật thành công!');
            } else {
                const newRoom = { id: rooms.length + 1, ...values };
                setRooms([...rooms, newRoom]);
                message.success('Phòng đã được thêm thành công!');
            }
            setIsModalVisible(false);
            setLoading(false);
        }, 500);
    };

    const handleDeleteConfirm = (roomId) => {
        setDeleteRoomId(roomId);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
    };

    const confirmDeleteRoom = () => {
        setLoading(true);
        setTimeout(() => {
            const updatedRooms = rooms.filter(room => room.id !== deleteRoomId);
            setRooms(updatedRooms);
            message.success('Phòng đã được xóa thành công!');
            setIsDeleteModalVisible(false);
            setLoading(false);
        }, 500);
    };

    return (
        <div>
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                    Thêm phòng mới
                </Button>
            </div>
            <Table columns={columns} dataSource={rooms} loading={loading} rowKey="id" />

            <Modal
                title={editingRoom ? "Sửa phòng" : "Thêm phòng mới"}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <RoomForm
                    onCancel={handleCancel}
                    onSubmit={handleFormSubmit}
                    initialValues={editingRoom}
                    loading={loading}
                />
            </Modal>

            <DeleteConfirm
                visible={isDeleteModalVisible}
                onConfirm={confirmDeleteRoom}
                onCancel={handleDeleteCancel}
                itemName="phòng"
                loading={loading}
            />
        </div>
    );
};

export default RoomList;