import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import BookingForm from './BookingForm';
import DeleteConfirm from '../Common/DeleteConfirm';
import moment from 'moment'; // Import momentjs để format ngày tháng

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [deleteBookingId, setDeleteBookingId] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

    // Dữ liệu mẫu booking (thay bằng API call sau)
    const dummyBookings = [
        { id: 1, userId: 1, roomId: 1, checkInDate: '2024-07-20', checkOutDate: '2024-07-25', numberOfGuests: 2, bookingStatus: 'Confirmed' },
        { id: 2, userId: 2, roomId: 2, checkInDate: '2024-08-10', checkOutDate: '2024-08-15', numberOfGuests: 3, bookingStatus: 'Pending' },
        // ... more dummy bookings
    ];

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setBookings(dummyBookings);
            setLoading(false);
        }, 500);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'User ID', dataIndex: 'userId', key: 'userId' },
        { title: 'Room ID', dataIndex: 'roomId', key: 'roomId' },
        {
            title: 'Ngày Check-in',
            dataIndex: 'checkInDate',
            key: 'checkInDate',
            render: (text) => moment(text).format('DD/MM/YYYY') // Format ngày tháng
        },
        {
            title: 'Ngày Check-out',
            dataIndex: 'checkOutDate',
            key: 'checkOutDate',
            render: (text) => moment(text).format('DD/MM/YYYY') // Format ngày tháng
        },
        { title: 'Số khách', dataIndex: 'numberOfGuests', key: 'numberOfGuests' },
        {
            title: 'Trạng thái',
            dataIndex: 'bookingStatus',
            key: 'bookingStatus',
            render: (status) => (
                status === 'Confirmed' ? <Tag color="green">Đã xác nhận</Tag> :
                    status === 'Pending' ? <Tag color="blue">Chờ xác nhận</Tag> :
                        <Tag color="red">Đã hủy</Tag>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small">Sửa</Button>
                    <Popconfirm
                        title="Bạn chắc chắn muốn xóa booking này?"
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
        setEditingBooking(null);
    };

    const handleEdit = (booking) => {
        setIsModalVisible(true);
        setEditingBooking(booking);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleFormSubmit = (values) => {
        setLoading(true);
        setTimeout(() => {
            if (editingBooking) {
                const updatedBookings = bookings.map(booking => booking.id === editingBooking.id ? { ...editingBooking, ...values } : booking);
                setBookings(updatedBookings);
                message.success('Booking đã được cập nhật thành công!');
            } else {
                const newBooking = { id: bookings.length + 1, ...values };
                setBookings([...bookings, newBooking]);
                message.success('Booking đã được thêm thành công!');
            }
            setIsModalVisible(false);
            setLoading(false);
        }, 500);
    };

    const handleDeleteConfirm = (bookingId) => {
        setDeleteBookingId(bookingId);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
    };

    const confirmDeleteBooking = () => {
        setLoading(true);
        setTimeout(() => {
            const updatedBookings = bookings.filter(booking => booking.id !== deleteBookingId);
            setBookings(updatedBookings);
            message.success('Booking đã được xóa thành công!');
            setIsDeleteModalVisible(false);
            setLoading(false);
        }, 500);
    };

    return (
        <div>
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                    Thêm Booking mới
                </Button>
            </div>
            <Table columns={columns} dataSource={bookings} loading={loading} rowKey="id" />

            <Modal
                title={editingBooking ? "Sửa Booking" : "Thêm Booking mới"}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <BookingForm
                    onCancel={handleCancel}
                    onSubmit={handleFormSubmit}
                    initialValues={editingBooking}
                    loading={loading}
                />
            </Modal>

            <DeleteConfirm
                visible={isDeleteModalVisible}
                onConfirm={confirmDeleteBooking}
                onCancel={handleDeleteCancel}
                itemName="booking"
                loading={loading}
            />
        </div>
    );
};

export default BookingList;