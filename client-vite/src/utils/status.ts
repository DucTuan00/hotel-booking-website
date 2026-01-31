import { BookingStatus, PaymentStatus } from '@/types/booking';

export const getStatusText = (status: BookingStatus) => {
    switch (status) {
        case BookingStatus.CONFIRMED:
            return 'Đã xác nhận';
        case BookingStatus.PENDING:
            return 'Chờ xác nhận';
        case BookingStatus.CANCELLED:
            return 'Đã hủy';
        case BookingStatus.CHECKED_IN:
            return 'Đã nhận phòng';
        case BookingStatus.CHECKED_OUT:
            return 'Đã trả phòng';
        case BookingStatus.REJECTED:
            return 'Đã từ chối';
        default:
            return status;
    }
};

export const getStatusColor = (status: BookingStatus) => {
    switch (status) {
        case BookingStatus.CONFIRMED:
            return 'green';
        case BookingStatus.PENDING:
            return 'orange';
        case BookingStatus.CANCELLED:
            return 'magenta';
        case BookingStatus.CHECKED_IN:
            return 'blue';
        case BookingStatus.CHECKED_OUT:
            return 'default';
        case BookingStatus.REJECTED:
            return 'red';
        default:
            return 'default';
    }
};

export const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
        case PaymentStatus.PAID:
            return 'green';
        case PaymentStatus.UNPAID:
            return 'orange';
        case PaymentStatus.REFUNDED:
            return 'blue';
        default:
            return 'default';
    }
};

export const getPaymentStatusText = (status: PaymentStatus) => {
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