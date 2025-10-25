import React from 'react';
import { Button, Card, Tag } from 'antd';
import { EyeOutlined, CalendarOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';
import { Room } from "@/types/room";
import { COLORS, TYPOGRAPHY } from '@/config/constants';
import { formatPrice } from '@/pages/user/Rooms';

interface RoomCardProps {
  room: Room;
  index: number;
  onShowDetails: (room: Room) => void;
  onBookRoom: (room: Room) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  index,
  onShowDetails,
  onBookRoom,
}) => {
  // Get first image or placeholder
  const firstImage = room.images && room.images.length > 0 
    ? room.images[0].path 
    : '/images/default-image.jpg';

  // Get availability status based on quantity
  const getAvailabilityStatus = () => {
    if (room.quantity === 0) return { text: 'Hết phòng', color: '#ff4d4f' };
    if (room.quantity <= 3) return { text: 'Sắp hết', color: '#faad14' };
    return { text: 'Còn phòng', color: '#52c41a' };
  };

  const availability = getAvailabilityStatus();
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
            className="w-full h-full object-cover transition-transform duration-300"
          />
          <div className="absolute bottom-4 right-4">
            <Tag 
              color={availability.color}
              className="font-medium"
            >
              {availability.text}
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
              <p className="text-gray-600 text-sm">{room.roomType}</p>
            </div>
          </div>
        </div>

        {room.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 whitespace-pre-line">
            {room.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          {room.roomArea && (
            <span className="flex items-center gap-1">
              <img 
              src="/images/area.png" 
              alt=""
              className="w-4 h-4"
              /> {room.roomArea}m²
            </span>
          )}
          <span className="flex items-center gap-1">
            <UserOutlined /> {room.maxGuests} người
          </span>
          <span className="flex items-center gap-1">
            <HomeOutlined /> {room.quantity} phòng
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {room.amenities.slice(0, 3).map(amenity => (
            <Tag key={amenity.id} className="text-xs">
              {amenity.name}
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
              disabled={room.quantity === 0}
              style={{
                backgroundColor: room.quantity === 0 ? '#d9d9d9' : COLORS.primary,
                borderColor: room.quantity === 0 ? '#d9d9d9' : COLORS.primary,
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
