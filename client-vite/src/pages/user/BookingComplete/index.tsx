import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Spin } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { COLORS, TYPOGRAPHY } from '@/config/constants';
import { hasAuthToken } from '@/utils/auth';
import bookingService from '@/services/bookings/bookingService';
import { formatPrice } from '@/utils/formatPrice';

const BookingComplete: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isLoggedIn = hasAuthToken();

    // Query params from payment gateway redirect
    const success = searchParams.get('success');
    const message = searchParams.get('message');
    const bookingId = searchParams.get('bookingId');
    const isLoading = searchParams.get('loading') === 'true';

    // Local state
    const [checkingBooking, setCheckingBooking] = useState(false);
    const [bookingStatus, setBookingStatus] = useState<{
        status: string;
        paymentStatus: string;
        totalPrice: number;
        paymentOption?: { type: string; depositAmount?: number };
    } | null>(null);

    // Check booking status when we have a bookingId but no explicit success param
    // This handles the case when user returns from payment gateway without completing
    useEffect(() => {
        if (!bookingId || success !== null) return;

        const checkBookingStatus = async () => {
            setCheckingBooking(true);
            try {
                const booking = await bookingService.getBookingById(bookingId);
                setBookingStatus({
                    status: booking.status,
                    paymentStatus: booking.paymentStatus,
                    totalPrice: booking.totalPrice,
                    paymentOption: booking.snapshot?.paymentOption
                });
            } catch (error) {
                console.error('Error checking booking status:', error);
            } finally {
                setCheckingBooking(false);
            }
        };

        checkBookingStatus();
    }, [bookingId, success]);

    // Determine what to show based on params and booking status
    const getDisplayState = () => {
        // Case 1: Loading state from deep link handler
        if (isLoading) {
            return {
                type: 'loading' as const,
                title: 'Đang xử lý thanh toán...',
                description: 'Vui lòng chờ trong giây lát.',
                icon: <Spin size="large" />
            };
        }

        // Case 2: Explicit success
        if (success === 'true') {
            return {
                type: 'success' as const,
                title: 'Cảm ơn quý khách đã đặt phòng!',
                description: 'Chúng tôi đã nhận được yêu cầu đặt phòng của quý khách',
                icon: <CheckCircleOutlined style={{ fontSize: '64px', color: COLORS.primary }} />
            };
        }

        // Case 3: Explicit failure with message
        if (success === 'false' && message) {
            return {
                type: 'error' as const,
                title: 'Thanh toán không thành công',
                description: decodeURIComponent(message),
                icon: <ExclamationCircleOutlined style={{ fontSize: '64px', color: '#ff4d4f' }} />
            };
        }

        // Case 4: No params - user navigated directly here
        if (success === null && !bookingId) {
            return {
                type: 'info' as const,
                title: 'Không tìm thấy thông tin đặt phòng',
                description: 'Vui lòng kiểm tra lại đơn đặt phòng của bạn.',
                icon: <ExclamationCircleOutlined style={{ fontSize: '64px', color: '#faad14' }} />
            };
        }

        // Case 5: Have bookingId but no success param - check booking status
        if (bookingId && bookingStatus) {
            // Booking is paid and confirmed
            if (bookingStatus.paymentStatus === 'paid') {
                return {
                    type: 'success' as const,
                    title: 'Cảm ơn quý khách đã đặt phòng!',
                    description: 'Thanh toán của quý khách đã được xác nhận.',
                    icon: <CheckCircleOutlined style={{ fontSize: '64px', color: COLORS.primary }} />
                };
            }

            // Booking is pending/unpaid - user probably didn't complete payment
            if (bookingStatus.status === 'pending' && bookingStatus.paymentStatus === 'unpaid') {
                return {
                    type: 'pending' as const,
                    title: 'Đơn đặt phòng chưa thanh toán',
                    description: 'Bạn đã tạo đơn đặt phòng nhưng chưa hoàn tất thanh toán. Vui lòng thanh toán để hoàn tất đặt phòng.',
                    icon: <ClockCircleOutlined style={{ fontSize: '64px', color: '#faad14' }} />,
                    bookingId: bookingId,
                    totalPrice: bookingStatus.totalPrice,
                    depositAmount: bookingStatus.paymentOption?.type === 'deposit' 
                        ? bookingStatus.paymentOption.depositAmount 
                        : undefined
                };
            }

            // Other states
            return {
                type: 'info' as const,
                title: 'Thông tin đặt phòng',
                description: 'Vui lòng kiểm tra chi tiết đặt phòng.',
                icon: <ExclamationCircleOutlined style={{ fontSize: '64px', color: '#faad14' }} />
            };
        }

        // Default loading while checking
        return {
            type: 'loading' as const,
            title: 'Đang kiểm tra thông tin...',
            description: '',
            icon: <Spin size="large" />
        };
    };

    const displayState = getDisplayState();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-start justify-center py-8">
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px) blur(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) blur(0);
                    }
                }
                .fade-in-up {
                    animation: fadeInUp 1.5s ease-out forwards;
                }
            `}</style>
            <div 
                className={`max-w-2xl w-full px-4 fade-in-up`}
            >
                <div className=" overflow-hidden">

                    {/* Content */}
                    <div className="px-6 sm:px-8 py-12 sm:py-16 text-center">
                        {/* Icon */}
                        <div className="mb-8 flex justify-center">
                            <div 
                                className="rounded-full p-6"
                                style={{ 
                                    backgroundColor: displayState.type === 'loading' 
                                        ? '#f0f0f0' 
                                        : displayState.type === 'success'
                                            ? `${COLORS.primary}15`
                                            : displayState.type === 'error'
                                                ? '#fff1f0'
                                                : '#fffbe6'
                                }}
                            >
                                {displayState.icon}
                            </div>
                        </div>

                        {/* Main heading */}
                        <h1 
                            className="text-3xl sm:text-4xl font-bold mb-4"
                            style={{
                                fontFamily: TYPOGRAPHY.fontFamily.primary,
                                color: displayState.type === 'error' 
                                    ? '#ff4d4f' 
                                    : displayState.type === 'pending'
                                        ? '#faad14'
                                        : COLORS.primary
                            }}
                        >
                            {displayState.title}
                        </h1>

                        {/* Description */}
                        <div className="mb-8 space-y-4">
                            <p className="text-lg text-gray-600">
                                {displayState.description}
                            </p>

                            {/* Show booking details for pending payments */}
                            {displayState.type === 'pending' && displayState.bookingId && (
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mx-auto max-w-md">
                                    <div className="text-sm text-gray-600 mb-2">Mã đơn: <span className="font-mono font-medium">{displayState.bookingId}</span></div>
                                    <div className="text-sm text-gray-600">
                                        Số tiền: <span className="font-bold" style={{ color: COLORS.primary }}>
                                            {displayState.depositAmount 
                                                ? formatPrice(displayState.depositAmount) + ' (Đặt cọc)'
                                                : formatPrice(displayState.totalPrice || 0)
                                            }
                                        </span>
                                    </div>
                                </div>
                            )}

                            {!isLoggedIn && displayState.type === 'success' && (
                                <p className="text-sm text-gray-500">
                                    Thông tin xác nhận đặt phòng đã được gửi đến email của bạn
                                </p>
                            )}
                        </div>

                        {/* Action buttons */}
                        <div className="space-y-3 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center gap-4">
                            {/* For pending payment - show payment and booking detail buttons */}
                            {displayState.type === 'pending' && displayState.bookingId && (
                                <>
                                    <Button
                                        type="primary"
                                        size="large"
                                        onClick={() => navigate(`/user/booking/${displayState.bookingId}`)}
                                        style={{
                                            backgroundColor: '#52c41a',
                                            borderColor: '#52c41a',
                                            height: '48px',
                                            fontSize: '16px',
                                            fontWeight: 600,
                                            minWidth: '200px'
                                        }}
                                    >
                                        Thanh toán ngay
                                    </Button>
                                    {isLoggedIn && (
                                        <Button
                                            size="large"
                                            onClick={() => navigate('/user/bookings')}
                                            style={{
                                                height: '48px',
                                                fontSize: '16px',
                                                fontWeight: 600,
                                                minWidth: '200px'
                                            }}
                                        >
                                            Xem đơn đặt phòng
                                        </Button>
                                    )}
                                </>
                            )}

                            {/* For success - show booking list or home */}
                            {displayState.type === 'success' && (
                                <>
                                    {isLoggedIn && (
                                        <Button
                                            type="primary"
                                            size="large"
                                            onClick={() => navigate('/user/bookings')}
                                            style={{
                                                backgroundColor: COLORS.primary,
                                                borderColor: COLORS.primary,
                                                height: '48px',
                                                fontSize: '16px',
                                                fontWeight: 600,
                                                minWidth: '200px'
                                            }}
                                        >
                                            Xem đơn đặt phòng
                                        </Button>
                                    )}
                                </>
                            )}

                            {/* For error or other states - show home button */}
                            {(displayState.type === 'error' || displayState.type === 'info') && (
                                <>
                                    {isLoggedIn && (
                                        <Button
                                            type="primary"
                                            size="large"
                                            onClick={() => navigate('/user/bookings')}
                                            style={{
                                                backgroundColor: COLORS.primary,
                                                borderColor: COLORS.primary,
                                                height: '48px',
                                                fontSize: '16px',
                                                fontWeight: 600,
                                                minWidth: '200px'
                                            }}
                                        >
                                            Xem đơn đặt phòng
                                        </Button>
                                    )}
                                </>
                            )}

                            {/* Always show home button */}
                            <Button
                                size="large"
                                onClick={() => navigate('/')}
                                style={{
                                    height: '48px',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    minWidth: '200px'
                                }}
                            >
                                Về trang chủ
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Additional support info */}
                <div className="mt-2 text-center text-gray-500 text-sm">
                    <p>
                        Nếu có thắc mắc, vui lòng liên hệ với chúng tôi qua email admin@lionhotel.com
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BookingComplete;
