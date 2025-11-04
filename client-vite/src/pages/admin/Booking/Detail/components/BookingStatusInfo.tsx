import React from 'react';
import { Alert, Select } from 'antd';
import moment from 'moment';
import BaseDetailRow from '@/pages/admin/Booking/Detail/components/BaseDetailRow';
import DetailSection from '@/pages/admin/Booking/Detail/components/DetailSection';
import { Booking, BookingStatus } from '@/types/booking';

interface BookingStatusInfoProps {
    booking: Booking;
    status?: BookingStatus;
    onStatusChange?: (status: BookingStatus) => void;
}

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

const BookingStatusInfo: React.FC<BookingStatusInfoProps> = ({ booking, status, onStatusChange }) => {
    const displayStatus = status || booking.status;

    // Lấy các trạng thái có thể chuyển đến từ trạng thái hiện tại
    const getAvailableStatusTransitions = (): BookingStatus[] => {
        switch (booking.status) {
            case BookingStatus.PENDING:
                return [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.REJECTED, BookingStatus.CANCELLED];
            case BookingStatus.CONFIRMED:
                return [BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN, BookingStatus.REJECTED, BookingStatus.CANCELLED];
            case BookingStatus.CHECKED_IN:
                return [BookingStatus.CHECKED_IN, BookingStatus.CHECKED_OUT];
            case BookingStatus.CHECKED_OUT:
            case BookingStatus.CANCELLED:
            case BookingStatus.REJECTED:
                // Các trạng thái cuối cùng không thể thay đổi
                return [booking.status];
            default:
                return [booking.status];
        }
    };

    const handleStatusChange = (newStatus: BookingStatus) => {
        if (onStatusChange) {
            onStatusChange(newStatus);
        }
    };

    return (
        <DetailSection title="Trạng thái đặt phòng">
            <BaseDetailRow
                label="Trạng thái hiện tại"
                value={
                    onStatusChange ? (
                        <Select
                            value={displayStatus}
                            onChange={handleStatusChange}
                            style={{ minWidth: '200px' }}
                            disabled={getAvailableStatusTransitions().length === 1}
                            options={getAvailableStatusTransitions().map((s) => ({
                                value: s,
                                label: getStatusText(s)
                            }))}
                        />
                    ) : (
                        <>
                            {getStatusText(displayStatus)}
                        </>
                    )
                }
            />
            {booking.confirmedAt && (
                <BaseDetailRow
                    label="Ngày xác nhận"
                    value={moment(booking.confirmedAt).format('DD/MM/YYYY HH:mm')}
                />
            )}
            {booking.rejectedAt && (
                <BaseDetailRow
                    label="Ngày từ chối"
                    value={moment(booking.rejectedAt).format('DD/MM/YYYY HH:mm')}
                />
            )}
            {booking.cancelledAt && (
                <BaseDetailRow
                    label="Ngày hủy"
                    value={moment(booking.cancelledAt).format('DD/MM/YYYY HH:mm')}
                />
            )}
            {booking.cancellationReason && (
                <BaseDetailRow
                    label="Lý do hủy"
                    value={<Alert message={booking.cancellationReason} type="info" showIcon />}
                    fullWidth
                />
            )}
            <BaseDetailRow
                label="Ngày tạo"
                value={
                    booking.createdAt
                        ? moment(booking.createdAt).format('DD/MM/YYYY HH:mm')
                        : '-'
                }
            />
            <BaseDetailRow
                label="Cập nhật lần cuối"
                value={
                    booking.updatedAt
                        ? moment(booking.updatedAt).format('DD/MM/YYYY HH:mm')
                        : '-'
                }
            />
        </DetailSection>
    );
};

export default BookingStatusInfo;
