import React from 'react';
import RoomCard from '../RoomCard/RoomCard';
//import './FeaturedRooms.css'; // CSS cho FeaturedRooms

// Mock data - Thay bằng dữ liệu từ API của bạn
const featuredRooms = [
  {
    id: 1,
    name: 'Phòng Suite sang trọng',
    room_type: 'Suite',
    price: 250,
    images: ['/images/suite1.jpg', '/images/suite2.jpg'],
    max_guests: 4,
    description: 'Một phòng suite tuyệt đẹp với tầm nhìn ra thành phố.',
  },
  {
    id: 2,
    name: 'Phòng Double tiện nghi',
    room_type: 'Double',
    price: 150,
    images: ['/images/double1.jpg', '/images/double2.jpg'],
    max_guests: 2,
    description: 'Phòng double thoải mái với đầy đủ tiện nghi.',
  },
  // ... thêm các phòng khác
];

function FeaturedRooms() {
  return (
    <div className="featured-rooms">
      <h2>Phòng Nổi Bật</h2>
      <div className="room-list">
        {featuredRooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}

export default FeaturedRooms;