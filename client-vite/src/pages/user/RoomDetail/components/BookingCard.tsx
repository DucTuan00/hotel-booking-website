import React from "react";
import { Button } from "antd";
import { Room } from "@/types/room";
import { COLORS } from "@/config/constants";

interface BookingCardProps {
    room: Room;
    onBook: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ room, onBook }) => {
    return (
        <div>
            <div>
                <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-xl font-semibold">
                        Đặt phòng của bạn
                    </span>
                </div>
            </div>

            <div className="border-solid border-b-1 border-gray-300 mb-6"></div>

            <Button
                type="primary"
                size="large"
                onClick={onBook}
                disabled={room.quantity === 0}
                block
                className="mb-4"
                style={{
                    backgroundColor: room.quantity === 0 ? "#d9d9d9" : COLORS.primary,
                    borderColor: room.quantity === 0 ? "#d9d9d9" : COLORS.primary,
                    height: "48px",
                    fontSize: "16px",
                }}
            >
                {room.quantity === 0 ? "HẾT PHÒNG" : "ĐẶT NGAY"}
            </Button>
        </div>
    );
};

export default BookingCard;
