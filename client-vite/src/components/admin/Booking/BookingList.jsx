import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import BookingForm from './BookingForm';
import DeleteConfirm from '../Common/DeleteConfirm';
import moment from 'moment';

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [deleteBookingId, setDeleteBookingId] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [message, setMessage] = useState(null);

    // Dữ liệu mẫu booking (thay bằng API call sau)
    const dummyBookings = [
        {
            id: 1,
            userId: 1,
            roomId: 1,
            checkInDate: '2024-07-20',
            checkOutDate: '2024-07-25',
            numberOfGuests: 2,
            bookingStatus: 'Confirmed',
        },
        {
            id: 2,
            userId: 2,
            roomId: 2,
            checkInDate: '2024-08-10',
            checkOutDate: '2024-08-15',
            numberOfGuests: 3,
            bookingStatus: 'Pending',
        },
    ];

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setBookings(dummyBookings);
            setLoading(false);
        }, 500);
    }, []);

    const showModal = () => {
        setIsModalVisible(true);
        setEditingBooking(null);
    };

    const handleEdit = (booking) => {
        setIsModalVisible(true);
        setEditingBooking(booking);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleFormSubmit = (values) => {
        setLoading(true);
        setTimeout(() => {
            if (editingBooking) {
                const updatedBookings = bookings.map(booking =>
                    booking.id === editingBooking.id ? { ...editingBooking, ...values } : booking
                );
                setBookings(updatedBookings);
                setMessage({ type: 'success', text: 'Booking đã được cập nhật thành công!' });
            } else {
                const newBooking = { id: bookings.length + 1, ...values };
                setBookings([...bookings, newBooking]);
                setMessage({ type: 'success', text: 'Booking đã được thêm thành công!' });
            }
            setIsModalVisible(false);
            setLoading(false);
        }, 500);
    };

    const handleDeleteConfirm = (bookingId) => {
        setDeleteBookingId(bookingId);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
    };

    const confirmDeleteBooking = () => {
        setLoading(true);
        setTimeout(() => {
            const updatedBookings = bookings.filter(booking => booking.id !== deleteBookingId);
            setBookings(updatedBookings);
            setMessage({ type: 'success', text: 'Booking đã được xóa thành công!' });
            setIsDeleteModalVisible(false);
            setLoading(false);
        }, 500);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed':
                return 'bg-green-100 text-green-800';
            case 'Pending':
                return 'bg-blue-100 text-blue-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            case 'Completed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="container mx-auto p-4">
            {message && (
                <div
                    className={`mb-4 py-2 px-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                >
                    {message.text}
                </div>
            )}

            <div className="flex justify-end mb-4">
                <button
                    className="bg-red-900 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={showModal}
                >
                    <div className="flex items-center">
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Thêm Booking mới
                    </div>
                </button>
            </div>

            <div className="shadow-md overflow-hidden border border-gray-300 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-red-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                User ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                Room ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                Ngày Check-in
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                Ngày Check-out
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                Số khách
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.map(booking => (
                            <tr key={booking.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{booking.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{booking.userId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{booking.roomId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{moment(booking.checkInDate).format('DD/MM/YYYY')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{moment(booking.checkOutDate).format('DD/MM/YYYY')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{booking.numberOfGuests}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.bookingStatus)}`}>
                                        {booking.bookingStatus === 'Confirmed' ? 'Đã xác nhận' :
                                            booking.bookingStatus === 'Pending' ? 'Chờ xác nhận' :
                                                booking.bookingStatus === 'Cancelled' ? 'Đã hủy' : 'Hoàn thành'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(booking)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                                    >
                                        <div className="flex items-center">
                                            <PencilIcon className="h-5 w-5 mr-1" />
                                            Sửa
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteConfirm(booking.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <div className="flex items-center">
                                            <TrashIcon className="h-5 w-5 mr-1" />
                                            Xóa
                                        </div>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <BookingForm
                visible={isModalVisible}
                onCancel={handleCancel}
                onSubmit={handleFormSubmit}
                initialValues={editingBooking}
                loading={loading}
            />

            <DeleteConfirm
                visible={isDeleteModalVisible}
                onConfirm={confirmDeleteBooking}
                onCancel={handleDeleteCancel}
                itemName="booking"
                loading={loading}
            />
        </div>
    );
};

export default BookingList;
