import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spin, Empty, Modal, Input, Alert, Tag, Divider } from 'antd';
import {
    ArrowLeftOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import bookingService from '@/services/bookings/bookingService';
import Notification from '@/components/Notification';
import { Booking, BookingStatus, PaymentMethod } from '@/types/booking';
import { Message } from '@/types/message';
import { COLORS } from '@/config/constants';
import { calculateCancellationFee } from '@/utils/cancellationHelper';
import { formatPrice } from '@/utils/formatPrice';
import { getStatusText, getStatusColor, getPaymentStatusText, getPaymentStatusColor } from '@/pages/user/UserBookings';

const { TextArea } = Input;

const getPaymentMethodText = (method: PaymentMethod) => {
    switch (method) {
        case PaymentMethod.ONLINE:
            return 'Thanh toán online';
        case PaymentMethod.ONSITE:
            return 'Thanh toán tại quầy';
        default:
            return method;
    }
};

const UserBookingDetail: React.FC = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const navigate = useNavigate();

    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<Message | null>(null);
    const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
    const [cancellationReason, setCancellationReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchBookingDetail = async () => {
            setLoading(true);
            try {
                if (bookingId) {
                    const data = await bookingService.getBookingById(bookingId);
                    setBooking(data);
                }
            } catch (error) {
                console.error('Error fetching booking detail:', error);
                setMessage({ type: 'error', text: 'Tải chi tiết đặt phòng thất bại.' });
            } finally {
                setLoading(false);
            }
        };

        if (bookingId) {
            fetchBookingDetail();
        }
    }, [bookingId]);

    const handleCancelClick = () => {
        if (!booking) return;

        const cancellationInfo = calculateCancellationFee(booking);

        if (!cancellationInfo.canCancel) {
            Modal.warning({
                title: 'Không thể hủy',
                content: cancellationInfo.reason,
                icon: <ExclamationCircleOutlined />,
            });
            return;
        }

        setIsCancelModalVisible(true);
    };

    const handleConfirmCancel = async () => {
        if (!bookingId) return;

        setSubmitting(true);
        try {
            const { booking: cancelledBooking, cancellationInfo } = await bookingService.cancelBooking({
                bookingId,
                cancellationReason: cancellationReason.trim() || undefined,
            });

            setBooking(cancelledBooking);
            setIsCancelModalVisible(false);
            setCancellationReason('');

            const refundText =
                cancellationInfo.refundAmount > 0
                    ? ` Hoàn tiền: ${formatPrice(cancellationInfo.refundAmount)}`
                    : '';

            setMessage({
                type: 'success',
                text: `Đã hủy đơn đặt phòng thành công! Phí hủy: ${cancellationInfo.feePercentage}%.${refundText}`,
            });
        } catch (error) {
            console.error('Error cancelling booking:', error);
            setMessage({
                type: 'error',
                text: 'Hủy đơn thất bại. Vui lòng thử lại sau.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoBack = () => {
        navigate('/user/bookings');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" tip="Đang tải..." />
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white p-6 rounded-lg">
                    <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleGoBack} className="mb-4">
                        Quay lại
                    </Button>
                    <Empty description="Không tìm thấy đặt phòng" />
                </div>
            </div>
        );
    }

    const cancellationInfo = calculateCancellationFee(booking);

    // Check if can show cancel button
    // Set check-in time to 14:00 of the check-in date
    const checkInDateTime = new Date(booking.checkIn);
    checkInDateTime.setHours(14, 0, 0, 0);
    const now = new Date();
    const isBeforeCheckIn = now < checkInDateTime;

    const canShowCancelButton =
        booking.status !== BookingStatus.CANCELLED &&
        booking.status !== BookingStatus.REJECTED &&
        booking.status !== BookingStatus.CHECKED_OUT &&
        isBeforeCheckIn;

    return (
        <>
            <Notification message={message} onClose={() => setMessage(null)} />

            <div className="min-h-screen bg-gray-50 pb-8">
                {/* Header Bar */}
                <div className="">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <Button
                                type="text"
                                icon={<ArrowLeftOutlined />}
                                onClick={handleGoBack}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                Quay lại
                            </Button>
                            {canShowCancelButton && (
                                <Button type="primary" danger icon={<CloseCircleOutlined />} onClick={handleCancelClick}>
                                    Hủy đơn
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-6">
                    {/* Status Banner */}
                    <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <p
                                        className="text-2xl font-bold"
                                        style={{
                                            color: COLORS.gray[900],
                                            marginBottom: 0,
                                        }}
                                    >
                                        Đơn đặt phòng {booking.id}
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Tag color={getStatusColor(booking.status)} className="text-sm px-3 py-1">
                                        {getStatusText(booking.status)}
                                    </Tag>
                                    <Tag
                                        color={getPaymentStatusColor(booking.paymentStatus)}
                                        className="text-sm px-3 py-1"
                                    >
                                        {getPaymentStatusText(booking.paymentStatus)}
                                    </Tag>
                                </div>
                            </div>
                            <div className="text-left sm:text-right">
                                <div className="text-sm text-gray-500">Ngày đặt</div>
                                <div className="text-base font-medium text-gray-900">
                                    {booking.createdAt ? moment(booking.createdAt).format('DD/MM/YYYY HH:mm') : '-'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Main Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Room Info Card */}
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <p
                                            className="text-xl font-semibold text-gray-900"
                                            style={{
                                                marginBottom: 0
                                            }}
                                        >
                                            Thông tin phòng
                                        </p>
                                    </div>

                                    {booking.snapshot && (
                                        <>
                                            <div className="mb-4">
                                                <div className="text-sm text-gray-500">Tên phòng</div>
                                                <p
                                                    className="text-lg font-semibold text-gray-900 mb-1"
                                                    style={{
                                                        marginBottom: 0
                                                    }}
                                                >
                                                    {booking.snapshot.room.name}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-1">
                                                        <div className="text-sm text-gray-500 mb-1">Ngày nhận phòng</div>
                                                        <div className="font-medium text-gray-900">
                                                            {moment(booking.checkIn).format('DD/MM/YYYY')}
                                                        </div>
                                                        <div className="text-xs text-gray-500">Từ 14:00</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <div className="flex-1">
                                                        <div className="text-sm text-gray-500 mb-1">Ngày trả phòng</div>
                                                        <div className="font-medium text-gray-900">
                                                            {moment(booking.checkOut).format('DD/MM/YYYY')}
                                                        </div>
                                                        <div className="text-xs text-gray-500">Trước 12:00</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-500">Số đêm:</span>
                                                    <span className="ml-2 font-medium text-gray-900">
                                                        {moment(booking.checkOut).diff(moment(booking.checkIn), 'days')} đêm
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Số phòng:</span>
                                                    <span className="ml-2 font-medium text-gray-900">{booking.quantity}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Người lớn:</span>
                                                    <span className="ml-2 font-medium text-gray-900">{booking.guests.adults}</span>
                                                </div>
                                                {booking.guests.children !== undefined && booking.guests.children > 0 && (
                                                    <div>
                                                        <span className="text-gray-500">Trẻ em:</span>
                                                        <span className="ml-2 font-medium text-gray-900">
                                                            {booking.guests.children}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Customer Info Card */}
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <p 
                                            className="text-xl font-semibold text-gray-900"
                                            style={{
                                                marginBottom: 0
                                            }}
                                        >
                                            Thông tin khách hàng
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div>
                                                <div className="text-sm text-gray-500">Họ và tên</div>
                                                <div className="font-medium text-gray-900">
                                                    {booking.firstName} {booking.lastName}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div>
                                                <div className="text-sm text-gray-500">Email</div>
                                                <div className="font-medium text-gray-900">{booking.email}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div>
                                                <div className="text-sm text-gray-500">Số điện thoại</div>
                                                <div className="font-medium text-gray-900">{booking.phoneNumber}</div>
                                            </div>
                                        </div>

                                        {booking.note && (
                                            <div className="flex items-start gap-3">
                                                <div>
                                                    <div className="text-sm text-gray-500">Ghi chú</div>
                                                    <div className="text-gray-900">{booking.note}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Cancellation Info */}
                            {booking.status === BookingStatus.CANCELLED && booking.cancellationReason && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <ExclamationCircleOutlined className="text-red-500 text-lg mt-1" />
                                        <div>
                                            <div className="font-semibold text-red-700 mb-1">Lý do hủy đơn</div>
                                            <div className="text-red-600 text-sm">{booking.cancellationReason}</div>
                                            {booking.cancelledAt && (
                                                <div className="text-red-500 text-xs mt-2">
                                                    Hủy lúc: {moment(booking.cancelledAt).format('DD/MM/YYYY HH:mm')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Price & Payment */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Price Summary Card */}
                                <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <p 
                                            className="text-lg font-semibold text-gray-900"
                                            style={{
                                                marginBottom: 0
                                            }}
                                        >
                                            Chi tiết giá
                                        </p>
                                    </div>

                                    <div className="p-6">
                                        {booking.snapshot && (
                                            <>
                                                {/* Daily Rates */}
                                                {booking.snapshot.dailyRates && booking.snapshot.dailyRates.length > 0 && (
                                                    <div className="mb-4">
                                                        <div className="text-sm font-medium text-gray-700 mb-2">
                                                            Giá phòng theo ngày
                                                        </div>
                                                        <div className="space-y-2">
                                                            {booking.snapshot.dailyRates.map((rate, index) => (
                                                                <div key={index} className="flex justify-between text-sm">
                                                                    <span className="text-gray-600">
                                                                        {moment(rate.date).format('DD/MM/YYYY')}
                                                                    </span>
                                                                    <span className="font-medium text-gray-900">
                                                                        {formatPrice(rate.price)}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <Divider className="my-4" />

                                                {/* Celebrate Items */}
                                                {booking.snapshot.celebrateItems &&
                                                    booking.snapshot.celebrateItems.length > 0 && (
                                                        <div className="">
                                                            <div className="text-sm font-medium text-gray-700 mb-2">
                                                                Giá quà kỷ niệm
                                                            </div>
                                                            <div className="space-y-2">
                                                                {booking.snapshot.celebrateItems.map((item, index) => (
                                                                    <div key={index} className="text-sm">
                                                                        <div className="flex justify-between">
                                                                            <span className="text-gray-600">
                                                                                {item.name} x{item.quantity}
                                                                            </span>
                                                                            <span className="font-medium text-gray-900">
                                                                                {formatPrice(item.subtotal)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                <Divider className="my-4" />

                                                {/* Summary */}
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Tổng tiền phòng</span>
                                                        <span className="font-medium text-gray-900">
                                                            {formatPrice(booking.snapshot.pricing?.roomSubtotal || 0)}
                                                        </span>
                                                    </div>
                                                    {booking.snapshot.pricing?.celebrateItemsSubtotal > 0 && (
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600">Tổng tiền quà kỷ niệm</span>
                                                            <span className="font-medium text-gray-900">
                                                                {formatPrice(booking.snapshot.pricing.celebrateItemsSubtotal)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <Divider className="my-4" />

                                                <div className="flex justify-between items-center">
                                                    <span className="text-lg font-semibold text-gray-900">Tổng thanh toán</span>
                                                    <span
                                                        className="text-2xl font-bold"
                                                        style={{ color: COLORS.primary }}
                                                    >
                                                        {formatPrice(booking.totalPrice)}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Payment Info Card */}
                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <p
                                                className="text-lg font-semibold text-gray-900"
                                                style={{
                                                    marginBottom: 0
                                                }}
                                            >
                                                Thanh toán
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Phương thức</span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {getPaymentMethodText(booking.paymentMethod)}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Trạng thái</span>
                                                <Tag
                                                    color={getPaymentStatusColor(booking.paymentStatus)}
                                                    className="text-sm"
                                                >
                                                    {getPaymentStatusText(booking.paymentStatus)}
                                                </Tag>
                                            </div>

                                            {booking.paymentDetails && (
                                                <>
                                                    {booking.paymentDetails.gateway && (
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-gray-600">Cổng thanh toán</span>
                                                            <span className="text-sm font-medium text-gray-900">
                                                                {booking.paymentDetails.gateway.toUpperCase()}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {booking.paymentDetails.transactionId && (
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-gray-600">Mã GD</span>
                                                            <span className="text-sm font-medium text-gray-900 font-mono">
                                                                {booking.paymentDetails.transactionId}
                                                            </span>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Timeline */}
                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <p 
                                                className="text-lg font-semibold text-gray-900"
                                                style={{
                                                    marginBottom: 0
                                                }}
                                            >
                                                Tiến độ đơn đặt phòng
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            {booking.createdAt && (
                                                <div className="flex items-start gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">Đặt phòng</div>
                                                        <div className="text-xs text-gray-500">
                                                            {moment(booking.createdAt).format('DD/MM/YYYY HH:mm')}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {booking.confirmedAt && (
                                                <div className="flex items-start gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">Xác nhận</div>
                                                        <div className="text-xs text-gray-500">
                                                            {moment(booking.confirmedAt).format('DD/MM/YYYY HH:mm')}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {booking.checkedInAt && (
                                                <div className="flex items-start gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">Nhận phòng</div>
                                                        <div className="text-xs text-gray-500">
                                                            {moment(booking.checkedInAt).format('DD/MM/YYYY HH:mm')}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {booking.checkedOutAt && (
                                                <div className="flex items-start gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-gray-500 mt-2"></div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">Trả phòng</div>
                                                        <div className="text-xs text-gray-500">
                                                            {moment(booking.checkedOutAt).format('DD/MM/YYYY HH:mm')}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {booking.cancelledAt && (
                                                <div className="flex items-start gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">Đã hủy</div>
                                                        <div className="text-xs text-gray-500">
                                                            {moment(booking.cancelledAt).format('DD/MM/YYYY HH:mm')}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancel Modal */}
            <Modal
                title="Xác nhận hủy đơn đặt phòng"
                open={isCancelModalVisible}
                onOk={handleConfirmCancel}
                onCancel={() => {
                    setIsCancelModalVisible(false);
                    setCancellationReason('');
                }}
                confirmLoading={submitting}
                okText="Xác nhận hủy"
                cancelText="Đóng"
                okButtonProps={{ danger: true }}
                width={600}
            >
                <div style={{ marginBottom: '20px' }}>
                    <Alert
                        message="Thông tin phí hủy"
                        description={
                            <div>
                                <p>
                                    <strong>Thời gian hủy:</strong>{' '}
                                    {cancellationInfo.hoursBeforeCheckIn < 24
                                        ? `${Math.floor(cancellationInfo.hoursBeforeCheckIn)} giờ trước ngày nhận phòng`
                                        : `${cancellationInfo.daysBeforeCheckIn} ngày trước ngày nhận phòng`}
                                </p>
                                <p>
                                    <strong>Phí hủy:</strong> {cancellationInfo.feePercentage}% ={' '}
                                    {formatPrice(cancellationInfo.fee)}
                                </p>
                                <p>
                                    <strong>Số tiền hoàn lại:</strong> {formatPrice(cancellationInfo.refundAmount)}
                                </p>
                            </div>
                        }
                        type="warning"
                        showIcon
                        icon={<ExclamationCircleOutlined />}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                        Lý do hủy (tùy chọn):
                    </label>
                    <TextArea
                        rows={4}
                        value={cancellationReason}
                        onChange={(e) => setCancellationReason(e.target.value)}
                        placeholder="Nhập lý do hủy đơn đặt phòng..."
                        maxLength={500}
                        showCount
                    />
                </div>

                <div style={{ marginTop: '20px' }}>
                    <Alert
                        message="Chính sách hủy phòng"
                        description={
                            <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                                <li>
                                    Hủy trước 7 ngày: <strong>Miễn phí</strong>
                                </li>
                                <li>
                                    Hủy từ 3-7 ngày trước: <strong>20% phí</strong>
                                </li>
                                <li>
                                    Hủy từ 1-3 ngày trước: <strong>50% phí</strong>
                                </li>
                                <li>
                                    Hủy trong vòng 24 giờ: <strong>100% phí</strong>
                                </li>
                            </ul>
                        }
                        type="info"
                        showIcon
                    />
                </div>
            </Modal>
        </>
    );
};

export default UserBookingDetail;
