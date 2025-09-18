import React from 'react';
import { Button, Rate } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { COLORS, TYPOGRAPHY } from '@/config/constants';
import { Room } from '@/pages/user/SearchResults';

interface SearchResultCardProps {
  room: Room;
  onToggleFavorite: (roomId: number) => void;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({
  room,
  onToggleFavorite,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Room Image */}
        <div className="md:w-80 h-64 md:h-auto relative">
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover"
          />
          {room.discount && (
            <div
              className="absolute top-4 left-4 px-2 py-1 text-white text-sm font-medium rounded"
              style={{ backgroundColor: COLORS.secondary }}
            >
              -{room.discount}%
            </div>
          )}
          <Button
            type="text"
            icon={room.isFavorite ? <HeartFilled /> : <HeartOutlined />}
            onClick={() => onToggleFavorite(room.id)}
            className="absolute top-4 right-4 bg-white bg-opacity-80 hover:bg-opacity-100"
            style={{
              color: room.isFavorite ? COLORS.secondary : COLORS.gray[500]
            }}
          />
        </div>

        {/* Room Details */}
        <div className="flex-1 p-6">
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3
                  className="text-xl font-bold text-gray-900"
                  style={{ fontFamily: TYPOGRAPHY.fontFamily.primary }}
                >
                  {room.name}
                </h3>
                <div className="flex items-center gap-1">
                  <Rate disabled defaultValue={room.rating} />
                  <span className="text-sm text-gray-600">({room.reviews})</span>
                </div>
              </div>

              <p className="text-gray-600 mb-3">
                {room.bedType} • {room.size}m² • {room.maxGuests} khách
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {room.amenities.slice(0, 4).map((amenity: string) => (
                  <span
                    key={amenity}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
                {room.amenities.length > 4 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    +{room.amenities.length - 4} tiện ích khác
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                {room.originalPrice && (
                  <span className="text-sm text-gray-500 line-through block">
                    {formatPrice(room.originalPrice)}
                  </span>
                )}
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-2xl font-bold"
                    style={{ color: COLORS.primary }}
                  >
                    {formatPrice(room.price)}
                  </span>
                  <span className="text-gray-500 text-sm">/đêm</span>
                </div>
              </div>

              <Button
                type="primary"
                size="large"
                className="px-8"
                style={{
                  backgroundColor: COLORS.primary,
                  borderColor: COLORS.primary,
                  fontFamily: TYPOGRAPHY.fontFamily.secondary,
                }}
              >
                Đặt ngay
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultCard;