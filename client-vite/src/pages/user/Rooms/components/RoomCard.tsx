import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Tag } from 'antd';
import { EyeOutlined, UserOutlined } from '@ant-design/icons';
import { Room } from "@/types/room";
import { COLORS, TYPOGRAPHY } from '@/config/constants';
import { formatPrice } from '@/pages/user/Rooms';
import RatingDisplay from '@/components/RatingDisplay';

interface RoomCardProps {
  room: Room;
  index: number;
}

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  index,
}) => {
  const navigate = useNavigate();

  // Get first image or placeholder
  const firstImage = room.images && room.images.length > 0 
    ? room.images[0].path 
    : '/images/default-image.jpg';

  return (
    <Card
      className="room-card hover:shadow-xl transition-all duration-300 overflow-hidden"
      style={{
        animationDelay: `${index * 100}ms`,
        borderRadius: '12px',
      }}
      bodyStyle={{ padding: 0 }}
      cover={
        <div className="relative h-64 overflow-hidden">
          <img
            src={firstImage}
            alt={room.name}
            className="w-full !h-full object-cover transition-transform duration-300"
          />
        </div>
      }
    >
      <div className="p-3 md:p-6">
        <div className="mb-3">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xl font-semibold mb-1 line-clamp-2"
                style={{ 
                  fontFamily: TYPOGRAPHY.fontFamily.primary,
                  color: COLORS.gray[900],
                }}
              >
                {room.name}
              </p>
              <p className="text-gray-600 text-sm md:text-sm">{room.roomType}</p>
            </div>
          </div>
        </div>

        {room.description && (
          <p className="text-gray-600 text-sm md:text-sm mb-4 line-clamp-2 whitespace-pre-line">
            {room.description}
          </p>
        )}

        {room.averageRating !== undefined && (
          <div className="mb-3">
            <RatingDisplay
              rating={room.averageRating}
              totalReviews={room.totalReviews}
              size="small"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2 md:gap-4 text-sm md:text-sm text-gray-600 mb-4">
          {room.roomArea && (
            <span className="flex items-center gap-1">
              <img 
              src="/images/area.png" 
              alt="area"
              style={{
                width: '20px',
                height: '20px',
                objectFit: 'contain',
                flexShrink: 0
              }}
              /> {room.roomArea}m²
            </span>
          )}
          <span className="flex items-center gap-1">
            <UserOutlined className="text-base md:text-sm flex-shrink-0" /> {room.maxGuests} người
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {room.amenities.slice(0, 3).map(amenity => (
            <Tag key={amenity.id} className="text-xs">
              {amenity.name}
            </Tag>
          ))}
          {room.amenities.length > 3 && (
            <Tag className="text-xs md:text-xs">
              +{room.amenities.length - 3}
            </Tag>
          )}
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span 
                className="text-xl font-bold"
                style={{ color: COLORS.primary }}
              >
                {formatPrice(room.price)}
              </span>
              <span className="text-gray-600 text-sm md:text-sm">/đêm</span>
            </div>
          </div>
          
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/rooms/${room.id}`)}
            className="flex items-center"
            style={{
              backgroundColor: COLORS.primary,
              borderColor: COLORS.primary,
            }}
          >
            Chi tiết
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default RoomCard;
