import React from 'react';
import { Select } from 'antd';
import BaseDetailRow from '@/pages/admin/Booking/Detail/components/BaseDetailRow';
import DetailSection from '@/pages/admin/Booking/Detail/components/DetailSection';
import { Booking, PaymentStatus, PaymentMethod, BookingStatus } from '@/types/booking';

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

    return (
        <DetailSection title="Thông tin thanh toán">
            <BaseDetailRow
                label="Phương thức thanh toán"
                value={getPaymentMethodText(booking.paymentMethod)}
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
        </DetailSection>
    );
};

export default PaymentInfo;
