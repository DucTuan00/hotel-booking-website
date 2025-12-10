import React, { useState, useEffect, useCallback } from 'react';
import { EyeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Notification from '@/components/Notification';
import AdminTable from '@/components/AdminTable';
import RestaurantBookingDetailModal from '@/pages/admin/Restaurant/Bookings/DetailModal';
import restaurantBookingService from '@/services/restaurants/restaurantBookingService';
import moment from 'moment';
import { RestaurantBooking } from '@/types/restaurant';
import { Message } from '@/types/message';

const RestaurantBookingList: React.FC = () => {
    const [bookings, setBookings] = useState<RestaurantBooking[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<Message | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalBookings, setTotalBookings] = useState<number>(0);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [selectedBooking, setSelectedBooking] = useState<RestaurantBooking | null>(null);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const data = await restaurantBookingService.getAllRestaurantBookings(currentPage, pageSize);
            setBookings(data.bookings);
            setTotalBookings(data.total);
            setPageSize(data.pageSize);
        } catch (error) {
            console.error("Error when fetch restaurant bookings:", error);
            setMessage({ type: 'error', text: 'Tải danh sách đặt bàn thất bại.' });
            setBookings([]);
            setTotalBookings(0);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleViewDetail = (booking: RestaurantBooking) => {
        setSelectedBooking(booking);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedBooking(null);
    };

    const columns = [
        {
            title: 'Mã đơn',
            dataIndex: 'id',
            key: 'id',
            width: 150,
            fixed: 'left' as const,
        },
        {
            title: 'Họ tên',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 150,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            width: 150,
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'bookingDate',
            key: 'bookingDate',
            width: 120,
            render: (date: Date) => moment(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'content',
            width: 220,
            ellipsis: true,
            render: (content?: string) =>
                content
                    ? <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', maxWidth: 220 }}>{content}</span>
                    : <span className="text-gray-400">Không có</span>,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 120,
            render: (date: Date) => moment(date).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 100,
            fixed: 'right' as const,
            render: (_: unknown, record: RestaurantBooking) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetail(record)}
                >
                    Xem
                </Button>
            ),
        },
    ];

    return (
        <div className="">
            {message && (
                <Notification
                    message={message}
                    onClose={() => setMessage(null)}
                />
            )}

            <AdminTable<RestaurantBooking>
                title="Quản lý đặt bàn nhà hàng"
                showAddButton={false}
                columns={columns}
                dataSource={bookings}
                loading={loading}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalBookings,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng ${total} đơn đặt bàn`,
                    onChange: (page, size) => {
                        setCurrentPage(page);
                        if (size && size !== pageSize) {
                            setPageSize(size);
                            setCurrentPage(1);
                        }
                    },
                }}
                rowKey="id"
            />

            <RestaurantBookingDetailModal
                visible={isModalVisible}
                onCancel={handleCloseModal}
                booking={selectedBooking}
            />
        </div>
    );
};

export default RestaurantBookingList;
