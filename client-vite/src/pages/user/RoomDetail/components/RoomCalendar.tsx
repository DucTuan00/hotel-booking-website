import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Spin } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import roomAvailableService from '@/services/rooms/roomAvailableService';
import { formatPrice } from '@/utils/formatPrice';
import { SAME_DAY_BOOKING_CUTOFF_HOUR } from '@/config/constants';
import { joinRoom, leaveRoom, subscribeToInventoryUpdates, InventoryUpdateData } from '@/services/socket/socketService';
import CalendarModal from '@/pages/user/RoomDetail/components/CalendarModal';

dayjs.locale('vi');

interface RoomCalendarProps {
    roomId: string;
    defaultPrice: number;
    maxRooms: number;
    maxGuests: number;
    onDateSelect?: (checkIn: Date, checkOut: Date, quantity: number, adults: number, children: number) => void;
}

interface DayData {
    date: string;
    displayDate: string;
    dayOfWeek: string;
    price: number;
    inventory: number;
    isDefault: boolean;
    isPast: boolean;
}

const RoomCalendar: React.FC<RoomCalendarProps> = ({ roomId, defaultPrice, maxRooms, maxGuests, onDateSelect }) => {
    const [loading, setLoading] = useState(false);
    const [daysData, setDaysData] = useState<DayData[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
    const unsubscribeRef = useRef<(() => void) | null>(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            // If past cutoff hour, start from tomorrow
            const isPastCutoff = dayjs().hour() >= SAME_DAY_BOOKING_CUTOFF_HOUR;
            const startOffset = isPastCutoff ? 1 : 0;

            const startDate = dayjs().add(startOffset, 'day').startOf('day').toDate();
            const endDate = dayjs().add(30, 'day').endOf('day').toDate();

            const availabilityData = await roomAvailableService.getRoomAvailable({
                roomId,
                startDate,
                endDate,
                pageSize: 100
            });

            const days: DayData[] = [];
            const effectiveToday = dayjs().add(startOffset, 'day').startOf('day');

            for (let i = startOffset; i < 30; i++) {
                const currentDate = dayjs().add(i, 'day');
                const dateStr = currentDate.format('YYYY-MM-DD');

                const existingData = availabilityData.roomAvailables.find(
                    item => dayjs(item.date).format('YYYY-MM-DD') === dateStr
                );

                days.push({
                    date: dateStr,
                    displayDate: currentDate.format('DD/MM'),
                    dayOfWeek: currentDate.format('ddd'),
                    price: existingData?.price ?? defaultPrice,
                    inventory: existingData?.inventory ?? 0,
                    isDefault: !existingData,
                    isPast: currentDate.isBefore(effectiveToday)
                });
            }

            setDaysData(days);
        } catch (error) {
            console.error('Error loading calendar data:', error);
        } finally {
            setLoading(false);
        }
    }, [roomId, defaultPrice]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Handle real-time price/inventory updates via WebSocket
    const handleInventoryUpdate = useCallback((data: InventoryUpdateData) => {
        if (data.roomId !== roomId) return;

        setDaysData(prevDays =>
            prevDays.map(day => {
                const update = data.updates.find(u => u.date === day.date);
                if (update) {
                    return {
                        ...day,
                        price: update.price,
                        inventory: update.inventory,
                        isDefault: false
                    };
                }
                return day;
            })
        );
    }, [roomId]);

    // Setup WebSocket subscription
    useEffect(() => {
        if (roomId) {
            joinRoom(roomId);
            unsubscribeRef.current = subscribeToInventoryUpdates(handleInventoryUpdate);

            return () => {
                if (unsubscribeRef.current) {
                    unsubscribeRef.current();
                    unsubscribeRef.current = null;
                }
                leaveRoom(roomId);
            };
        }
    }, [roomId, handleInventoryUpdate]);

    // Calculate min and max prices
    const prices = daysData.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    // Calculate column height based on price
    const getColumnHeight = (price: number): number => {
        if (priceRange === 0) return 60; // Default height if all prices are the same
        const minHeight = 40;
        const maxHeight = 140;
        const ratio = (price - minPrice) / priceRange;
        return minHeight + ratio * (maxHeight - minHeight);
    };

    // Handle click on price column
    const handlePriceClick = (date: string, hasInventory: boolean) => {
        if (hasInventory) {
            setSelectedDate(date);
            setModalOpen(true);
        }
    };

    // Handle date selection from modal
    const handleDateConfirm = (checkIn: Date, checkOut: Date, quantity: number, adults: number, children: number) => {
        if (onDateSelect) {
            onDateSelect(checkIn, checkOut, quantity, adults, children);
        }
    };

    return (
        <div className="mb-6">
            <div className="flex items-center gap-2">
                <p className="text-2xl font-semibold !mb-1">Giá phòng (hiển thị giá trong khoảng thời gian 30 ngày)</p>
            </div>

            <div 
                className="text-gray-500 text-sm mb-4 p-2 border border-gray-200 rounded-lg"
                style={{
                    maxWidth: 'fit-content'
                }}
            >
                Nhấn vào một mức giá để chọn ngày đặt phòng
            </div>

            <Spin spinning={loading}>
                {/* Scrollable Timeline Chart */}
                <div
                    className="timeline-container border border-gray-200 rounded-lg"
                    style={{
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        WebkitOverflowScrolling: 'touch'
                    }}
                >
                    <div
                        className="relative flex items-end gap-1"
                        style={{
                            backgroundColor: '#FAF6F0',
                            borderRadius: '8px',
                            padding: '20px 10px 50px',
                            minWidth: 'max-content'
                        }}
                    >
                        {daysData.map((day) => {
                            const isToday = dayjs(day.date).isSame(dayjs(), 'day');
                            const hasInventory = day.inventory > 0;
                            const columnHeight = getColumnHeight(day.price);

                            return (
                                <div
                                    key={day.date}
                                    className="flex flex-col items-center"
                                    style={{
                                        minWidth: '55px',
                                        position: 'relative'
                                    }}
                                >
                                    {/* Price label or X marker */}
                                    {hasInventory ? (
                                        <div
                                            onClick={() => handlePriceClick(day.date, hasInventory)}
                                            className="text-center font-semibold text-xs px-2 py-1 rounded mb-2 cursor-pointer hover:opacity-80 transition-opacity"
                                            style={{
                                                backgroundColor: isToday ? '#D4902A' : '#D4902A',
                                                color: 'white',
                                                whiteSpace: 'nowrap',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                fontSize: '11px'
                                            }}
                                        >
                                            {formatPrice(day.price)}
                                        </div>
                                    ) : (
                                        <div
                                            className="text-center font-bold text-xl px-2 py-1 rounded mb-2"
                                            style={{
                                                backgroundColor: '#E5E5E5',
                                                color: '#999',
                                                width: '32px',
                                                height: '26px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            ✕
                                        </div>
                                    )}

                                    {/* Column bar - Thin line */}
                                    <div
                                        className="relative"
                                        style={{
                                            width: '2px',
                                            height: `${columnHeight}px`,
                                            backgroundColor: hasInventory ? (isToday ? '#D4902A' : '#D4902A') : '#ccc',
                                            transition: 'all 0.3s ease',
                                            cursor: hasInventory ? 'pointer' : 'default'
                                        }}
                                    />

                                    {/* Date label at bottom */}
                                    <div
                                        className="text-center mt-2"
                                        style={{
                                            fontSize: '12px',
                                            color: '#666',
                                            fontWeight: '500'
                                        }}
                                    >
                                        <div>{day.displayDate.split('/')[0]}</div>
                                        <div>Th{day.displayDate.split('/')[1]}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Note */}
                <div className="text-gray-500 italic mt-4 text-sm">
                    * Giá rẻ nhất được hiển thị, tình trạng phòng trống không được đảm bảo, có thể tùy thuộc vào thời gian lưu trú tối thiểu
                </div>
            </Spin>

            <style>{`
                /* Custom scrollbar style - đẹp hơn và chỉ hiện khi hover */
                .timeline-container {
                    scrollbar-width: thin;
                    scrollbar-color: #D4902A #FAF6F0;
                }
                
                .timeline-container::-webkit-scrollbar {
                    height: 8px;
                }
                
                .timeline-container::-webkit-scrollbar-track {
                    background: #FAF6F0;
                    border-radius: 4px;
                }
                
                .timeline-container::-webkit-scrollbar-thumb {
                    background: #D4902A;
                    border-radius: 4px;
                    transition: background 0.2s;
                }
                
                .timeline-container::-webkit-scrollbar-thumb:hover {
                    background: #B8771F;
                }

                /* Smooth scrolling */
                .timeline-container {
                    scroll-behavior: smooth;
                }

                /* Hover effects */
                .timeline-container > div > div:hover > div:first-child {
                    transform: scale(1.05);
                }

                .timeline-container > div > div > div:nth-child(2):hover {
                    opacity: 0.8;
                }
            `}</style>

            {/* Calendar Modal */}
            <CalendarModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleDateConfirm}
                roomId={roomId}
                maxRooms={maxRooms}
                maxGuests={maxGuests}
                initialDate={selectedDate}
            />
        </div>
    );
};

export default RoomCalendar;
