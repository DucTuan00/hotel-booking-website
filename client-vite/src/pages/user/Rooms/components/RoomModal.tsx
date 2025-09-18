import React from 'react';
import { Button, Modal, Tag } from 'antd';
import { Room } from '@/pages/user/Rooms';
import { COLORS } from '@/config/constants';
import { formatPrice, getAvailabilityColor, getAvailabilityText } from '@/pages/user/Rooms';

interface RoomModalProps {
  room: Room | null;
  isVisible: boolean;
  onClose: () => void;
  onBookRoom: (room: Room) => void;
}

const RoomModal: React.FC<RoomModalProps> = ({
  room,
  isVisible,
  onClose,
  onBookRoom,
}) => {
  if (!room) return null;

  return (
    <Modal
      title={room.name}
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Đóng
        </Button>,
        <Button 
          key="book" 
          type="primary" 
          onClick={() => onBookRoom(room)}
          style={{
            backgroundColor: COLORS.primary,
            borderColor: COLORS.primary,
          }}
          disabled={room.availability === 'unavailable'}
        >
          Đặt phòng ngay
        </Button>,
      ]}
      width={800}
    >
      <div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {room.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${room.name} ${index + 1}`}
              className="w-full h-32 object-cover rounded"
            />
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-semibold mb-2">Thông tin phòng</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>Loại phòng: <span className="font-medium">{room.type}</span></div>
              <div>Diện tích: <span className="font-medium">{room.size}m²</span></div>
              <div>Giường: <span className="font-medium">{room.bedType}</span></div>
              <div>Số khách: <span className="font-medium">{room.maxGuests} người</span></div>
              <div className="flex items-center gap-2">
                Tình trạng: 
                <Tag color={getAvailabilityColor(room.availability)}>
                  {getAvailabilityText(room.availability)}
                </Tag>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Giá phòng</h4>
            <div className="text-sm text-gray-600">
              {room.originalPrice && (
                <div className="line-through text-gray-400">
                  {formatPrice(room.originalPrice)}
                </div>
              )}
              <div className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                {formatPrice(room.price)}/đêm
              </div>
              {room.discount && (
                <div className="text-sm text-green-600">
                  Tiết kiệm {room.discount}%
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Mô tả</h4>
          <p className="text-gray-600">{room.description}</p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">Tiện nghi</h4>
          <div className="flex flex-wrap gap-2">
            {room.amenities.map(amenity => (
              <Tag key={amenity}>{amenity}</Tag>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RoomModal;
