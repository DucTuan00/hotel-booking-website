import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spin } from "antd";
import dayjs from "dayjs";
import { Room } from "@/types/room";
import { Message } from "@/types/message";
import roomService from "@/services/rooms/roomService";
import Notification from "@/components/Notification";
import RoomGallery from "@/pages/user/RoomDetail/components/RoomGallery";
import RoomInfo from "@/pages/user/RoomDetail/components/RoomInfo";
import RoomCalendar from "@/pages/user/RoomDetail/components/RoomCalendar";
import BookingCard from "@/pages/user/RoomDetail/components/BookingCard";
import CalendarModal from "@/pages/user/RoomDetail/components/CalendarModal";
import ReviewList from "@/components/ReviewList";

const RoomDetail: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [quickBookModalOpen, setQuickBookModalOpen] = useState(false);

  useEffect(() => {
    const loadRoomDetail = async () => {
      if (!roomId) {
        setMessage({
          type: "error",
          text: "Không tìm thấy ID phòng",
        });
        return;
      }

      setIsLoading(true);
      try {
        const roomData = await roomService.getRoomById(roomId);
        setRoom(roomData);
      } catch (error) {
        console.error("Error loading room detail:", error);
        setMessage({
          type: "error",
          text: "Không thể tải thông tin phòng. Vui lòng thử lại sau.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadRoomDetail();
  }, [roomId]);

  const handleBookRoom = () => {
    // Open quick book modal instead of navigating directly
    setQuickBookModalOpen(true);
  };

  const handleDateSelect = (checkIn: Date, checkOut: Date, quantity: number, adults: number, children: number) => {
    if (!room) return;
    
    // Navigate to booking page with selected dates and guest info
    const params = new URLSearchParams({
      roomId: room.id,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      quantity: quantity.toString(),
      adults: adults.toString(),
      children: children.toString()
    });
    navigate(`/booking?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Notification message={message} onClose={() => setMessage(null)} />
        <p className="text-gray-600 mb-4">Không tìm thấy thông tin phòng</p>
        <Button onClick={() => navigate("/rooms")}>Quay lại danh sách phòng</Button>
      </div>
    );
  }

  return (
    <div className="room-detail-page min-h-screen bg-gray-50">
      <Notification message={message} onClose={() => setMessage(null)} />

      <div className="relative w-full h-80 overflow-hidden">
        <img
          src={room.images && room.images.length > 0 ? room.images[0].path : "/images/default-image.jpg"}
          alt={room.name}
          className="w-full !h-full object-cover"
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-5xl font-bold tracking-wide uppercase">
            {room.name}
          </h1>
        </div>
      </div>

      {/* Decorative separator */}
      <div className="w-full bg-gradient-to-b from-gray-200 to-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-24 h-1 bg-[#D4902A] mx-auto"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Images and info */}
          <div className="lg:col-span-2">
            <RoomGallery images={room.images} roomName={room.name} />
            <RoomInfo room={room} />
            <RoomCalendar 
              roomId={room.id} 
              defaultPrice={room.price}
              maxRooms={room.quantity}
              maxGuests={room.maxGuests}
              onDateSelect={handleDateSelect}
            />

            {/* Reviews Section */}
            <div className="">
              <h2 className="text-2xl font-bold mb-6">Đánh giá của khách hàng</h2>
              <ReviewList roomId={room.id} />
            </div>
          </div>

          {/* Right column - Booking card */}
          <div className="lg:col-span-1">
            <BookingCard room={room} onBook={handleBookRoom} />
          </div>
        </div>
      </div>

      {/* Quick Book Calendar Modal */}
      {room && (
        <CalendarModal
          open={quickBookModalOpen}
          onClose={() => setQuickBookModalOpen(false)}
          onConfirm={handleDateSelect}
          roomId={room.id}
          maxRooms={room.quantity}
          maxGuests={room.maxGuests}
          initialDate={dayjs().format('YYYY-MM-DD')}
        />
      )}
    </div>
  );
};

export default RoomDetail;
