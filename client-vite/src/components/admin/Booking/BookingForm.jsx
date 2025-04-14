import React, { useState, useEffect } from 'react';
import bookingService from '../../../services/bookingService'; // Assuming path to bookingService

const BookingForm = ({ visible, onCancel, onSubmit, initialValues, loading }) => {
    const [bookingStatus, setBookingStatus] = useState('Pending');
    const isUpdate = true; 

    useEffect(() => {
        if (initialValues?._id) {
            setBookingStatus(initialValues.status || 'Pending');
        }
    }, [initialValues]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        onSubmit(true, null, null);

        try {
            let responseData;
            if (isUpdate) {
                // **Highlight: Update only booking status**
                responseData = await bookingService.updateBooking(initialValues._id, { status: bookingStatus });
            }

            onSubmit(false, responseData, null); // Stop loading, pass data, no error
            // onCancel(); // Consider if you want to close modal on submit success
        } catch (error) {
            console.error(`Error updating booking status:`, error); // **Highlight: Updated error message**
            const errorMsg = error.response?.data?.message || error.message || "Lỗi không xác định";
            alert(`Lỗi cập nhật trạng thái booking: ${errorMsg}`); // **Highlight: Updated alert message**
            onSubmit(false, null, error); // Stop loading, pass error
        }
    };

    if (!visible) {
        return null;
    }

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end sm:items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            {/* Updated Modal Title - only for update** */}
                            <h3 className="text-xl leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                                Cập nhật trạng thái Booking
                            </h3>
                            <div className="mt-2">
                                {/* Booking Status field remains** */}
                                <div className="mb-4">
                                    <label htmlFor="bookingStatus" className="block text-sm font-medium text-gray-700 mb-1">
                                        Trạng thái Booking: <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="bookingStatus"
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md py-2 px-3"
                                        value={bookingStatus}
                                        onChange={(e) => setBookingStatus(e.target.value)}
                                        required
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
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-800 text-base font-medium text-white hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? 'Đang lưu...' : 'Cập nhật trạng thái'}
                            </button>
                            <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50"
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