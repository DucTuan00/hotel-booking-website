import React, { useState, useEffect } from 'react';

const RoomForm = ({ visible, onCancel, onSubmit, initialValues, loading }) => {
    const [name, setName] = useState('');
    const [roomType, setRoomType] = useState('Standard');
    const [price, setPrice] = useState('');
    const [capacity, setCapacity] = useState('');

    useEffect(() => {
        if (initialValues) {
            setName(initialValues.name || '');
            setRoomType(initialValues.roomType || 'Standard');
            setPrice(initialValues.price || '');
            setCapacity(initialValues.capacity || '');
        } else {
            setName('');
            setRoomType('Standard');
            setPrice('');
            setCapacity('');
        }
    }, [initialValues]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, roomType, price, capacity: parseInt(capacity, 10) }); // convert capacity to number
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
                                {initialValues ? 'Sửa phòng' : 'Thêm phòng mới'}
                            </h3>
                            <div className="mt-2">
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                                        Tên phòng:
                                    </label>
                                    <input
                                        type="text"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="roomType" className="block text-gray-700 text-sm font-bold mb-2">
                                        Loại phòng:
                                    </label>
                                    <select
                                        id="roomType"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={roomType}
                                        onChange={(e) => setRoomType(e.target.value)}
                                    >
                                        <option value="Standard">Standard</option>
                                        <option value="Deluxe">Deluxe</option>
                                        <option value="Suite">Suite</option>
                                        <option value="VIP">VIP</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
                                        Giá (USD):
                                    </label>
                                    <input
                                        type="number"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="price"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                        min="0"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="capacity" className="block text-gray-700 text-sm font-bold mb-2">
                                        Sức chứa:
                                    </label>
                                    <input
                                        type="number"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="capacity"
                                        value={capacity}
                                        onChange={(e) => setCapacity(e.target.value)}
                                        required
                                        min="1"
                                    />
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

export default RoomForm;
