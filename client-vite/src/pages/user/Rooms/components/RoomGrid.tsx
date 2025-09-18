import React from 'react';
import { Room } from '@/pages/user/Rooms';
import RoomCard from '@/pages/user/Rooms/components/RoomCard';
import LoadingSpinner from '@/components/LoadingSpinner';

interface RoomGridProps {
  rooms: Room[];
  isLoading?: boolean;
  onToggleFavorite: (roomId: number) => void;
  onShowDetails: (room: Room) => void;
  onBookRoom: (room: Room) => void;
}

const RoomGrid: React.FC<RoomGridProps> = ({
  rooms,
  isLoading = false,
  onToggleFavorite,
  onShowDetails,
  onBookRoom,
}) => {
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <LoadingSpinner message="Đang tải danh sách phòng..." />
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-16">
          <h3 className="text-2xl font-light text-gray-600 mb-4">
            Không tìm thấy phòng nào
          </h3>
          <p className="text-gray-500">
            Hãy thử thay đổi bộ lọc hoặc tiêu chí sắp xếp
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {rooms.map((room, index) => (
          <RoomCard
            key={room.id}
            room={room}
            index={index}
            onToggleFavorite={onToggleFavorite}
            onShowDetails={onShowDetails}
            onBookRoom={onBookRoom}
          />
        ))}
      </div>
    </div>
  );
};

export default RoomGrid;
