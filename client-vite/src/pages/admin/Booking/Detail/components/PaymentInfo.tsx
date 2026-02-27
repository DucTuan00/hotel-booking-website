import React from 'react';
import { Select } from 'antd';
import BaseDetailRow from '@/components/BaseDetail';
import DetailSection from '@/pages/admin/Booking/Detail/components/DetailSection';
import { Booking, PaymentStatus, PaymentMethod, BookingStatus } from '@/types/booking';
import moment from 'moment';

interface PaymentInfoProps {
    booking: Booking;
    paymentStatus?: PaymentStatus;
    onPaymentStatusChange?: (status: PaymentStatus) => void;
}

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

const PaymentInfo: React.FC<PaymentInfoProps> = ({ booking, paymentStatus, onPaymentStatusChange }) => {
    const displayStatus = paymentStatus || booking.paymentStatus;

    // Lấy các trạng thái thanh toán có thể chuyển đến từ trạng thái hiện tại
    const getAvailablePaymentStatuses = (): PaymentStatus[] => {
        switch (booking.paymentStatus) {
            case PaymentStatus.UNPAID:
                return [PaymentStatus.UNPAID, PaymentStatus.PAID];
            case PaymentStatus.PAID:
                // Chỉ hoàn tiền nếu booking đã bị hủy
                return booking.status === BookingStatus.CANCELLED
                    ? [PaymentStatus.PAID, PaymentStatus.REFUNDED]
                    : [PaymentStatus.PAID];
            case PaymentStatus.REFUNDED:
                return [PaymentStatus.REFUNDED];
            default:
                return [booking.paymentStatus];
        }
    };

    const handleStatusChange = (status: PaymentStatus) => {
        if (onPaymentStatusChange) {
            onPaymentStatusChange(status);
        }
    };

    const getGatewayText = (gateway?: 'vnpay' | 'momo' | 'zalopay') => {
        switch (gateway) {
            case 'vnpay':
                return 'VNPay';
            case 'momo':
                return 'MoMo';
            case 'zalopay':
                return 'ZaloPay';
            default:
                return gateway || 'N/A';
        }
    };

    return (
        <DetailSection title="Thông tin thanh toán">
            <BaseDetailRow
                label="Phương thức thanh toán"
                value={
                    <span>
                        {getPaymentMethodText(booking.paymentMethod)}
                        {booking.snapshot?.paymentOption?.type === 'deposit' && (
                            <span className="ml-2 text-xs font-semibold text-white bg-orange-500 px-2 py-0.5 rounded">
                                Đặt cọc {booking.snapshot.paymentOption.depositPercent}%
                            </span>
                        )}
                    </span>
                }
            />
            <BaseDetailRow
                label="Trạng thái thanh toán"
                value={
                    onPaymentStatusChange ? (
                        <Select
                            value={displayStatus}
                            onChange={handleStatusChange}
                            style={{ minWidth: '200px' }}
                            options={getAvailablePaymentStatuses().map((status) => ({
                                value: status,
                                label: getPaymentStatusText(status)
                            }))}
                        />
                    ) : (
                        <>
                            {getPaymentStatusText(displayStatus)}
                        </>
                    )
                }
            />
            {booking.paymentDetails && (
                <>
                    {booking.paymentDetails.gateway && (
                        <BaseDetailRow
                            label="Cổng thanh toán"
                            value={getGatewayText(booking.paymentDetails.gateway)}
                        />
                    )}
                    {booking.paymentDetails.transactionId && (
                        <BaseDetailRow
                            label="Mã giao dịch"
                            value={booking.paymentDetails.transactionId}
                        />
                    )}
                    {booking.paymentDetails.responseCode && (
                        <BaseDetailRow
                            label="Mã phản hồi"
                            value={booking.paymentDetails.responseCode}
                        />
                    )}
                    {booking.paymentDetails.bankCode && (
                        <BaseDetailRow
                            label="Ngân hàng"
                            value={booking.paymentDetails.bankCode}
                        />
                    )}
                    {booking.paymentDetails.cardType && (
                        <BaseDetailRow
                            label="Loại thẻ"
                            value={booking.paymentDetails.cardType}
                        />
                    )}
                    {booking.paidAt && (
                        <BaseDetailRow
                            label="Thời gian thanh toán"
                            value={moment(booking.paidAt).format('DD/MM/YYYY HH:mm')}
                        />
                    )}
                </>
            )}
        </DetailSection>
    );
};

export default PaymentInfo;
