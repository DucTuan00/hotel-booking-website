import React, { useState, useEffect, useCallback } from 'react';
import { Button, Space, Image, Popconfirm, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import RestaurantServiceForm from './Form';
import Notification from '@/components/Notification';
import AdminTable from '@/components/AdminTable';
import SearchTableAdmin, { SearchFilters } from '@/components/SearchTableAdmin';
import restaurantServiceService from '@/services/restaurants/restaurantServiceService';
import { RestaurantService } from '@/types/restaurant';
import type { TableColumnsType } from 'antd';

interface NotificationMessage {
    type: 'success' | 'error';
    text: string;
}

const { Text } = Typography;

const RestaurantServiceList: React.FC = () => {
    const [services, setServices] = useState<RestaurantService[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [editingService, setEditingService] = useState<RestaurantService | null>(null);
    const [message, setMessage] = useState<NotificationMessage | null>(null);
    const [searchText, setSearchText] = useState<string>('');

    const fetchServices = useCallback(async () => {
        setLoading(true);
        try {
            const data = await restaurantServiceService.getAllRestaurantServices(searchText);
            setServices(data.services as RestaurantService[]);
        } catch (error) {
            console.error("Error when fetch restaurant services:", error);
            setMessage({ type: 'error', text: 'Tải danh sách dịch vụ nhà hàng thất bại.' });
            setServices([]);
        } finally {
            setLoading(false);
        }
    }, [searchText]);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    const handleSearch = (filters: SearchFilters) => {
        setSearchText(filters.searchText?.trim() || '');
    };

    const showModal = () => {
        setIsModalVisible(true);
        setEditingService(null);
    };

    const handleEdit = (service: RestaurantService) => {
        setIsModalVisible(true);
        setEditingService(service);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingService(null);
    };

    const handleFormSubmit = async (
        isLoadingFromChild: boolean,
        data: RestaurantService | null,
        error?: unknown
    ) => {
        setLoading(isLoadingFromChild);
        
        if (error) {
            const errorMessage = typeof error === 'string' ? error : 
                (editingService ? 'Cập nhật dịch vụ nhà hàng thất bại.' : 'Thêm dịch vụ nhà hàng thất bại.');
            setMessage({ type: 'error', text: errorMessage });
            return;
        }
        
        if (!isLoadingFromChild && data) {
            setMessage({ 
                type: 'success', 
                text: editingService ? 'Dịch vụ nhà hàng đã được cập nhật thành công!' : 'Dịch vụ nhà hàng đã được thêm thành công!' 
            });
            setEditingService(null);
            setIsModalVisible(false);
            fetchServices();
        }
    };

    const handleDelete = async (serviceId: string) => {
        setLoading(true);
        try {
            await restaurantServiceService.deleteRestaurantService(serviceId);
            setMessage({ type: 'success', text: 'Dịch vụ nhà hàng đã được xóa thành công!' });
            fetchServices();
        } catch (error) {
            console.error("Error delete restaurant service:", error);
            setMessage({ type: 'error', text: 'Xóa dịch vụ nhà hàng thất bại.' });
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price?: number) => {
        if (price === undefined || price === null) return '-';
        return new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
        }).format(price);
    };

    const columns: TableColumnsType<RestaurantService> = [
        {
            title: 'Hình ảnh',
            dataIndex: 'imagePath',
            key: 'imagePath',
            width: 120,
            render: (imagePath: string) => (
                imagePath ? (
                    <Image
                        width={80}
                        height={60}
                        src={imagePath}
                        alt="Service"
                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                        preview={{
                            mask: <EyeOutlined style={{ fontSize: '18px' }} />
                        }}
                    />
                ) : (
                    <div style={{ 
                        width: 80, 
                        height: 60, 
                        backgroundColor: '#f5f5f5', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        borderRadius: '8px'
                    }}>
                        <Text type="secondary">No image</Text>
                    </div>
                )
            ),
        },
        {
            title: 'Tên dịch vụ',
            dataIndex: 'title',
            key: 'title',
            width: 200,
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: 250,
            ellipsis: true,
            render: (description: string) => description || '-'
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            width: 150,
            sorter: (a, b) => (a.price || 0) - (b.price || 0),
            render: (price: number) => formatPrice(price)
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 130,
            sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            render: (date: Date) => new Date(date).toLocaleDateString('vi-VN')
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    <Button 
                        type="link" 
                        icon={<EditOutlined />} 
                        onClick={() => handleEdit(record)}
                        size="small"
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xóa dịch vụ nhà hàng"
                        description="Bạn có chắc chắn muốn xóa dịch vụ này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okType="danger"
                    >
                        <Button 
                            type="link" 
                            icon={<DeleteOutlined />} 
                            danger
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
        <div>
            <SearchTableAdmin
                onSearch={handleSearch}
                placeholder="Tìm kiếm theo tên dịch vụ..."
            />

            <AdminTable<RestaurantService>
                title="Quản lý dịch vụ nhà hàng"
                columns={columns}
                dataSource={services}
                loading={loading}
                rowKey="id"
                onAdd={showModal}
                addButtonText="Thêm dịch vụ"
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => 
                        `${range[0]}-${range[1]} của ${total} dịch vụ`,
                }}
                scroll={{ x: 1000 }}
            />

            <RestaurantServiceForm
                visible={isModalVisible}
                onCancel={handleCancel}
                onSubmit={handleFormSubmit}
                editingService={editingService}
            />

            {message && (
                <Notification
                    message={message}
                    onClose={() => setMessage(null)}
                />
            )}
        </div>
    );
};

export default RestaurantServiceList;