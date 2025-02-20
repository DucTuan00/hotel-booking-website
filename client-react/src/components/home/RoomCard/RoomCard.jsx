import React from 'react';
//import './RoomCard.css';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap'; // Import Bootstrap Card components

function RoomCard({ room }) {
  return (
    <Card className="room-card">
      <Card.Img variant="top" src={room.images[0]} alt={room.name} /> {/* Ảnh ở trên cùng */}
      <Card.Body>
        <Card.Title>{room.name}</Card.Title> {/* Tiêu đề */}
        <Card.Text>{room.description}</Card.Text> {/* Mô tả */}
        <Card.Text>Loại phòng: {room.room_type}</Card.Text>
        <Card.Text>Giá: ${room.price} / đêm</Card.Text>
        <Link to={`/room/${room.id}`}>
          <Button variant="primary">Xem chi tiết</Button> {/* Nút xem chi tiết */}
        </Link>
      </Card.Body>
    </Card>
  );
}

export default RoomCard;