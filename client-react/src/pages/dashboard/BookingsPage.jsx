import React from 'react';
import AdminLayout from '../../components/admin/Layout/AdminLayout';
import BookingList from '../../components/admin/Booking/BookingList';

const BookingsPage = () => {
    return (
        <AdminLayout>
            <h2>Quản lý Bookings</h2>
            <BookingList />
        </AdminLayout>
    );
};

export default BookingsPage;