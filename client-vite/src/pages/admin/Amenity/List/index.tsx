import React, { useState, useEffect, useCallback } from 'react';
import { 
    Button, 
    Space, 
    Popconfirm 
} from 'antd';
import { 
    EditOutlined, 
    DeleteOutlined 
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AdminTable from '@/components/AdminTable';
import AmenityForm from '@/pages/admin/Amenity/Form';
import amenityService from '@/services/amenities/amenityService';
import { Amenity } from '@/types/amenity';
import Notification from '@/components/Notification';

interface Message {
    type: 'success' | 'error';
    text: string;
}

const AmenityList: React.FC = () => {
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalAmenities, setTotalAmenities] = useState<number>(0);
    const [message, setMessage] = useState<Message | null>(null);

    const fetchAmenities = useCallback(async () => {
        setLoading(true);
        try {
            const data = await amenityService.getAllAmenities({ page: currentPage, pageSize });
            setAmenities(data.amenities as Amenity[]);
            setTotalAmenities(data.total ?? 0);
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
    }, [fetchAmenities]);

    const showModal = () => {
        setEditingAmenity(null);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingAmenity(null);
    };

    const handleEdit = (amenity: Amenity) => {
        setEditingAmenity(amenity);
        setIsModalVisible(true);
    };

    const handleFormSubmit = async (values: Omit<Amenity, 'id'>) => {
        try {
            if (editingAmenity) {
                await amenityService.updateAmenity({ id: editingAmenity.id, ...values });
                setMessage({ type: 'success', text: 'Cập nhật tiện nghi thành công!' });
            } else {
                await amenityService.createAmenity(values);
                setMessage({ type: 'success', text: 'Thêm tiện nghi thành công!' });
            }
            await fetchAmenities();
            handleCancel();
        } catch {
            setMessage({ type: 'error', text: editingAmenity ? 'Cập nhật tiện nghi thất bại.' : 'Thêm tiện nghi thất bại.' });
        }
    };

    const handleDelete = async (amenityId: string) => {
        try {
            await amenityService.deleteAmenity({ id: amenityId });
            setMessage({ type: 'success', text: 'Tiện nghi đã được xóa thành công!' });
            
            // If deleting the last item on current page and not on first page, go to previous page
            if (amenities.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                await fetchAmenities();
            }
        } catch {
            setMessage({ type: 'error', text: 'Xóa tiện nghi thất bại.' });
        }
    };

    const columns: ColumnsType<Amenity> = [
        {
            title: 'Tên tiện nghi',
            dataIndex: 'name',
            key: 'name',
            width: '85%',
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: '15%',
            render: (_, record) => (
                <Space>
                    <Button 
                        type="link" 
                        icon={<EditOutlined />} 
                        onClick={() => handleEdit(record)}
                        size="small"
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xác nhận xóa"
                        description="Bạn có chắc chắn muốn xóa tiện nghi này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okType="danger"
                    >
                        <Button
                            type="link" 
                            danger 
                            icon={<DeleteOutlined />}
                            size="small"
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Notification
                message={message}
                onClose={() => setMessage(null)}
            />

            <AdminTable<Amenity>
                title="Quản lý Tiện nghi"
                columns={columns}
                dataSource={amenities}
                rowKey="id"
                loading={loading}
                onAdd={showModal}
                addButtonText="Thêm tiện nghi mới"
                modalTitle={editingAmenity ? 'Cập nhật tiện nghi' : 'Thêm tiện nghi mới'}
                modalVisible={isModalVisible}
                onModalCancel={handleCancel}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalAmenities,
                    onChange: (page: number, size?: number) => {
                        setCurrentPage(page);
                        if (size !== pageSize) {
                            setPageSize(size || 10);
                        }
                    },
                    onShowSizeChange: (_current: number, size: number) => {
                        setCurrentPage(1);
                        setPageSize(size);
                    },
                }}
            >
                <AmenityForm
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    onSubmit={handleFormSubmit}
                    initialValues={editingAmenity ?? undefined}
                    loading={loading}
                />
            </AdminTable>
        </>
    );
};

export default AmenityList;