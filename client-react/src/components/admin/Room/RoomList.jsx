import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import RoomForm from './RoomForm';
import DeleteConfirm from '../Common/DeleteConfirm';

const RoomList = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [deleteRoomId, setDeleteRoomId] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [message, setMessage] = useState(null);

    // Dữ liệu mẫu phòng (thay bằng API call sau)
    const dummyRooms = [
        { id: 1, name: 'Phòng Deluxe 101', roomType: 'Deluxe', price: 150, capacity: 2 },
        { id: 2, name: 'Suite VIP 201', roomType: 'Suite', price: 300, capacity: 4 },
    ];

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setRooms(dummyRooms);
            setLoading(false);
        }, 500);
    }, []);

    const showModal = () => {
        setIsModalVisible(true);
        setEditingRoom(null);
    };

    const handleEdit = (room) => {
        setIsModalVisible(true);
        setEditingRoom(room);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleFormSubmit = (values) => {
        setLoading(true);
        setTimeout(() => {
            if (editingRoom) {
                const updatedRooms = rooms.map(room => room.id === editingRoom.id ? { ...editingRoom, ...values } : room);
                setRooms(updatedRooms);
                setMessage({ type: 'success', text: 'Phòng đã được cập nhật thành công!' });
            } else {
                const newRoom = { id: rooms.length + 1, ...values };
                setRooms([...rooms, newRoom]);
                setMessage({ type: 'success', text: 'Phòng đã được thêm thành công!' });
            }
            setIsModalVisible(false);
            setLoading(false);
        }, 500);
    };

    const handleDeleteConfirm = (roomId) => {
        setDeleteRoomId(roomId);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
    };

    const confirmDeleteRoom = () => {
        setLoading(true);
        setTimeout(() => {
            const updatedRooms = rooms.filter(room => room.id !== deleteRoomId);
            setRooms(updatedRooms);
            setMessage({ type: 'success', text: 'Phòng đã được xóa thành công!' });
            setIsDeleteModalVisible(false);
            setLoading(false);
        }, 500);
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
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={showModal}
                >
                    <div className="flex items-center">
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Thêm phòng mới
                    </div>
                </button>
            </div>

            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tên phòng
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Loại phòng
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Giá (VND)
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Sức chứa
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {rooms.map(room => (
                            <tr key={room.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{room.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{room.roomType}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{room.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{room.capacity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(room)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                                    >
                                        <div className="flex items-center">
                                            <PencilIcon className="h-5 w-5 mr-1" />
                                            Sửa
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteConfirm(room.id)}
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

            <RoomForm
                visible={isModalVisible}
                onCancel={handleCancel}
                onSubmit={handleFormSubmit}
                initialValues={editingRoom}
                loading={loading}
            />

            <DeleteConfirm
                visible={isDeleteModalVisible}
                onConfirm={confirmDeleteRoom}
                onCancel={handleDeleteCancel}
                itemName="phòng"
                loading={loading}
            />
        </div>
    );
};

export default RoomList;
