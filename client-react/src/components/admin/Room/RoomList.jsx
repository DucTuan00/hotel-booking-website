import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import RoomForm from './RoomForm';
import DeleteConfirm from '../Common/DeleteConfirm';
import roomService from '../../../services/roomService';
import { ClipLoader } from 'react-spinners';

const RoomList = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [deleteRoomId, setDeleteRoomId] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [message, setMessage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRooms, setTotalRooms] = useState(0);

    useEffect(() => {
        fetchRooms();
    }, [currentPage, pageSize]);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const data = await roomService.getAllRooms({ page: currentPage, pageSize: pageSize });
            setRooms(data.rooms);
            setTotalRooms(data.total);
            setPageSize(data.pageSize);
        } catch (error) {
            console.error("Error when fetch rooms:", error);
            setMessage({ type: 'error', text: 'Tải danh sách phòng thất bại.' });
            setRooms([]);
            setTotalRooms(0);
        } finally {
            setLoading(false);
        }
    };

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

    const handleFormSubmit = async (values) => {
        setLoading(true);
        try {
            if (editingRoom) {
                await roomService.updateRoom(editingRoom.id, values);
                setMessage({ type: 'success', text: 'Phòng đã được cập nhật thành công!' });
            } else {
                await roomService.createRoom(values);
                setMessage({ type: 'success', text: 'Phòng đã được thêm thành công!' });
            }
            fetchRooms();
            setIsModalVisible(false);
        } catch (error) {
            console.error("Error when submit form:", error);
            setMessage({ type: 'error', text: editingRoom ? 'Cập nhật phòng thất bại.' : 'Thêm phòng thất bại.' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteConfirm = (roomId) => {
        setDeleteRoomId(roomId);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
    };

    const confirmDeleteRoom = async () => {
        setLoading(true);
        try {
            await roomService.deleteRoom(deleteRoomId);
            setMessage({ type: 'success', text: 'Phòng đã được xóa thành công!' });
            fetchRooms();
            setIsDeleteModalVisible(false);
        } catch (error) {
            console.error("Error delete room: ", error);
            setMessage({ type: 'error', text: 'Xóa phòng thất bại.' });
        } finally {
            setLoading(false);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(totalRooms / pageSize)) {
            setCurrentPage(currentPage + 1);
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
                        Thêm phòng mới
                    </div>
                </button>
            </div>

            <div className="shadow-md overflow-hidden border border-gray-300 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 table-fixed w-full">
                    <thead className="bg-red-800">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider w-[20%]">
                                Hình ảnh
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider w-[15%]">
                                Tên phòng
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider w-[10%]">
                                Loại phòng
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider w-[20%]">
                                Tiện nghi
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider w-[10%]">
                                Giá (VND)
                            </th>
                            <th scope="col" className="px-4 py-3 text-center text-sm font-medium text-white uppercase tracking-wider w-[10%]">
                                Tối đa
                            </th>
                            <th scope="col" className="px-4 py-3 text-center text-sm font-medium text-white uppercase tracking-wider w-[10%]">
                                Số lượng
                            </th>
                            <th scope="col" className="px-4 py-3 text-right text-sm font-medium text-white uppercase tracking-wider w-[10%]">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-300">
                        {rooms.map(room => (
                            <tr key={room.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 align-middle">
                                    <img 
                                        src={room.images && room.images.length > 0 ? `http://localhost:3000/${room.images[0]}` : '/placeholder-image.jpg'}
                                        alt={`Ảnh phòng ${room.name}`}
                                        className="h-50 w-50 object-cover rounded" 
                                    />
                                </td>
                                <td className="px-4 py-2 text-base text-black font-medium align-middle whitespace-normal break-words">{room.name}</td>
                                <td className="px-4 py-2 text-base text-black font-medium align-middle whitespace-nowrap">{room.room_type}</td>
                                <td className="px-4 py-2 text-base text-black font-medium align-middle whitespace-normal break-words">
                                    {room.amenities.map(amenity => amenity.name).join(', ')}
                                </td>
                                <td className="px-4 py-2 text-base text-black font-medium align-middle whitespace-nowrap text-left">
                                    {room.price.toLocaleString('vi-VN')}đ
                                </td>
                                <td className="px-4 py-2 text-base text-black font-medium align-middle whitespace-nowrap text-center">{room.max_guests}</td>
                                <td className="px-4 py-2 text-base text-black font-medium align-middle whitespace-nowrap text-center">{room.quantity}</td>
                                <td className="px-4 py-2 text-right text-base font-medium align-middle whitespace-nowrap">
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

            {/* Pagination UI */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage <= 1}
                    className="px-4 py-2 mx-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
                >
                    Trang trước
                </button>
                <span className="m-2">{currentPage} / {Math.ceil(totalRooms / pageSize)}</span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage >= Math.ceil(totalRooms / pageSize)}
                    className="px-4 py-2 mx-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
                >
                    Trang sau
                </button>
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
                itemName="room"
                loading={loading}
            />
        </div>
    );
};

export default RoomList;
