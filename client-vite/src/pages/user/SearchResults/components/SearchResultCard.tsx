import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { COLORS, TYPOGRAPHY } from '@/config/constants';
import { Room } from '@/types/room';
import { formatPrice } from '@/utils/formatPrice';

interface SearchResultCardProps {
  room: Room;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ room }) => {
  const navigate = useNavigate();
  
  const handleViewDetail = () => {
    navigate(`/rooms/${room.id}`);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-200">
      <div className="flex flex-col md:flex-row">
        {/* Room Image */}
        <div className="md:w-80 h-64 md:h-auto relative">
          <img
            src={room.images && room.images.length > 0 ? room.images[0].path : '/images/placeholder.jpg'}
            alt={room.name}
            className="w-full h-full object-cover"
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
              </div>

              <p className="text-gray-600 mb-3">
                {room.roomType} • {room.roomArea ? `${room.roomArea}m²` : 'N/A'} • {room.maxGuests} khách
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {room.amenities.slice(0, 4).map((amenity) => (
                  <span
                    key={amenity.id}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {amenity.name}
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
                onClick={handleViewDetail}
                style={{
                  backgroundColor: COLORS.primary,
                  borderColor: COLORS.primary,
                  fontFamily: TYPOGRAPHY.fontFamily.secondary,
                }}
              >
                Chi tiết
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultCard;