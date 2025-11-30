import React from 'react';
import { Rate } from 'antd';

interface RatingDisplayProps {
    rating: number;
    totalReviews?: number;
    size?: 'small' | 'default' | 'large';
    showText?: boolean;
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({
    rating,
    totalReviews,
    size = 'default',
    showText = true
}) => {
    const sizeMap = {
        small: 14,
        default: 20,
        large: 24
    };

    return (
        <div className="flex items-center gap-2">
            <Rate
                disabled
                allowHalf
                value={rating}
                style={{ fontSize: sizeMap[size], color: '#D4902A' }}
            />
            {showText && (
                <span className="text-gray-600">
                    {rating > 0 ? (
                        <>
                            <span className="font-semibold text-gray-800">{rating.toFixed(1)}</span>
                            {totalReviews !== undefined && (
                                <span className="ml-1">({totalReviews} {totalReviews === 1 ? 'đánh giá' : 'đánh giá'})</span>
                            )}
                        </>
                    ) : (
                        <span className="text-gray-500">Chưa có đánh giá</span>
                    )}
                </span>
            )}
        </div>
    );
};

export default RatingDisplay;
