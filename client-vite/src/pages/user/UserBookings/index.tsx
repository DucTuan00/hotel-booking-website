import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Empty, Spin, Tag, Pagination, Button, Input, Select, Space, Modal, Radio, Alert } from 'antd';
import {
    CalendarOutlined,
    UserOutlined,
    EyeOutlined,
    SearchOutlined,
    CreditCardOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import bookingService from '@/services/bookings/bookingService';
import { createVNPayPaymentUrl } from '@/services/payment/vnpayService';
import { createMoMoPaymentUrl } from '@/services/payment/momoService';
import { Booking, BookingStatus, PaymentStatus, PaymentMethod } from '@/types/booking';
import Notification from '@/components/Notification';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Message } from '@/types/message';
import { COLORS, TYPOGRAPHY } from '@/config/constants';
import { getStatusColor, getStatusText, getPaymentStatusColor, getPaymentStatusText } from '@/utils/status';
import { formatPrice as formatPriceUtil } from '@/utils/formatPrice';

const { Option } = Select;

// Debounce hook
const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const debouncedCallback = useCallback((...args: any[]) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => callback(...args), delay);
    }, [callback, delay]);

    const cancel = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    return { debouncedCallback, cancel };
};

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
    const [debouncedSearchText, setDebouncedSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState<PaymentStatus | 'ALL'>('ALL');
    
    // Retry payment states
    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
    const [selectedGateway, setSelectedGateway] = useState<string>('vnpay');
    const [paymentBooking, setPaymentBooking] = useState<Booking | null>(null);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // Debounce search text with 500ms delay
    const { debouncedCallback: debouncedSearch } = useDebounce(
        (text: string) => {
            setDebouncedSearchText(text);
            setCurrentPage(1); // Reset to first page when searching
        },
        500
    );

    useEffect(() => {
        fetchUserBookings(currentPage);
    }, [currentPage, debouncedSearchText, statusFilter, paymentStatusFilter]);

    const fetchUserBookings = async (page: number) => {
        try {
            setLoading(true);
            
            // Build query params
            const params: any = { 
                page, 
                pageSize 
            };
            
            // Add search if not empty
            if (debouncedSearchText.trim()) {
                params.search = debouncedSearchText.trim();
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

    const canRetryPayment = (booking: Booking) => {
        return (
            booking.paymentMethod === PaymentMethod.ONLINE &&
            booking.paymentStatus === PaymentStatus.UNPAID &&
            booking.status === BookingStatus.PENDING
        );
    };

    const handleOpenPaymentModal = (booking: Booking) => {
        setPaymentBooking(booking);
        const previousGateway = booking.paymentDetails?.gateway;
        if (previousGateway === 'vnpay' || previousGateway === 'momo') {
            setSelectedGateway(previousGateway);
        } else {
            setSelectedGateway('vnpay');
        }
        setIsPaymentModalVisible(true);
    };

    const handleRetryPayment = async () => {
        if (!paymentBooking) return;

        setIsProcessingPayment(true);
        setIsPaymentModalVisible(false);
        try {
            if (selectedGateway === 'vnpay') {
                const paymentResponse = await createVNPayPaymentUrl({
                    bookingId: paymentBooking.id,
                    locale: 'vn',
                });
                window.location.href = paymentResponse.data.paymentUrl;
            } else if (selectedGateway === 'momo') {
                const paymentResponse = await createMoMoPaymentUrl({
                    bookingId: paymentBooking.id,
                });
                window.location.href = paymentResponse.data.payUrl;
            }
        } catch (error: any) {
            console.error('Error creating payment URL:', error);
            setMessage({
                type: 'error',
                text: error?.response?.data?.message || 'Không thể tạo link thanh toán. Vui lòng thử lại.',
            });
            setIsProcessingPayment(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchText(value);
        debouncedSearch(value);
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
        setDebouncedSearchText('');
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

    if (isProcessingPayment) {
        return (
            <LoadingSpinner 
                message="Đang chuyển đến cổng thanh toán..." 
                size="large"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(10px)'
                }}
            />
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
                                size="middle"
                                className="h-10"
                                placeholder="Tìm kiếm theo mã đơn"
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
                            <Empty description="Không có đơn đặt phòng nào" />
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
                                                        {booking.snapshot?.paymentOption?.type === 'deposit' && (
                                                            <div className="text-xs text-right mt-1" style={{ color: '#d97706' }}>
                                                                Đặt cọc {booking.snapshot.paymentOption.depositPercent}%
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex justify-end gap-2">
                                                    {canRetryPayment(booking) && (
                                                        <Button
                                                            icon={<CreditCardOutlined />}
                                                            onClick={() => handleOpenPaymentModal(booking)}
                                                            style={{
                                                                backgroundColor: '#52c41a',
                                                                borderColor: '#52c41a',
                                                                color: '#fff',
                                                            }}
                                                        >
                                                            Thanh toán
                                                        </Button>
                                                    )}
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

            {/* Retry Payment Modal */}
            <Modal
                title="Thanh toán đơn đặt phòng"
                open={isPaymentModalVisible}
                onOk={handleRetryPayment}
                onCancel={() => setIsPaymentModalVisible(false)}
                okText="Thanh toán ngay"
                cancelText="Đóng"
                okButtonProps={{
                    style: { backgroundColor: '#52c41a', borderColor: '#52c41a' },
                    icon: <CreditCardOutlined />,
                }}
                width={500}
            >
                <div className="py-4">
                    <Alert
                        message="Đơn đặt phòng chưa được thanh toán"
                        description="Vui lòng chọn cổng thanh toán và tiến hành thanh toán để hoàn tất đơn đặt phòng."
                        type="warning"
                        showIcon
                        className="!mb-4"
                    />

                    {paymentBooking && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Mã đơn:</span>
                                <span className="font-medium text-gray-900 font-mono">{paymentBooking.id}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Phòng:</span>
                                <span className="font-medium text-gray-900">{paymentBooking.snapshot?.room?.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Số tiền:</span>
                                <span className="font-bold" style={{ color: COLORS.primary }}>
                                    {formatPriceUtil(
                                        paymentBooking.snapshot?.paymentOption?.type === 'deposit'
                                            ? paymentBooking.snapshot.paymentOption.depositAmount
                                            : paymentBooking.totalPrice
                                    )}
                                </span>
                            </div>
                            {paymentBooking.snapshot?.paymentOption?.type === 'deposit' && (
                                <div className="text-xs text-orange-600 mt-1 text-right">
                                    (Đặt cọc {paymentBooking.snapshot.paymentOption.depositPercent}%)
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mb-2">
                        <div className="text-sm font-medium text-gray-700 mb-3">Chọn cổng thanh toán</div>
                        <Radio.Group
                            value={selectedGateway}
                            onChange={(e) => setSelectedGateway(e.target.value)}
                            className="w-full"
                        >
                            <div className="grid grid-cols-2 gap-3">
                                <div className={`border rounded-lg transition-colors cursor-pointer ${selectedGateway === 'vnpay' ? 'border-[#D4902A] bg-orange-50' : 'border-gray-200 hover:border-[#D4902A]'}`}>
                                    <Radio value="vnpay" className="!ml-4 w-full">
                                        <div className="flex items-center justify-center gap-2 p-4 cursor-pointer w-full">
                                            <img 
                                                src="/images/vnpay.png" 
                                                alt="VNPay"
                                                className="w-12 h-12 object-contain"
                                            />
                                            <span className="font-medium">VNPAY</span>
                                        </div>
                                    </Radio>
                                </div>
                                <div className={`border rounded-lg transition-colors cursor-pointer ${selectedGateway === 'momo' ? 'border-[#D4902A] bg-orange-50' : 'border-gray-200 hover:border-[#D4902A]'}`}>
                                    <Radio value="momo" className="!ml-4 w-full">
                                        <div className="flex items-center justify-center gap-2 p-4 cursor-pointer w-full">
                                            <img 
                                                src="/images/momo.png" 
                                                alt="MoMo"
                                                className="w-12 h-12 object-contain"
                                            />
                                            <span className="font-medium">MOMO</span>
                                        </div>
                                    </Radio>
                                </div>
                            </div>
                        </Radio.Group>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default UserBookings;
