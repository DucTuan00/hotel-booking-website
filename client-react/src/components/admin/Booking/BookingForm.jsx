import React, { useState, useEffect } from 'react';
import moment from 'moment';

const BookingForm = ({ visible, onCancel, onSubmit, initialValues, loading }) => {
    const [userId, setUserId] = useState('');
    const [roomId, setRoomId] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState('');
    const [bookingStatus, setBookingStatus] = useState('Pending');

    useEffect(() => {
        if (initialValues) {
            setUserId(initialValues.userId || '');
            setRoomId(initialValues.roomId || '');
            setCheckInDate(moment(initialValues.checkInDate).format('YYYY-MM-DD') || '');
            setCheckOutDate(moment(initialValues.checkOutDate).format('YYYY-MM-DD') || '');
            setNumberOfGuests(initialValues.numberOfGuests || '');
            setBookingStatus(initialValues.bookingStatus || 'Pending');
        } else {
            setUserId('');
            setRoomId('');
            setCheckInDate('');
            setCheckOutDate('');
            setNumberOfGuests('');
            setBookingStatus('Pending');
        }
    }, [initialValues]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            userId: parseInt(userId, 10),
            roomId: parseInt(roomId, 10),
            checkInDate,
            checkOutDate,
            numberOfGuests: parseInt(numberOfGuests, 10),
            bookingStatus,
        });
    };

    if (!visible) {
        return null;
    }

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                {initialValues ? 'Sửa Booking' : 'Thêm Booking mới'}
                            </h3>
                            <div className="mt-2">
                                <div className="mb-4">
                                    <label htmlFor="userId" className="block text-gray-700 text-sm font-bold mb-2">
                                        User ID:
                                    </label>
                                    <input
                                        type="number"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="userId"
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                        required
                                        min="1"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="roomId" className="block text-gray-700 text-sm font-bold mb-2">
                                        Room ID:
                                    </label>
                                    <input
                                        type="number"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="roomId"
                                        value={roomId}
                                        onChange={(e) => setRoomId(e.target.value)}
                                        required
                                        min="1"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="checkInDate" className="block text-gray-700 text-sm font-bold mb-2">
                                        Ngày Check-in:
                                    </label>
                                    <input
                                        type="date"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="checkInDate"
                                        value={checkInDate}
                                        onChange={(e) => setCheckInDate(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="checkOutDate" className="block text-gray-700 text-sm font-bold mb-2">
                                        Ngày Check-out:
                                    </label>
                                    <input
                                        type="date"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="checkOutDate"
                                        value={checkOutDate}
                                        onChange={(e) => setCheckOutDate(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="numberOfGuests" className="block text-gray-700 text-sm font-bold mb-2">
                                        Số khách:
                                    </label>
                                    <input
                                        type="number"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="numberOfGuests"
                                        value={numberOfGuests}
                                        onChange={(e) => setNumberOfGuests(e.target.value)}
                                        required
                                        min="1"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="bookingStatus" className="block text-gray-700 text-sm font-bold mb-2">
                                        Trạng thái Booking:
                                    </label>
                                    <select
                                        id="bookingStatus"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={bookingStatus}
                                        onChange={(e) => setBookingStatus(e.target.value)}
                                    >
                                        <option value="Pending">Chờ xác nhận</option>
                                        <option value="Confirmed">Đã xác nhận</option>
                                        <option value="Cancelled">Đã hủy</option>
                                        <option value="Completed">Hoàn thành</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-900 text-base font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                disabled={loading}
                            >
                                {loading ? 'Đang lưu...' : initialValues ? 'Lưu' : 'Thêm'}
                            </button>
                            <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;