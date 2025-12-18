import React from 'react';
import { Divider, Button } from 'antd';
import dayjs from 'dayjs';
import { COLORS } from '@/config/constants';
import { Room } from '@/types/room';
import { PreviewPriceResponse } from '@/types/booking';
import { CelebrateItem } from '@/types/celebrate';
import { formatPrice } from '@/utils/formatPrice';

interface BookingSummaryProps {
    room: Room;
    checkIn: string;
    checkOut: string;
    pricePreview: PreviewPriceResponse;
    quantity: number;
    adults: number;
    children: number;
    selectedCelebrations: CelebrateItem[];
    selectedCelebrationQuantities: Map<string, number>;
    onSubmit: () => void;
    submitting: boolean;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ 
    room, 
    checkIn, 
    checkOut, 
    pricePreview,
    quantity,
    adults,
    children,
    selectedCelebrations,
    selectedCelebrationQuantities,
    onSubmit,
    submitting
}) => {
    const nights = dayjs(checkOut).diff(dayjs(checkIn), 'day');
    
    // Calculate celebration total with quantities
    const celebrationTotal = selectedCelebrations.reduce((sum, item) => {
        const itemQuantity = selectedCelebrationQuantities.get(item.id) || 1;
        return sum + (item.price * itemQuantity);
    }, 0);
    
    const grandTotal = pricePreview.totalPrice + celebrationTotal;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Tóm tắt đặt phòng</h2>

            {/* Room Image */}
            {room.images && room.images.length > 0 && (
                <div className="mb-4">
                    <img
                        src={room.images[0].path}
                        alt={room.name}
                        className="w-full h-48 object-cover rounded-lg"
                    />
                </div>
            )}

            {/* Room Info */}
            <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2">{room.name}</h3>
                <p className="text-gray-600 text-sm">{room.roomType}</p>
            </div>

            <Divider className="my-4" />

            {/* Booking Details */}
            <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Nhận phòng:</span>
                    <span className="font-medium">
                        {dayjs(checkIn).format('DD/MM/YYYY')} (lúc 14:00)
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Trả phòng:</span>
                    <span className="font-medium">
                        {dayjs(checkOut).format('DD/MM/YYYY')} (đến 12:00)
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Số đêm:</span>
                    <span className="font-medium">{nights} đêm</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Số lượng phòng:</span>
                    <span className="font-medium">{quantity} phòng</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Số khách:</span>
                    <span className="font-medium">
                        {adults} người lớn{children > 0 && `, ${children} trẻ em`}
                    </span>
                </div>
            </div>

            <Divider className="my-4" />

            {/* Price Breakdown */}
            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giá phòng:</span>
                    <span>{formatPrice(pricePreview.roomSubtotal)}</span>
                </div>
                
                {pricePreview.dailyBreakdown && pricePreview.dailyBreakdown.length > 0 && (
                    <div className="text-xs text-gray-500 pl-4">
                        {pricePreview.dailyBreakdown.map((day, index) => (
                            <div key={index} className="flex justify-between py-1">
                                <span>{dayjs(day.date).format('DD/MM')}:</span>
                                <span>{formatPrice(day.price)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Celebration Items */}
            {selectedCelebrations.length > 0 && (
                <>
                    <Divider className="my-4" />
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700 mb-2">Quà kỷ niệm:</p>
                        {selectedCelebrations.map((item) => {
                            const itemQuantity = selectedCelebrationQuantities.get(item.id) || 1;
                            const itemTotal = item.price * itemQuantity;
                            
                            return (
                                <div key={item.id} className="flex justify-between text-sm pl-4">
                                    <span className="text-gray-600">
                                        {item.name} {itemQuantity > 1 && `x${itemQuantity}`}
                                    </span>
                                    <span>{formatPrice(itemTotal)}</span>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            <Divider className="my-4" />

            {/* Subtotal */}
            <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Tiền phòng:</span>
                <span>{formatPrice(pricePreview.totalPrice)}</span>
            </div>
            
            {celebrationTotal > 0 && (
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Quà kỷ niệm:</span>
                    <span>{formatPrice(celebrationTotal)}</span>
                </div>
            )}

            <Divider className="my-3" />

            {/* Grand Total */}
            <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Tổng cộng:</span>
                <span className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                    {formatPrice(grandTotal)}
                </span>
            </div>

            {/* Note */}
            <div className="my-4">
                <p className="text-xs text-gray-600">
                    * Giá đã bao gồm thuế và phí dịch vụ
                </p>
            </div>

            {/* Submit Button */}
            <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={submitting}
                onClick={onSubmit}
                block
                className="mt-4"
                style={{
                    backgroundColor: COLORS.primary,
                    borderColor: COLORS.primary,
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: 600
                }}
            >
                ĐẶT PHÒNG
            </Button>
        </div>
    );
};

export default BookingSummary;
