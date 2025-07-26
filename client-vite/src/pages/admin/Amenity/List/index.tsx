import React, { useState, useEffect, useCallback } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import AmenityForm from '@/pages/admin/Amenity/Form';
import DeleteConfirm from '@/components/DeleteConfirm';
import Notification from '@/components/Notification';
import amenityService from '@/services/amenityService';
import { ClipLoader } from 'react-spinners';
import { Amenity } from '@/types/amenity';

interface Message {
    type: 'success' | 'error';
    text: string;
}

const AmenityList: React.FC = () => {
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
    const [deleteAmenityId, setDeleteAmenityId] = useState<string | null>(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false);
    const [message, setMessage] = useState<Message | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalAmenities, setTotalAmenities] = useState<number>(0);

    const fetchAmenities = useCallback(async () => {
        setLoading(true);
        try {
            const data = await amenityService.getAllAmenities({ page: currentPage, pageSize });
            setAmenities(data.amenities as Amenity[]);
            setTotalAmenities(data.total ?? 0);
            setPageSize(data.pageSize ?? 5);
        } catch {
            setMessage({ type: 'error', text: 'Tải danh sách tiện nghi thất bại.' });
            setAmenities([]);
            setTotalAmenities(0);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize]);

    useEffect(() => {
        fetchAmenities();
    }, [currentPage, pageSize]);

    const showModal = () => {
        setEditingAmenity(null);
        setMessage(null); // Clear message
        setIsModalVisible(true);
    };

    const handleEdit = (amenity: Amenity) => {
        setEditingAmenity(amenity);
        setMessage(null);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingAmenity(null);
        setMessage(null); // Clear message
    };

    const handleFormSubmit = (isLoadingFromChild: boolean, data: Amenity | null, error?: unknown) => {
        setLoading(isLoadingFromChild);
        if (error) {
            setMessage({ type: 'error', text: editingAmenity ? 'Cập nhật tiện nghi thất bại.' : 'Thêm tiện nghi thất bại.' });
            return;
        }
        if (!isLoadingFromChild && data) {
            const successMessage = editingAmenity ? 'Tiện nghi đã được cập nhật thành công!' : 'Tiện nghi đã được thêm thành công!';
            setMessage({ type: 'success', text: successMessage });
            setEditingAmenity(null);
            setIsModalVisible(false);
            fetchAmenities();
        }
    };

    const handleDeleteConfirm = (amenityId: string) => {
        setDeleteAmenityId(amenityId);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
        setDeleteAmenityId(null);
    };

    const confirmDeleteAmenity = async () => {
        if (!deleteAmenityId) return;
        setLoading(true);
        try {
            await amenityService.deleteAmenity({ id: deleteAmenityId });
            setMessage({ type: 'success', text: 'Tiện nghi đã được xóa thành công!' });
            setDeleteAmenityId(null);
            setIsDeleteModalVisible(false);
            if (amenities.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                fetchAmenities();
            }
        } catch {
            setMessage({ type: 'error', text: 'Xóa tiện nghi thất bại.' });
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
        if (currentPage < Math.ceil(totalAmenities / pageSize)) {
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
            {/* Notification message */}
            <Notification
                message={message}
                onClose={() => setMessage(null)}
            />

            <div className="flex justify-end mb-4">
                <button
                    className="bg-red-900 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={showModal}
                    disabled={loading} // Disable button when loading
                >
                    <div className="flex items-center">
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Thêm tiện nghi mới
                    </div>
                </button>
            </div>

            <div className="shadow-md overflow-x-auto border border-gray-300 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 table-auto w-full">
                    <thead className="bg-red-800">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                                Tên tiện nghi
                            </th>
                            <th scope="col" className="px-4 py-3 text-right text-sm font-medium text-white uppercase tracking-wider">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-300">
                        {amenities.length === 0 && !loading && (
                            <tr>
                                <td colSpan={2} className="text-center py-10 text-gray-500">
                                    Không tìm thấy tiện nghi nào.
                                </td>
                            </tr>
                        )}
                        {amenities.map((amenity: Amenity) => (
                            <tr key={amenity.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 text-base text-black font-medium align-middle">{amenity.name}</td>
                                <td className="px-4 py-4 text-right text-base font-medium whitespace-nowrap">
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

            {/* Pagination UI */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage <= 1}
                    className="px-4 py-2 mx-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
                >
                    Trang trước
                </button>
                <span className="m-2">{currentPage} / {Math.ceil(totalAmenities / pageSize)}</span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage >= Math.ceil(totalAmenities / pageSize)}
                    className="px-4 py-2 mx-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
                >
                    Trang sau
                </button>
            </div>

            <AmenityForm
                visible={isModalVisible}
                onCancel={handleCancel}
                onSubmit={handleFormSubmit}
                initialValues={editingAmenity ?? undefined}
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