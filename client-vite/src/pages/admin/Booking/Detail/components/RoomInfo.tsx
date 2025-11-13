import React from 'react';
import moment from 'moment';
import BaseDetailRow from '@/components/BaseDetail';
import DetailSection from '@/pages/admin/Booking/Detail/components/DetailSection';
import { Booking } from '@/types/booking';

interface RoomInfoProps {
    booking: Booking;
}

const RoomInfo: React.FC<RoomInfoProps> = ({ booking }) => {
    if (!booking.snapshot) return null;

    const { snapshot } = booking;

    return (
        <DetailSection title="Thông tin phòng">
            <BaseDetailRow label="ID phòng" value={snapshot.room.id} />
            <BaseDetailRow label="Tên phòng" value={snapshot.room.name} />
            <BaseDetailRow label="Số phòng đặt" value={booking.quantity} />
            <BaseDetailRow
                label="Check-in"
                value={moment(booking.checkIn).format('DD/MM/YYYY')}
            />
            <BaseDetailRow
                label="Check-out"
                value={moment(booking.checkOut).format('DD/MM/YYYY')}
            />
            <BaseDetailRow
                label="Số khách"
                value={`Người lớn: ${booking.guests.adults}${booking.guests.children ? `, Trẻ em: ${booking.guests.children}` : ''}`}
            />
        </DetailSection>
    );
};

export default RoomInfo;
