import React, { useState, useEffect } from 'react';
import { Card, Empty, Spin, Tag, Pagination, Button, Input, Select, Space } from 'antd';
import {
    CalendarOutlined,
    UserOutlined,
    EyeOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import bookingService from '@/services/bookings/bookingService';
import { Booking, BookingStatus, PaymentStatus } from '@/types/booking';
import Notification from '@/components/Notification';
import { Message } from '@/types/message';
import { COLORS, TYPOGRAPHY } from '@/config/constants';
import { getStatusColor, getStatusText, getPaymentStatusColor, getPaymentStatusText } from '@/utils/status';

const { Option } = Select;

const UserBookings: React.FC = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<Message | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const pageSize = 5;
    
    // Search and filter states
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState<PaymentStatus | 'ALL'>('ALL');

    useEffect(() => {
        fetchUserBookings(currentPage);
    }, [currentPage, searchText, statusFilter, paymentStatusFilter]);

    const fetchUserBookings = async (page: number) => {
        try {
            setLoading(true);
            
            // Build query params
            const params: any = { 
                page, 
                pageSize 
            };
            
            // Add search if not empty
            if (searchText.trim()) {
                params.search = searchText.trim();
            }
            
            // Add status filter if not ALL
            if (statusFilter !== 'ALL') {
                params.status = statusFilter;
            }
            
            // Add payment status filter if not ALL
            if (paymentStatusFilter !== 'ALL') {
                params.paymentStatus = paymentStatusFilter;
            }
            
            const data = await bookingService.getUserBookings(params);
            setBookings(data.bookings);
            setTotal(data.total || 0);
        } catch (error) {
            console.error('Error fetching user bookings:', error);
            setMessage({ type: 'error', text: 'Không thể tải danh sách đơn đặt phòng' });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const getRoomName = (booking: Booking) => {
        if (booking.snapshot?.room?.name) {
            return booking.snapshot.room.name;
        }
        return '';
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleStatusFilterChange = (value: BookingStatus | 'ALL') => {
        setStatusFilter(value);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const handlePaymentStatusFilterChange = (value: PaymentStatus | 'ALL') => {
        setPaymentStatusFilter(value);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const handleClearFilters = () => {
        setSearchText('');
        setStatusFilter('ALL');
        setPaymentStatusFilter('ALL');
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" tip="Đang tải..." />
            </div>
        );
    }

    return (
        <>
            <Notification message={message} onClose={() => setMessage(null)} />

            <div className="bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1
                            className="text-3xl font-bold mb-2"
                            style={{
                                fontFamily: TYPOGRAPHY.fontFamily.primary,
                                color: COLORS.primary,
                            }}
                        >
                            Lịch sử đặt phòng
                        </h1>
                        <p className="text-gray-600">Quản lý tất cả đơn đặt phòng của bạn</p>
                    </div>

                    {/* Search and Filter Section */}
                    <Card 
                        className="mb-4" 
                        style={{ 
                            borderRadius: '8px',
                            marginBottom: '14px', 
                        }}
                    >
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            {/* Search Input */}
                            <Input
                                size="large"
                                placeholder="Tìm kiếm theo mã đơn hoặc tên phòng..."
                                prefix={<SearchOutlined style={{ color: COLORS.gray[400] }} />}
                                value={searchText}
                                onChange={handleSearchChange}
                                allowClear
                            />
                            
                            {/* Filter Row */}
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                <Space wrap>
                                    {/* Booking Status Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Trạng thái đơn
                                        </label>
                                        <Select
                                            size="large"
                                            value={statusFilter}
                                            onChange={handleStatusFilterChange}
                                            className="w-48"
                                        >
                                            <Option value="ALL">Tất cả</Option>
                                            <Option value={BookingStatus.PENDING}>
                                                {getStatusText(BookingStatus.PENDING)}
                                            </Option>
                                            <Option value={BookingStatus.CONFIRMED}>
                                                {getStatusText(BookingStatus.CONFIRMED)}
                                            </Option>
                                            <Option value={BookingStatus.CHECKED_IN}>
                                                {getStatusText(BookingStatus.CHECKED_IN)}
                                            </Option>
                                            <Option value={BookingStatus.CHECKED_OUT}>
                                                {getStatusText(BookingStatus.CHECKED_OUT)}
                                            </Option>
                                            <Option value={BookingStatus.CANCELLED}>
                                                {getStatusText(BookingStatus.CANCELLED)}
                                            </Option>
                                            <Option value={BookingStatus.REJECTED}>
                                                {getStatusText(BookingStatus.REJECTED)}
                                            </Option>
                                        </Select>
                                    </div>

                                    {/* Payment Status Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Trạng thái thanh toán
                                        </label>
                                        <Select
                                            size="large"
                                            value={paymentStatusFilter}
                                            onChange={handlePaymentStatusFilterChange}
                                            className="w-48"
                                        >
                                            <Option value="ALL">Tất cả</Option>
                                            <Option value={PaymentStatus.PAID}>
                                                {getPaymentStatusText(PaymentStatus.PAID)}
                                            </Option>
                                            <Option value={PaymentStatus.UNPAID}>
                                                {getPaymentStatusText(PaymentStatus.UNPAID)}
                                            </Option>
                                            <Option value={PaymentStatus.REFUNDED}>
                                                {getPaymentStatusText(PaymentStatus.REFUNDED)}
                                            </Option>
                                        </Select>
                                    </div>
                                </Space>

                                {/* Clear Filters Button */}
                                {(searchText || statusFilter !== 'ALL' || paymentStatusFilter !== 'ALL') && (
                                    <Button onClick={handleClearFilters}>
                                        Xóa bộ lọc
                                    </Button>
                                )}
                            </div>

                            {/* Result Count */}
                            <div className="text-sm text-gray-600">
                                Hiển thị {bookings.length} / {total} đơn đặt phòng
                            </div>
                        </Space>
                    </Card>

                    {bookings.length === 0 ? (
                        <Card>
                            <Empty description="Bạn chưa có đơn đặt phòng nào" />
                        </Card>
                    ) : (
                        <>
                            <div className="flex flex-col gap-4">
                                {bookings.map((booking) => (
                                    <Card
                                        key={booking.id}
                                        className=""
                                        style={{ borderRadius: '8px' }}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                            {/* Left Column - Booking Info (8 columns on desktop) */}
                                            <div className="md:col-span-8 space-y-4">
                                                {/* Status Tags */}
                                                <div className="flex items-center gap-2">
                                                    <Tag 
                                                        color={getStatusColor(booking.status)}
                                                        className="!text-base"
                                                    >
                                                        {getStatusText(booking.status)}
                                                    </Tag>
                                                    <Tag 
                                                        color={getPaymentStatusColor(booking.paymentStatus)}
                                                        className="!text-base"
                                                    >
                                                        {getPaymentStatusText(booking.paymentStatus)}
                                                    </Tag>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <div className="flex-1">
                                                        <div
                                                            className="font-semibold text-lg"
                                                            style={{ color: COLORS.gray[900] }}
                                                        >
                                                            Đơn đặt phòng {booking.id}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Room Info */}
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-1">
                                                        <div
                                                            className="font-semibold text-lg mb-1"
                                                            style={{ color: COLORS.gray[900] }}
                                                        >
                                                            {getRoomName(booking)}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Check-in/out Dates */}
                                                <div className="flex items-center gap-3 text-gray-700">
                                                    <CalendarOutlined style={{ fontSize: '16px' }} />
                                                    <span className="text-sm">
                                                        {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                                                    </span>
                                                </div>

                                                {/* Guests */}
                                                <div className="flex items-center gap-3 text-gray-700">
                                                    <UserOutlined style={{ fontSize: '16px' }} />
                                                    <span className="text-sm">
                                                        {booking.guests.adults} người lớn
                                                        {booking.guests.children ? `, ${booking.guests.children} trẻ em` : ''}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Right Column - Actions & Price (4 columns on desktop) */}
                                            <div className="md:col-span-4 flex flex-col justify-between gap-4">
                                                <div className="flex justify-end items-center gap-2">
                                                    <div>
                                                        <div className="text-xs text-gray-500 text-right">Tổng thanh toán</div>
                                                        <div
                                                            className="font-bold text-xl"
                                                            style={{ color: COLORS.primary }}
                                                        >
                                                            {formatPrice(booking.totalPrice)}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end">
                                                    <Button
                                                        type="primary"
                                                        icon={<EyeOutlined />}
                                                        onClick={() => navigate(`/user/bookings/${booking.id}`)}
                                                        style={{
                                                            backgroundColor: COLORS.primary,
                                                            borderColor: COLORS.primary,
                                                        }}
                                                    >
                                                        Xem chi tiết
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            {total > pageSize && (
                                <div className="flex justify-center mt-8">
                                    <Pagination
                                        current={currentPage}
                                        total={total}
                                        pageSize={pageSize}
                                        onChange={handlePageChange}
                                        showSizeChanger={false}
                                        showTotal={(total) => `Tổng ${total} đơn đặt phòng`}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default UserBookings;
