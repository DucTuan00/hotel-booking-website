import React from 'react';
import { Button, Card, Rate, Tag } from 'antd';
import { HeartOutlined, HeartFilled, EyeOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { Room } from '@/pages/user/Rooms';
import { COLORS, TYPOGRAPHY } from '@/config/constants';
import { formatPrice, getAvailabilityColor, getAvailabilityText } from '@/pages/user/Rooms';

interface RoomCardProps {
  room: Room;
  index: number;
  onToggleFavorite: (roomId: number) => void;
  onShowDetails: (room: Room) => void;
  onBookRoom: (room: Room) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  index,
  onToggleFavorite,
  onShowDetails,
  onBookRoom,
}) => {
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
            src={room.images[0]}
            alt={room.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          {room.discount && (
            <div 
              className="absolute top-4 left-4 px-3 py-1 rounded-full text-white text-sm font-medium"
              style={{ backgroundColor: COLORS.secondary }}
            >
              -{room.discount}%
            </div>
          )}
          <div className="absolute top-4 right-4">
            <Button
              type="text"
              icon={room.isFavorite ? <HeartFilled /> : <HeartOutlined />}
              onClick={() => onToggleFavorite(room.id)}
              className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full"
              style={{
                color: room.isFavorite ? COLORS.secondary : COLORS.gray[600]
              }}
            />
          </div>
          <div className="absolute bottom-4 right-4">
            <Tag 
              color={getAvailabilityColor(room.availability)}
              className="font-medium"
            >
              {getAvailabilityText(room.availability)}
            </Tag>
          </div>
        </div>
      }
    >
      <div className="p-6">
        <div className="mb-3">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 
                className="text-xl font-semibold mb-1 line-clamp-2"
                style={{ 
                  fontFamily: TYPOGRAPHY.fontFamily.primary,
                  color: COLORS.gray[900]
                }}
              >
                {room.name}
              </h3>
              <p className="text-gray-600 text-sm">{room.type}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 mb-3">
            <Rate disabled defaultValue={room.rating} allowHalf className="text-sm" />
            <span className="text-sm text-gray-600">({room.reviews} đánh giá)</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {room.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <span className="flex items-center gap-1">
            📐 {room.size}m²
          </span>
          <span className="flex items-center gap-1">
            🛏️ {room.bedType}
          </span>
          <span className="flex items-center gap-1">
            <UserOutlined /> {room.maxGuests}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {room.amenities.slice(0, 3).map(amenity => (
            <Tag key={amenity} className="text-xs">
              {amenity}
            </Tag>
          ))}
          {room.amenities.length > 3 && (
            <Tag className="text-xs">
              +{room.amenities.length - 3}
            </Tag>
          )}
        </div>

        <div className="flex items-end justify-between">
          <div>
            {room.originalPrice && (
              <span className="text-sm text-gray-400 line-through block">
                {formatPrice(room.originalPrice)}
              </span>
            )}
            <div className="flex items-baseline gap-2">
              <span 
                className="text-xl font-bold"
                style={{ color: COLORS.primary }}
              >
                {formatPrice(room.price)}
              </span>
              <span className="text-gray-600 text-sm">/đêm</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              type="default"
              icon={<EyeOutlined />}
              onClick={() => onShowDetails(room)}
              className="flex items-center"
            >
              Chi tiết
            </Button>
            <Button
              type="primary"
              icon={<CalendarOutlined />}
              onClick={() => onBookRoom(room)}
              disabled={room.availability === 'unavailable'}
              style={{
                backgroundColor: room.availability === 'unavailable' ? '#d9d9d9' : COLORS.primary,
                borderColor: room.availability === 'unavailable' ? '#d9d9d9' : COLORS.primary,
              }}
            >
              Đặt ngay
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RoomCard;
