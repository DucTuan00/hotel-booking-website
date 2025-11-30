import React, { useEffect, useState } from 'react';
import { List, Empty, Pagination, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import RatingDisplay from '@/components/RatingDisplay';
import reviewService from '@/services/reviews/reviewService';
import { Review } from '@/types/review';

interface ReviewListProps {
    roomId: string;
    refreshTrigger?: number;
}

const ReviewList: React.FC<ReviewListProps> = ({ roomId, refreshTrigger = 0 }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const pageSize = 5;

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const data = await reviewService.getReviewsByRoom(roomId, currentPage, pageSize);
            setReviews(data.reviews);
            setTotal(data.total);
            setAverageRating(data.averageRating);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, currentPage, refreshTrigger]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading && reviews.length === 0) {
        return (
            <div className="flex justify-center items-center py-12">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="!space-y-4">
            {/* Average Rating Summary */}
            <div className="border-solid border-b-1 border-gray-300"></div>
            {total > 0 && (
                <div className="">
                    <div className="flex items-center gap-4">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gray-800">
                                {averageRating.toFixed(1)}
                            </div>
                            <div className="text-sm text-gray-600">
                                trên 5
                            </div>
                        </div>
                        <div className="flex-1">
                            <RatingDisplay
                                rating={averageRating}
                                totalReviews={total}
                                size="large"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div className="border-solid border-b-1 border-gray-300 !mb-4"></div>
            {reviews.length === 0 ? (
                <Empty
                    description="Chưa có đánh giá nào"
                    className="py-12"
                />
            ) : (
                <>
                    <List
                        dataSource={reviews}
                        renderItem={(review) => (
                            <div className="">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                            <UserOutlined className="text-xl text-gray-500" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-semibold text-gray-800 !mb-2">
                                                    {review.userId.name}
                                                </p>
                                                <RatingDisplay
                                                    rating={review.rating}
                                                    size="small"
                                                    showText={false}
                                                />
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {formatDate(review.createdAt)}
                                            </span>
                                        </div>
                                        {review.comment && (
                                            <p className="text-gray-600 leading-relaxed">
                                                {review.comment}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="border-solid border-b-1 border-gray-300 my-4"></div>
                            </div>
                        )}
                    />
                    
                    {total > pageSize && (
                        <div className="flex justify-center mt-6">
                            <Pagination
                                current={currentPage}
                                total={total}
                                pageSize={pageSize}
                                onChange={setCurrentPage}
                                showSizeChanger={false}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ReviewList;
