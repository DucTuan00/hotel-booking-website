import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import UserForm from './UserForm';
import DeleteConfirm from '../Common/DeleteConfirm';
import userService from '../../../services/userService';
import { ClipLoader } from 'react-spinners';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [message, setMessage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        fetchUsers();
    }, [currentPage, pageSize]); 

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userService.getAllUsers({ page: currentPage, pageSize: pageSize });
            setUsers(data.users);
            setTotalUsers(data.total);
            setPageSize(data.pageSize);
        } catch (error) {
            console.error("Error when fetch users:", error);
            setMessage({ type: 'error', text: 'Failed to load users.' });
            setUsers([]);
            setTotalUsers(0);
        } finally {
            setLoading(false);
        }
    };

    const showModal = () => {
        setIsModalVisible(true);
        setEditingUser(null);
    };

    const handleEdit = (user) => {
        setIsModalVisible(true);
        setEditingUser(user);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleFormSubmit = async (values) => {
        setLoading(true);
        try {
            if (editingUser) {
                await userService.updateUser(editingUser._id, values);
                setMessage({ type: 'success', text: 'Cập nhật người dùng thành công!' });
            } else {
                await userService.createUser(values);
                setMessage({ type: 'success', text: 'Tạo người dùng thành công!' });
            }
            fetchUsers(); 
            setIsModalVisible(false);
        } catch (error) {
            console.error("Error submit form:", error);
            setMessage({ type: 'error', text: editingUser ? 'Cập nhật người dùng thất bại.' : 'Tạo người dùng thất bại.' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteConfirm = (userId) => {
        setDeleteUserId(userId);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
    };

    const confirmDeleteUser = async () => {
        setLoading(true);
        try {
            await userService.deleteUser(deleteUserId); 
            setMessage({ type: 'success', text: 'Xóa người dùng thành công!' });
            fetchUsers();
            setIsDeleteModalVisible(false);
        } catch (error) {
            console.error("Error delete user:", error);
            setMessage({ type: 'error', text: 'Xóa người dùng thất bại.' });
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
        if (currentPage < Math.ceil(totalUsers / pageSize)) {
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
                        Thêm người dùng
                    </div>
                </button>
            </div>

            <div className="shadow-md overflow-hidden border border-gray-300 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 table-fixed w-full">
                    <thead className="bg-red-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-[20%]">
                                Tên người dùng
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-[20%]">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-[20%]">
                                Số điện thoại
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-[7%]">
                                Vai trò
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider w-[10%]">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-300">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{user.phone}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{user.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                                    >
                                        <div className="flex items-center">
                                            <PencilIcon className="h-5 w-5 mr-1" />
                                            Sửa
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteConfirm(user._id)}
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
                <span className="m-2">{currentPage} / {Math.ceil(totalUsers / pageSize)}</span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage >= Math.ceil(totalUsers / pageSize)}
                    className="px-4 py-2 mx-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
                >
                    Trang sau
                </button>
            </div>

            <UserForm
                visible={isModalVisible}
                onCancel={handleCancel}
                onSubmit={handleFormSubmit}
                initialValues={editingUser}
                loading={loading}
            />

            <DeleteConfirm
                visible={isDeleteModalVisible}
                onConfirm={confirmDeleteUser}
                onCancel={handleDeleteCancel}
                itemName="user"
                loading={loading}
            />
        </div>
    );
};

export default UserList;
