import React, { useState, useEffect } from 'react';
import amenityService from '../../../services/amenityService'; // Make sure the path is correct

const AmenityForm = ({ visible, onCancel, onSubmit, initialValues, loading }) => {
    const [name, setName] = useState('');
    const isUpdate = !!initialValues?._id; // Determine if it's an update or create form

    useEffect(() => {
        if (initialValues?._id) { // Check specifically for _id for update mode
            setName(initialValues.name || '');
        } else {
            // Reset form for create mode
            setName('');
        }
    }, [initialValues]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        onSubmit(true, null, null); // Start loading, no data or error yet

        try {
            let responseData;
            if (isUpdate) {
                // Update amenity
                responseData = await amenityService.updateAmenity(initialValues._id, { name });
            } else {
                // Create new amenity
                responseData = await amenityService.createAmenity({ name });
            }
            onSubmit(false, responseData, null); // Stop loading, pass data, no error
            //onCancel(); // Consider if you want to close the modal on successful submit from here
        } catch (error) {
            console.error(`Error ${isUpdate ? 'updating' : 'creating'} amenity:`, error);
            const errorMsg = error.response?.data?.message || error.message || "Lỗi không xác định";
            alert(`Lỗi ${isUpdate ? 'cập nhật' : 'tạo'} tiện nghi: ${errorMsg}`);
            onSubmit(false, null, error); // Stop loading, no data, pass error
        }
    };

    if (!visible) {
        return null;
    }

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end sm:items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                {/* Vertical centering helper */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>

                {/* Modal panel */}
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-xl leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                                {isUpdate ? 'Sửa tiện nghi' : 'Thêm tiện nghi mới'}
                            </h3>

                            <div className="grid grid-cols-1 gap-y-4">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Tên tiện nghi <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md py-2 px-3"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Modal actions */}
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-800 text-base font-medium text-white hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? 'Đang xử lý...' : isUpdate ? 'Lưu thay đổi' : 'Thêm tiện nghi'}
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

export default AmenityForm;