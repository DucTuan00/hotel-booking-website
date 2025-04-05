import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import AmenityForm from './AmenityForm';
import DeleteConfirm from '../Common/DeleteConfirm';

const AmenityList = () => {
    const [amenities, setAmenities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingAmenity, setEditingAmenity] = useState(null);
    const [deleteAmenityId, setDeleteAmenityId] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [message, setMessage] = useState(null); // State cho thông báo

    // Dữ liệu mẫu amenity (thay bằng API call sau)
    const dummyAmenities = [
        { id: 1, name: 'Wifi miễn phí', description: 'Truy cập internet tốc độ cao miễn phí' },
        { id: 2, name: 'Hồ bơi', description: 'Hồ bơi ngoài trời' },
        // ... more dummy amenities
    ];

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setAmenities(dummyAmenities);
            setLoading(false);
        }, 500);
    }, []);

    const showModal = () => {
        setIsModalVisible(true);
        setEditingAmenity(null);
    };

    const handleEdit = (amenity) => {
        setIsModalVisible(true);
        setEditingAmenity(amenity);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleFormSubmit = (values) => {
        setLoading(true);
        setTimeout(() => {
            if (editingAmenity) {
                const updatedAmenities = amenities.map(amenity => amenity.id === editingAmenity.id ? { ...editingAmenity, ...values } : amenity);
                setAmenities(updatedAmenities);
                setMessage({ type: 'success', text: 'Tiện nghi đã được cập nhật thành công!' });
            } else {
                const newAmenity = { id: amenities.length + 1, ...values };
                setAmenities([...amenities, newAmenity]);
                setMessage({ type: 'success', text: 'Tiện nghi đã được thêm thành công!' });
            }
            setIsModalVisible(false);
            setLoading(false);
        }, 500);
    };

    const handleDeleteConfirm = (amenityId) => {
        setDeleteAmenityId(amenityId);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
    };

    const confirmDeleteAmenity = () => {
        setLoading(true);
        setTimeout(() => {
            const updatedAmenities = amenities.filter(amenity => amenity.id !== deleteAmenityId);
            setAmenities(updatedAmenities);
            setMessage({ type: 'success', text: 'Tiện nghi đã được xóa thành công!' });
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
                    className="bg-red-900 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={showModal}
                >
                    <div className="flex items-center">
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Thêm tiện nghi mới
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
                                Tên tiện nghi
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                Mô tả
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-300">
                        {amenities.map(amenity => (
                            <tr key={amenity.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{amenity.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{amenity.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{amenity.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(amenity)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                                    >
                                        <div className="flex items-center">
                                            <PencilIcon className="h-5 w-5 mr-1" />
                                            Sửa
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteConfirm(amenity.id)}
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

            <AmenityForm
                visible={isModalVisible}
                onCancel={handleCancel}
                onSubmit={handleFormSubmit}
                initialValues={editingAmenity}
                loading={loading}
            />

            <DeleteConfirm
                visible={isDeleteModalVisible}
                onConfirm={confirmDeleteAmenity}
                onCancel={handleDeleteCancel}
                itemName="tiện nghi"
                loading={loading}
            />
        </div>
    );
};

export default AmenityList;
