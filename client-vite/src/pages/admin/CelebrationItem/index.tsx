import React, { useState, useEffect, useCallback } from 'react';
import { Button, Space, Image, Popconfirm, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import CelebrateItemForm from './Form';
import Notification from '@/components/Notification';
import AdminTable from '@/components/AdminTable';
import SearchTableAdmin, { SearchFilters } from '@/components/SearchTableAdmin';
import celebrateItemService from '@/services/celebrations/celebrateItemService';
import { CelebrateItem } from '@/types/celebrate';
import type { TableColumnsType } from 'antd';

interface NotificationMessage {
    type: 'success' | 'error';
    text: string;
}

const { Text } = Typography;

const CelebrationItemList: React.FC = () => {
    const [items, setItems] = useState<CelebrateItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<CelebrateItem | null>(null);
    const [message, setMessage] = useState<NotificationMessage | null>(null);
    const [searchText, setSearchText] = useState<string>('');

    const fetchItems = useCallback(async () => {
        setLoading(true);
        try {
            const data = await celebrateItemService.getAllCelebrateItems(searchText);
            setItems(data.items as CelebrateItem[]);
        } catch (error) {
            console.error("Error when fetch celebration items:", error);
            setMessage({ type: 'error', text: 'Tải danh sách celebration items thất bại.' });
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, [searchText]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleSearch = (filters: SearchFilters) => {
        setSearchText(filters.searchText?.trim() || '');
    };

    const showModal = () => {
        setIsModalVisible(true);
        setEditingItem(null);
    };

    const handleEdit = (item: CelebrateItem) => {
        setIsModalVisible(true);
        setEditingItem(item);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingItem(null);
    };

    const handleFormSubmit = async (
        isLoadingFromChild: boolean,
        data: CelebrateItem | null,
        error?: unknown
    ) => {
        setLoading(isLoadingFromChild);
        
        if (error) {
            const errorMessage = typeof error === 'string' ? error : 
                (editingItem ? 'Cập nhật celebration item thất bại.' : 'Thêm celebration item thất bại.');
            setMessage({ type: 'error', text: errorMessage });
            return;
        }
        
        if (!isLoadingFromChild && data) {
            setMessage({ 
                type: 'success', 
                text: editingItem ? 'Celebration item đã được cập nhật thành công!' : 'Celebration item đã được thêm thành công!' 
            });
            setEditingItem(null);
            setIsModalVisible(false);
            fetchItems();
        }
    };

    const handleDelete = async (itemId: string) => {
        setLoading(true);
        try {
            await celebrateItemService.deleteCelebrateItem(itemId);
            setMessage({ type: 'success', text: 'Celebration item đã được xóa thành công!' });
            fetchItems();
        } catch (error) {
            console.error("Error delete celebration item:", error);
            setMessage({ type: 'error', text: 'Xóa celebration item thất bại.' });
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

    const columns: TableColumnsType<CelebrateItem> = [
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
                        alt="Item image"
                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                        preview={{
                            mask: <EyeOutlined style={{ fontSize: '18px' }} />
                        }}
                    />
                ) : (
                    <div style={{ 
                        width: 80, 
                        height: 60, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        background: '#f0f0f0',
                        borderRadius: '8px'
                    }}>
                        <Text type="secondary">No Image</Text>
                    </div>
                )
            ),
        },
        {
            title: 'Tên món quà',
            dataIndex: 'name',
            key: 'name',
            width: 200,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: 250,
            ellipsis: true,
            render: (description: string) => description || '-',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            width: 150,
            render: (price: number) => formatPrice(price),
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            align: 'center',
            render: (_: any, record: CelebrateItem) => (
                <Space size="small">
                    <Button 
                        type="link" 
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        size="small"
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xóa celebration item"
                        description="Bạn có chắc chắn muốn xóa món này?"
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
                placeholder="Tìm kiếm theo tên món..."
            />

            <AdminTable<CelebrateItem>
                title="Quản lý quà kỷ niệm"
                columns={columns}
                dataSource={items}
                loading={loading}
                rowKey="id"
                onAdd={showModal}
                addButtonText="Thêm mới"
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => 
                        `${range[0]}-${range[1]} của ${total} món quà`,
                }}
                scroll={{ x: 900 }}
            />

            <CelebrateItemForm
                visible={isModalVisible}
                onCancel={handleCancel}
                onSubmit={handleFormSubmit}
                editingItem={editingItem}
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

export default CelebrationItemList;
