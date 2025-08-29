// Helper to get name or id from user/room, always returns string
const getName = (val: string | { name?: string } | null | undefined): string => {
  if (val && typeof val === 'object' && 'name' in val) {
    return val.name ?? '';
  }
  if (typeof val === 'string') {
    return val;
  }
  return '';
};
import React, { useState, useEffect } from 'react';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import BookingForm from '@/pages/admin/Booking/Form';
import Notification from '@/components/Notification';
import bookingService from '@/services/bookingService';
import { ClipLoader } from 'react-spinners';
import moment from 'moment';
import { Booking } from '@/types/booking';

interface Message {
    type: 'success' | 'error';
    text: string;
}

const BookingList: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
    const [message, setMessage] = useState<Message | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalBookings, setTotalBookings] = useState<number>(0);

    useEffect(() => {
        fetchBookings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, pageSize]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const data = await bookingService.getAllBookings({ page: currentPage, pageSize: pageSize });
            setBookings(data.bookings as Booking[]);
            setTotalBookings(data.total ?? 0);
            setPageSize(data.pageSize ?? 5);
        } catch (error) {
            console.error("Error when fetch bookings:", error);
            setMessage({ type: 'error', text: 'Tải danh sách đặt phòng thất bại.' });
            setBookings([]);
            setTotalBookings(0);
        } finally {
            setLoading(false);
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
        setEditingBooking(null);
    };

    const handleEdit = (booking: Booking) => {
        setIsModalVisible(true);
        setEditingBooking(booking);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingBooking(null);
    };

    const handleFormSubmit = async (
        isLoadingFromChild: boolean,
        data: Booking | null,
        error?: unknown
    ) => {
        setLoading(isLoadingFromChild);
        if (error) {
            setMessage({ type: 'error', text: editingBooking ? 'Cập nhật đặt phòng thất bại.' : 'Thêm đặt phòng thất bại.' });
            return;
        }
        if (!isLoadingFromChild && data) {
            setMessage({ type: 'success', text: editingBooking ? 'Cập nhật đơn đặt phòng thành công!' : 'Đặt phòng đã được thêm thành công!' });
            setEditingBooking(null);
            setIsModalVisible(false);
            fetchBookings();
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(totalBookings / pageSize)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const getStatusColor = (status: Booking['status']) => {
        switch (status) {
            case 'Confirmed':
                return 'bg-green-100 text-green-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            case 'Completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <ClipLoader color="#3498db" size={50} />
                <p className="mt-4 text-gray-600 text-lg font-semibold">
                    Đang tải dữ liệu...
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            {/* Notification message */}
            <Notification
                message={message}
                onClose={() => setMessage(null)} // Function to clear the message state
            />

            <div className="flex justify-end mb-4">
                <button
                    className="bg-red-900 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={showModal}
                    disabled={loading} // Disable button if loading
                >
                    <div className="flex items-center">
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Thêm Booking mới
                    </div>
                </button>
            </div>

            <div className="shadow-md overflow-x-auto border border-gray-300 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 table-auto w-full">
                    <thead className="bg-red-800">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                                Mã đơn đặt phòng
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                                Tên người đặt
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                                Tên phòng
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                                Số lượng
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                                Ngày Check-in
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                                Ngày Check-out
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                                Người lớn
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                                Trẻ em
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                                Tổng tiền
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th scope="col" className="px-4 py-3 text-right text-sm font-medium text-white uppercase tracking-wider">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-300">
                        {bookings.length === 0 && !loading && (
                            <tr>
                                <td colSpan={11} className="text-center py-10 text-gray-500">
                                    Không tìm thấy booking nào.
                                </td>
                            </tr>
                        )}
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50">
                                <td className="px-4 py-5 whitespace-nowrap text-sm font-medium text-black">{booking.id}</td>
                                <td className="px-4 py-5 whitespace-nowrap text-sm font-medium text-black">{getName(booking.userId)}</td>
                                <td className="px-4 py-5 whitespace-nowrap text-sm font-medium text-black">{getName(booking.roomId)}</td>
                                <td className="px-4 py-5 whitespace-nowrap text-sm text-center font-medium text-black">{booking.quantity}</td>
                                <td className="px-4 py-5 whitespace-nowrap text-sm font-medium text-black">{moment(booking.checkIn).format('DD/MM/YYYY')}</td>
                                <td className="px-4 py-5 whitespace-nowrap text-sm font-medium text-black">{moment(booking.checkOut).format('DD/MM/YYYY')}</td>
                                <td className="px-4 py-5 whitespace-nowrap text-sm text-center font-medium text-black">{booking.guests.adults}</td>
                                <td className="px-4 py-5 whitespace-nowrap text-sm text-center font-medium text-black">{booking.guests.children}</td>
                                <td className="px-4 py-5 whitespace-nowrap text-sm font-medium text-black">{booking.totalPrice.toLocaleString('vi-VN')}đ</td>
                                <td className="px-4 py-5 whitespace-nowrap text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                                        {booking.status === 'Confirmed' ? 'Đã xác nhận' :
                                            booking.status === 'Pending' ? 'Chờ xác nhận' :
                                                booking.status === 'Cancelled' ? 'Đã hủy' : 'Hoàn thành'}
                                    </span>
                                </td>
                                <td className="px-4 py-5 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(booking)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                                    >
                                        <div className="flex items-center">
                                            <PencilIcon className="h-5 w-5 mr-1" />
                                            Sửa
                                        </div>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination UI */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage <= 1}
                    className="px-4 py-2 mx-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
                >
                    Trang trước
                </button>
                <span className="m-2">{currentPage} / {Math.ceil(totalBookings / pageSize)}</span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage >= Math.ceil(totalBookings / pageSize)}
                    className="px-4 py-2 mx-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
                >
                    Trang sau
                </button>
            </div>

            <BookingForm
                visible={isModalVisible}
                onCancel={handleCancel}
                onSubmit={handleFormSubmit}
                initialValues={editingBooking ?? undefined}
                loading={loading}
            />
        </div>
    );
};

export default BookingList;