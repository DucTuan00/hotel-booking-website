import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import UserForm from './UserForm';
import DeleteConfirm from '../Common/DeleteConfirm'; // Giữ lại vì có thể tái sử dụng

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [message, setMessage] = useState(null);

    // Dữ liệu mẫu (thay bằng API call sau)
    const dummyUsers = [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Editor' },
    ];

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setUsers(dummyUsers);
            setLoading(false);
        }, 500);
    }, []);

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
        setTimeout(() => {
            if (editingUser) {
                const updatedUsers = users.map((user) =>
                    user.id === editingUser.id ? { ...editingUser, ...values } : user
                );
                setUsers(updatedUsers);
                setMessage({ type: 'success', text: 'User updated successfully!' }); // Thay message.success
            } else {
                const newUser = { id: users.length + 1, ...values };
                setUsers([...users, newUser]);
                setMessage({ type: 'success', text: 'User created successfully!' }); // Thay message.success
            }
            setIsModalVisible(false);
            setLoading(false);
        }, 500);
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
        setTimeout(() => {
            const updatedUsers = users.filter((user) => user.id !== deleteUserId);
            setUsers(updatedUsers);
            setMessage({ type: 'success', text: 'User deleted successfully!' }); // Thay message.success
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
                        Thêm người dùng
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
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                                    >
                                        <div className="flex items-center">
                                            <PencilIcon className="h-5 w-5 mr-1" />
                                            Edit
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteConfirm(user.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <div className="flex items-center">
                                            <TrashIcon className="h-5 w-5 mr-1" />
                                            Delete
                                        </div>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
