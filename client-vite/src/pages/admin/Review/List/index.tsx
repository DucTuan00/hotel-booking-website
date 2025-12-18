import React, { useState, useEffect, useCallback } from 'react';
import { Tag, Tooltip, Rate, Popconfirm, Button, Space, Select, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import Notification from '@/components/Notification';
import AdminTable from '@/components/AdminTable';
import BaseDetail from '@/components/BaseDetail';
import SearchTableAdmin, { SearchFilters } from '@/components/SearchTableAdmin';
import reviewService from '@/services/reviews/reviewService';
import moment from 'moment';
import { AdminReview } from '@/types/review';
import type { TableColumnsType } from 'antd';
import { Message } from '@/types/message';

const ReviewList: React.FC = () => {
    const [reviews, setReviews] = useState<AdminReview[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<Message | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalReviews, setTotalReviews] = useState<number>(0);
    const [currentSearchParams, setCurrentSearchParams] = useState<any>({});
    const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);
    
    // Modal state
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = { 
                page: currentPage, 
                pageSize: pageSize,
                ...currentSearchParams
            };

            if (ratingFilter) {
                params.rating = ratingFilter;
            }

            const data = await reviewService.getAllReviews(params);
            setReviews(data.reviews);
            setTotalReviews(data.total);
        } catch (error) {
            console.error("Error when fetch reviews:", error);
            setMessage({ type: 'error', text: 'Tải danh sách đánh giá thất bại.' });
            setReviews([]);
            setTotalReviews(0);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, currentSearchParams, ratingFilter]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleSearch = (filters: SearchFilters) => {
        setCurrentPage(1); 
        
        if (!filters.searchText || !filters.searchText.trim()) {
            setCurrentSearchParams({});
            return;
        }
        
        const searchText = filters.searchText.trim();
        const searchParams: any = {
            search: searchText  
        };
        
        setCurrentSearchParams(searchParams);
    };

    const handleViewDetail = (review: AdminReview) => {
        setSelectedReview(review);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedReview(null);
    };

    const handleDelete = async (reviewId: string) => {
        setLoading(true);
        try {
            await reviewService.deleteReview(reviewId);
            setMessage({ type: 'success', text: 'Đánh giá đã được xóa thành công!' });
            
            // If deleting the last item on current page and not on first page, go to previous page
            if (reviews.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                await fetchReviews();
            }
            
            // Close modal if deleting the selected review
            if (selectedReview?.id === reviewId) {
                handleCloseModal();
            }
        } catch (error) {
            console.error("Error delete review:", error);
            setMessage({ type: 'error', text: 'Xóa đánh giá thất bại.' });
        } finally {
            setLoading(false);
        }
    };

    const handleRatingFilterChange = (value: number | undefined) => {
        setRatingFilter(value);
        setCurrentPage(1);
    };

    const columns: TableColumnsType<AdminReview> = [
        {
            title: 'Khách hàng',
            key: 'user',
            width: 180,
            render: (_, review) => (
                <div>
                    <div>
                        {review.userId?.name || ''}
                    </div>
                </div>
            ),
        },
        {
            title: 'Phòng',
            key: 'room',
            width: 200,
            render: (_, review) => (
                <div>
                    <div style={{ fontWeight: 500 }}>
                        {review.roomId?.name || ''}
                    </div>
                </div>
            ),
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            width: 180,
            sorter: (a, b) => a.rating - b.rating,
            render: (rating: number) => (
                <div className="flex items-center gap-2">
                    <Rate disabled value={rating} style={{ fontSize: 14, color: '#D4902A' }} />
                    <span>{rating}/5</span>
                </div>
            ),
        },
        {
            title: 'Nội dung',
            dataIndex: 'comment',
            key: 'comment',
            width: 250,
            ellipsis: true,
            render: (comment: string | undefined) => (
                <Tooltip title={comment}>
                    <span>{comment || <span className="text-gray-400">Không có nhận xét</span>}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 150,
            sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
            render: (date: string) => date ? moment(date).format('DD/MM/YYYY HH:mm') : '-',
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: 150,
            render: (_, review) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(review)}
                        size="small"
                    >
                        Xem
                    </Button>
                    <Popconfirm
                        title="Xóa đánh giá"
                        description="Bạn có chắc chắn muốn xóa đánh giá này?"
                        onConfirm={() => handleDelete(review.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
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
            
            <div className="flex items-center gap-4 mb-4">
                <SearchTableAdmin
                    onSearch={handleSearch}
                    placeholder="Tìm kiếm theo tên khách hàng, phòng, nội dung..."
                />
                <Select
                    placeholder="Lọc theo số sao"
                    allowClear
                    style={{ width: 160 }}
                    value={ratingFilter}
                    onChange={handleRatingFilterChange}
                    options={[
                        { value: 5, label: '5 sao' },
                        { value: 4, label: '4 sao' },
                        { value: 3, label: '3 sao' },
                        { value: 2, label: '2 sao' },
                        { value: 1, label: '1 sao' },
                    ]}
                />
            </div>

            <AdminTable<AdminReview>
                title="Quản lý đánh giá"
                showAddButton={false}
                columns={columns}
                dataSource={reviews}
                loading={loading}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalReviews,
                    showSizeChanger: true,
                    showQuickJumper: false,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} đánh giá`,
                    onChange: (page, size) => {
                        setCurrentPage(page);
                        if (size && size !== pageSize) {
                            setPageSize(size);
                            setCurrentPage(1);
                        }
                    },
                }}
                rowKey="id"
                scroll={{ x: 1000 }}
            />

            {/* Review Detail Modal */}
            <Modal
                title="Chi tiết đánh giá"
                open={isModalVisible}
                onCancel={handleCloseModal}
                footer={[
                    <Button key="close" onClick={handleCloseModal}>
                        Đóng
                    </Button>,
                    <Popconfirm
                        key="delete"
                        title="Xóa đánh giá"
                        description="Bạn có chắc chắn muốn xóa đánh giá này?"
                        onConfirm={() => selectedReview && handleDelete(selectedReview.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button danger icon={<DeleteOutlined />}>
                            Xóa
                        </Button>
                    </Popconfirm>
                ]}
                width={600}
            >
                {selectedReview && (
                    <div>
                        {/* Rating Display */}
                        <div className="flex items-center justify-center gap-3 py-4 mb-4">
                            <Rate 
                                disabled 
                                value={selectedReview.rating} 
                                style={{ fontSize: 14, color: '#D4902A' }} 
                            />
                            <Tag 
                                style={{ fontSize: 14, padding: '2px 12px' }}
                            >
                                {selectedReview.rating}/5
                            </Tag>
                        </div>

                        <div className="border border-gray-200 rounded">
                            <BaseDetail 
                                label="Tên khách hàng" 
                                value={selectedReview.userId?.name || ''} 
                            />
                            <BaseDetail 
                                label="ID khách hàng" 
                                value={selectedReview.userId?.id || ''} 
                            />
                            <BaseDetail 
                                label="Tên phòng" 
                                value={selectedReview.roomId?.name || ''} 
                            />
                            <BaseDetail 
                                label="ID phòng" 
                                value={selectedReview.roomId?.id || ''} 
                            />
                            <BaseDetail 
                                label="Nhận xét" 
                                value={
                                    selectedReview.comment ? (
                                        <span className="">{selectedReview.comment}</span>
                                    ) : (
                                        <span className="text-gray-500 italic">Không có nhận xét</span>
                                    )
                                } 
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default ReviewList;
