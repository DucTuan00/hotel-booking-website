import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Button,
    Spin,
    Empty,
} from 'antd';
import {
    ArrowLeftOutlined,
    SaveOutlined,
} from '@ant-design/icons';
import bookingService from '@/services/bookings/bookingService';
import Notification from '@/components/Notification';
import {
    Booking,
    BookingStatus,
    PaymentStatus,
} from '@/types/booking';
import { Message } from '@/types/message';
import CustomerInfo from '@/pages/admin/Booking/Detail/components/CustomerInfo';
import RoomInfo from '@/pages/admin/Booking/Detail/components/RoomInfo';
import PaymentInfo from '@/pages/admin/Booking/Detail/components/PaymentInfo';
import PriceBreakdown from '@/pages/admin/Booking/Detail/components/PriceBreakdown';
import BookingStatusInfo from '@/pages/admin/Booking/Detail/components/BookingStatusInfo';

const BookingDetail: React.FC = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const navigate = useNavigate();

    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<Message | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Editable states
    const [newBookingStatus, setNewBookingStatus] = useState<BookingStatus | null>(null);
    const [newPaymentStatus, setNewPaymentStatus] = useState<PaymentStatus | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        const fetchBookingDetail = async () => {
            setLoading(true);
            try {
                if (bookingId) {
                    const data = await bookingService.getBookingById(bookingId);
                    setBooking(data);
                    setNewBookingStatus(data.status);
                    setNewPaymentStatus(data.paymentStatus);
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

    const handleStatusChange = (status: BookingStatus) => {
        setNewBookingStatus(status);
        setHasChanges(true);
    };

    const handlePaymentStatusChange = (paymentStatus: PaymentStatus) => {
        setNewPaymentStatus(paymentStatus);
        setHasChanges(true);
    };

    const handleSaveChanges = async () => {
        if (!bookingId || !newBookingStatus || !newPaymentStatus || !booking) return;

        setSubmitting(true);
        try {
            let updatedBooking = booking;

            // Update booking status nếu thay đổi
            if (newBookingStatus !== booking.status) {
                updatedBooking = await bookingService.updateBooking({
                    bookingId,
                    status: newBookingStatus,
                });
            }

            // Update payment status nếu thay đổi
            if (newPaymentStatus !== booking.paymentStatus) {
                updatedBooking = await bookingService.updatePaymentStatus({
                    bookingId,
                    paymentStatus: newPaymentStatus,
                });
            }

            setBooking(updatedBooking);
            setNewBookingStatus(updatedBooking.status);
            setNewPaymentStatus(updatedBooking.paymentStatus);
            setHasChanges(false);
            setMessage({
                type: 'success',
                text: 'Cập nhật đơn đặt phòng thành công!',
            });
        } catch (error) {
            console.error('Error updating booking:', error);
            setMessage({
                type: 'error',
                text: 'Cập nhật thất bại. Vui lòng kiểm tra lại.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoBack = () => {
        navigate('/dashboard/bookings');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" tip="Đang tải..." />
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="bg-white p-6 rounded-lg">
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={handleGoBack}
                    className="mb-4"
                >
                    Quay lại
                </Button>
                <Empty description="Không tìm thấy đặt phòng" />
            </div>
        );
    }

    return (
        <>
            <Notification message={message} onClose={() => setMessage(null)} />

            <div className="bg-white">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={handleGoBack}
                    />
                    <span className="text-xl font-semibold text-gray-900">Chi tiết đơn đặt phòng: {booking.id}</span>
                </div>
                <CustomerInfo booking={booking} />
                <RoomInfo booking={booking} />
                <PaymentInfo 
                    booking={booking} 
                    paymentStatus={newPaymentStatus || undefined}
                    onPaymentStatusChange={handlePaymentStatusChange}
                />
                <PriceBreakdown booking={booking} />
                <BookingStatusInfo 
                    booking={booking}
                    status={newBookingStatus || undefined}
                    onStatusChange={handleStatusChange}
                />

                {hasChanges && (
                    <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            loading={submitting}
                            onClick={handleSaveChanges}
                        >
                            Lưu thay đổi
                        </Button>
                        <Button
                            onClick={() => {
                                setNewBookingStatus(booking?.status || null);
                                setNewPaymentStatus(booking?.paymentStatus || null);
                                setHasChanges(false);
                            }}
                        >
                            Hủy
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
};

export default BookingDetail;
