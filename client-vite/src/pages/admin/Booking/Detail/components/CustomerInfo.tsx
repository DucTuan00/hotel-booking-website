import React from 'react';
import BaseDetailRow from '@/pages/admin/Booking/Detail/components/BaseDetailRow';
import DetailSection from '@/pages/admin/Booking/Detail/components/DetailSection';
import { Booking } from '@/types/booking';

interface CustomerInfoProps {
    booking: Booking;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ booking }) => {
    return (
        <DetailSection title="Thông tin khách hàng">
            <BaseDetailRow
                label="Họ"
                value={booking.firstName}
            />
            <BaseDetailRow
                label="Tên"
                value={booking.lastName}
            />
            <BaseDetailRow label="Email" value={booking.email} />
            <BaseDetailRow label="Số điện thoại" value={booking.phoneNumber} />
            {booking.note && (
                <BaseDetailRow 
                    label="Ghi chú" 
                    value={booking.note} 
                />
            )}
        </DetailSection>
    );
};

export default CustomerInfo;
