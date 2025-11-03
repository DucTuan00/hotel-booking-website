import React from "react";
import { Tag } from "antd";
import { UserOutlined, HomeOutlined } from "@ant-design/icons";
import { Room } from "@/types/room";
import { COLORS, TYPOGRAPHY } from "@/config/constants";
import { formatPrice } from "@/utils/formatPrice";

interface RoomInfoProps {
    room: Room;
}

const getAvailabilityStatus = (quantity: number) => {
    if (quantity === 0) return { text: "Hết phòng", color: "#ff4d4f" };
    if (quantity <= 3) return { text: "Sắp hết", color: "#faad14" };
    return { text: "Còn phòng", color: "#52c41a" };
};

const RoomInfo: React.FC<RoomInfoProps> = ({ room }) => {
    const availability = getAvailabilityStatus(room.quantity);

    return (
        <div className="mb-6">
            {/* Title and type */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h1
                        className="text-3xl font-bold mb-2"
                        style={{
                            fontFamily: TYPOGRAPHY.fontFamily.primary,
                            color: COLORS.gray[900],
                        }}
                    >
                        {room.name}
                    </h1>
                    <p className="text-gray-600 text-lg">{room.roomType}</p>
                </div>
                <Tag 
                    color={availability.color} 
                    className="text-lg px-4 py-1"
                    style={{ fontSize: '16px', lineHeight: '28px', padding: '4px 16px' }}
                >
                    {availability.text}
                </Tag>
            </div>

            <div className="border-solid border-b-1 border-gray-300 mb-6"></div>

            {/* Room stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-700">
                    <img src="/images/area.png" alt="Area" className="w-10 h-10" />
                    <div>
                        <p className="font-semibold" style={{ marginBottom: '8px' }}>Diện tích</p>
                        <p className="text-sm text-gray-500" style={{ margin: 0 }}>{room.roomArea}m²</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                    <UserOutlined className="text-4xl w-10 h-10" />
                    <div>
                        <p className="font-semibold" style={{ marginBottom: '8px' }}>Số khách</p>
                        <p className="text-sm text-gray-500" style={{ margin: 0 }}>{room.maxGuests} người</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                    <HomeOutlined className="text-4xl w-10 h-10" />
                    <div>
                        <p className="font-semibold" style={{ marginBottom: '8px' }}>Số phòng</p>
                        <p className="text-sm text-gray-500" style={{ margin: 0 }}>{room.quantity} phòng</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                    <img src="/images/dollar.png" alt="Area" className="w-9 h-9" />
                    <div>
                        <p className="font-semibold" style={{ marginBottom: '8px' }}>Giá phòng</p>
                        <p className="text-sm text-gray-500" style={{ margin: 0 }}>Chỉ từ {formatPrice(room.price)}/đêm</p>
                    </div>
                </div>
            </div>

            {/* Description */}
            {room.description && (
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-3">Mô tả</h2>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {room.description}
                    </p>
                </div>
            )}

            {/* Amenities */}
            {room.amenities && room.amenities.length > 0 && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Tiện nghi phòng</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {room.amenities.map((amenity) => (
                            <div
                                key={amenity.id}
                                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#D4902A] transition-all duration-300 hover:shadow-md"
                                style={{
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <div 
                                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ 
                                        backgroundColor: 'rgba(212, 144, 42, 0.1)',
                                        color: '#D4902A'
                                    }}
                                >
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="h-4 w-4" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M5 13l4 4L19 7" 
                                        />
                                    </svg>
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                    {amenity.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="border-solid border-b-1 border-gray-300 mt-10"></div>
        </div>
    );
};

export default RoomInfo;
