import React, { useState, useEffect, useCallback } from 'react';
import { Button, Space, Image, Tag, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import RoomForm from '@/pages/admin/Room/Form';
import Notification from '@/components/Notification';
import AdminTable from '@/components/AdminTable';
import roomService from '@/services/rooms/roomService';
import { Room, RoomType } from '@/types/room';
import type { TableColumnsType } from 'antd';
import { Message } from '@/types/message';

const RoomList: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [message, setMessage] = useState<Message | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalRooms, setTotalRooms] = useState<number>(0);

    const fetchRooms = useCallback(async () => {
        setLoading(true);
        try {
            const data = await roomService.getAllRooms({ page: currentPage, pageSize: pageSize });
            setRooms(data.rooms as Room[]);
            setTotalRooms(data.total ?? 0);
            setPageSize(data.pageSize ?? 10);
        } catch (error) {
            console.error("Error when fetch rooms:", error);
            setMessage({ type: 'error', text: 'Tải danh sách phòng thất bại.' });
            setRooms([]);
            setTotalRooms(0);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize]);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    const showModal = () => {
        setIsModalVisible(true);
        setEditingRoom(null);
    };

    const handleEdit = (room: Room) => {
        setIsModalVisible(true);
        setEditingRoom(room);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingRoom(null);
    };

    const handleFormSubmit = async (
        isLoadingFromChild: boolean,
        data: Room | null,
        error?: unknown
    ) => {
        setLoading(isLoadingFromChild);
        
        if (error) {
            const errorMessage = typeof error === 'string' ? error : 
                (editingRoom ? 'Cập nhật phòng thất bại.' : 'Thêm phòng thất bại.');
            setMessage({ type: 'error', text: errorMessage });
            return;
        }
        
        if (!isLoadingFromChild && data) {
            setMessage({ 
                type: 'success', 
                text: editingRoom ? 'Phòng đã được cập nhật thành công!' : 'Phòng đã được thêm thành công!' 
            });
            setEditingRoom(null);
            setIsModalVisible(false);
            fetchRooms();
        }
    };

    const handleDelete = async (roomId: string) => {
        setLoading(true);
        try {
            await roomService.deleteRoom(roomId);
            setMessage({ type: 'success', text: 'Phòng đã được xóa thành công!' });
            fetchRooms();
        } catch (error) {
            console.error("Error delete room:", error);
            setMessage({ type: 'error', text: 'Xóa phòng thất bại.' });
        } finally {
            setLoading(false);
        }
    };

    const getRoomTypeColor = (type: RoomType) => {
        switch (type) {
            case RoomType.SINGLE:
                return 'blue';
            case RoomType.DOUBLE:
                return 'green';
            case RoomType.SUITE:
                return 'purple';
            default:
                return 'default';
        }
    };

    const columns: TableColumnsType<Room> = [
        {
            title: 'Hình ảnh',
            dataIndex: 'images',
            key: 'images',
            width: 120,
            render: (images: Array<{id: string, path: string}>, room: Room) => (
                <Image
                    width={80}
                    height={60}
                    src={images && images.length > 0 ? `http://localhost:3000/${images[0].path}` : '/placeholder-image.jpg'}
                    alt={`Ảnh phòng ${room.name}`}
                    style={{ objectFit: 'cover', borderRadius: '6px' }}
                    preview={{
                        mask: <EyeOutlined style={{ fontSize: '18px' }} />
                    }}
                />
            ),
        },
        {
            title: 'Tên phòng',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            width: 250,
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Loại phòng',
            dataIndex: 'roomType',
            key: 'roomType',
            render: (type: RoomType) => (
                <Tag color={getRoomTypeColor(type)}>{type}</Tag>
            ),
            width: 120,
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            sorter: (a, b) => (a.price || 0) - (b.price || 0),
            render: (price: number) => `${price.toLocaleString('vi-VN')}đ/đêm`,
            width: 150,
        },
        {
            title: 'Số người',
            dataIndex: 'maxGuests',
            key: 'maxGuests',
            align: 'center',
            width: 100,
            sorter: (a, b) => (a.maxGuests || 0) - (b.maxGuests || 0),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
            width: 100,
            sorter: (a, b) => (a.quantity || 0) - (b.quantity || 0),
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, room) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(room)}
                        size="small"
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xóa phòng"
                        description="Bạn có chắc chắn muốn xóa phòng này?"
                        onConfirm={() => handleDelete(room.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
            width: 150,
        },
    ];

    return (
        <>
            <Notification
                message={message}
                onClose={() => setMessage(null)}
            />
            
            <AdminTable<Room>
                title="Quản lý phòng"
                onAdd={showModal}
                addButtonText="Thêm phòng mới"
                columns={columns}
                dataSource={rooms}
                loading={loading}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalRooms,
                    showSizeChanger: true,
                    showQuickJumper: false,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} phòng`,
                    onChange: (page, size) => {
                        setCurrentPage(page);
                        if (size && size !== pageSize) {
                            setPageSize(size);
                            setCurrentPage(1);
                        }
                    },
                }}
                rowKey="id"
                scroll={{ x: 1000 }}
            />

            <RoomForm
                visible={isModalVisible}
                onCancel={handleCancel}
                onSubmit={handleFormSubmit}
                initialValues={editingRoom ?? undefined}
                loading={loading}
            />
        </>
    );
};

export default RoomList;
