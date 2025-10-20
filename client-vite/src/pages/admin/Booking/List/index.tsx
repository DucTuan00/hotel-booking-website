import React, { useState, useEffect, useCallback } from 'react';
import { Tag, Button, Space, Tooltip } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import BookingForm from '@/pages/admin/Booking/Form';
import Notification from '@/components/Notification';
import AdminTable from '@/components/AdminTable';
import SearchTableAdmin, { SearchFilters } from '@/components/SearchTableAdmin';
import bookingService from '@/services/bookings/bookingService';
import moment from 'moment';
import { Booking, BookingStatus, PaymentStatus, PaymentMethod } from '@/types/booking';
import type { TableColumnsType } from 'antd';
import { Message } from '@/types/message';

// Helper to get name or id from user/room, always returns string  
const getName = (val: string | { name?: string } | null | undefined): string => {
  if (val && typeof val === 'object' && 'name' in val) {
    return val.name ?? '';
  }
  if (typeof val === 'string') {
    return val;
  }
  return '';
};

const BookingList: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
    const [message, setMessage] = useState<Message | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalBookings, setTotalBookings] = useState<number>(0);
    const [currentSearchParams, setCurrentSearchParams] = useState<any>({});

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = { 
                page: currentPage, 
                pageSize: pageSize,
                ...currentSearchParams
            };

            const data = await bookingService.getAllBookings(params);
            setBookings(data.bookings as Booking[]);
            setTotalBookings(data.total ?? 0);
            setPageSize(data.pageSize ?? 5);
        } catch (error) {
            console.error("Error when fetch bookings:", error);
            setMessage({ type: 'error', text: 'Tải danh sách đặt phòng thất bại.' });
            setBookings([]);
            setTotalBookings(0);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, currentSearchParams]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleSearch = (filters: SearchFilters) => {
        setCurrentPage(1); 
        
        if (!filters.searchText || !filters.searchText.trim()) {
            setCurrentSearchParams({});
            return;
        }
        
        const searchText = filters.searchText.trim();
        const searchParams: any = {
            search: searchText  
        };
        
        setCurrentSearchParams(searchParams);
    };

    const handleEdit = (booking: Booking) => {
        setIsModalVisible(true);
        setEditingBooking(booking);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingBooking(null);
    };

    const handleFormSubmit = async (
        isLoadingFromChild: boolean,
        data: Booking | null,
        error?: unknown
    ) => {
        setLoading(isLoadingFromChild);
        if (error) {
            setMessage({ type: 'error', text: editingBooking ? 'Cập nhật đặt phòng thất bại.' : 'Thêm đặt phòng thất bại.' });
            return;
        }
        if (!isLoadingFromChild && data) {
            setMessage({ type: 'success', text: editingBooking ? 'Cập nhật đơn đặt phòng thành công!' : 'Đặt phòng đã được thêm thành công!' });
            setEditingBooking(null);
            setIsModalVisible(false);
            fetchBookings();
        }
    };

    const getStatusColor = (status: BookingStatus) => {
        switch (status) {
            case BookingStatus.CONFIRMED:
                return 'success';
            case BookingStatus.PENDING:
                return 'warning';
            case BookingStatus.REJECTED:
                return 'error';
            case BookingStatus.CANCELLED:
                return 'default';
            case BookingStatus.CHECKED_IN:
                return 'processing';
            case BookingStatus.CHECKED_OUT:
                return 'blue';
            default:
                return 'default';
        }
    };

    const getStatusText = (status: BookingStatus) => {
        switch (status) {
            case BookingStatus.CONFIRMED:
                return 'Đã xác nhận';
            case BookingStatus.PENDING:
                return 'Chờ xác nhận';
            case BookingStatus.REJECTED:
                return 'Đã từ chối';
            case BookingStatus.CANCELLED:
                return 'Đã hủy';
            case BookingStatus.CHECKED_IN:
                return 'Đã check-in';
            case BookingStatus.CHECKED_OUT:
                return 'Đã check-out';
            default:
                return status;
        }
    };

    const getPaymentStatusColor = (status: PaymentStatus) => {
        switch (status) {
            case PaymentStatus.PAID:
                return 'success';
            case PaymentStatus.UNPAID:
                return 'warning';
            case PaymentStatus.REFUNDED:
                return 'default';
            default:
                return 'default';
        }
    };

    const getPaymentStatusText = (status: PaymentStatus) => {
        switch (status) {
            case PaymentStatus.PAID:
                return 'Đã thanh toán';
            case PaymentStatus.UNPAID:
                return 'Chưa thanh toán';
            case PaymentStatus.REFUNDED:
                return 'Đã hoàn tiền';
            default:
                return status;
        }
    };

    const getPaymentMethodText = (method: PaymentMethod) => {
        switch (method) {
            case PaymentMethod.ONLINE:
                return 'Online';
            case PaymentMethod.ONSITE:
                return 'Tại quầy';
            default:
                return method;
        }
    };

    const columns: TableColumnsType<Booking> = [
        {
            title: 'Mã đơn',
            dataIndex: 'id',
            key: 'id',
            width: 100,
            fixed: 'left',
            render: (id) => (
                <Tooltip title={id}>
                    <span>{id.substring(0, 8)}...</span>
                </Tooltip>
            ),
        },
        {
            title: 'Khách hàng',
            key: 'customer',
            width: 150,
            render: (_, booking) => (
                <div>
                    <div style={{ fontWeight: 500 }}>
                        {booking.firstName} {booking.lastName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                        {booking.email}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                        {booking.phoneNumber}
                    </div>
                </div>
            ),
        },
        {
            title: 'Tên phòng',
            dataIndex: 'roomId',
            key: 'roomId',
            width: 150,
            render: (roomId) => getName(roomId),
        },
        {
            title: 'Check-in',
            dataIndex: 'checkIn',
            key: 'checkIn',
            render: (date) => moment(date).format('DD/MM/YYYY'),
            width: 110,
        },
        {
            title: 'Check-out',
            dataIndex: 'checkOut',
            key: 'checkOut',
            render: (date) => moment(date).format('DD/MM/YYYY'),
            width: 110,
        },
        {
            title: 'SL phòng',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
            width: 90,
        },
        {
            title: 'Khách',
            key: 'guests',
            align: 'center',
            width: 90,
            render: (_, booking) => (
                <span>
                    {booking.guests.adults}N
                    {booking.guests.children ? ` / ${booking.guests.children}T` : ''}
                </span>
            ),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (price) => (
                <span style={{ fontWeight: 500 }}>
                    {price.toLocaleString('vi-VN')}đ
                </span>
            ),
            width: 130,
        },
        {
            title: 'Thanh toán',
            key: 'payment',
            width: 140,
            render: (_, booking) => (
                <div>
                    <Tag color={getPaymentStatusColor(booking.paymentStatus)}>
                        {getPaymentStatusText(booking.paymentStatus)}
                    </Tag>
                    <div style={{ fontSize: '12px', color: '#888', marginTop: 4 }}>
                        {getPaymentMethodText(booking.paymentMethod)}
                    </div>
                </div>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {getStatusText(status)}
                </Tag>
            ),
            width: 130,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => date ? moment(date).format('DD/MM/YYYY HH:mm') : '-',
            width: 140,
        },
        {
            title: 'Hành động',
            key: 'actions',
            fixed: 'right',
            width: 120,
            render: (_, booking) => (
                <Space>
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="link"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => handleEdit(booking)}
                        />
                    </Tooltip>
                    <Tooltip title="Cập nhật">
                        <Button
                            type="link"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(booking)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Notification
                message={message}
                onClose={() => setMessage(null)}
            />
            
            <SearchTableAdmin
                onSearch={handleSearch}
                placeholder="Tìm kiếm theo mã đơn..."
            />

            <AdminTable<Booking>
                title="Quản lý đặt phòng"
                showAddButton={false}
                columns={columns}
                dataSource={bookings}
                loading={loading}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalBookings,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} booking`,
                    onChange: (page, size) => {
                        setCurrentPage(page);
                        if (size && size !== pageSize) {
                            setPageSize(size);
                            setCurrentPage(1);
                        }
                    },
                }}
                rowKey="id"
                scroll={{ x: 1600 }}
            />

            <BookingForm
                visible={isModalVisible}
                onCancel={handleCancel}
                onSubmit={handleFormSubmit}
                initialValues={editingBooking ?? undefined}
                loading={loading}
            />
        </>
    );
};

export default BookingList;