import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Spin } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/vi';
import roomAvailableService from '@/services/rooms/roomAvailableService';
import { formatPrice } from '@/pages/user/RoomDetail/components/RoomInfo';
import Notification from '@/components/Notification';
import { Message } from '@/types/message';
import { COLORS } from '@/config/constants';

dayjs.extend(isBetween);
dayjs.locale('vi');

interface CalendarModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (checkIn: Date, checkOut: Date) => void;
    roomId: string;
    defaultPrice: number;
    initialDate?: string;
}

interface DayAvailability {
    date: string;
    price: number;
    inventory: number;
    isAvailable: boolean;
}

const CalendarModal: React.FC<CalendarModalProps> = ({
    open,
    onClose,
    onConfirm,
    roomId,
    defaultPrice,
    initialDate
}) => {
    const [loading, setLoading] = useState(false);
    const [checkInDate, setCheckInDate] = useState<Dayjs | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(null);
    const [hoveredDate, setHoveredDate] = useState<Dayjs | null>(null);
    const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
    const [availabilityMap, setAvailabilityMap] = useState<Map<string, DayAvailability>>(new Map());
    const [message, setMessage] = useState<Message | null>(null);

    // Load availability data
    const loadAvailability = useCallback(async () => {
        setLoading(true);
        try {
            const startDate = currentMonth.startOf('month').subtract(7, 'day').toDate();
            const endDate = currentMonth.endOf('month').add(42, 'day').toDate();

            const data = await roomAvailableService.getRoomAvailable({
                roomId,
                startDate,
                endDate,
                pageSize: 100
            });

            const map = new Map<string, DayAvailability>();
            data.roomAvailables.forEach(item => {
                const dateStr = dayjs(item.date).format('YYYY-MM-DD');
                map.set(dateStr, {
                    date: dateStr,
                    price: item.price,
                    inventory: item.inventory,
                    isAvailable: item.inventory > 0
                });
            });

            setAvailabilityMap(map);
        } catch (error) {
            console.error('Error loading availability:', error);
            setMessage({
                type: 'error',
                text: 'Không thể tải dữ liệu phòng trống'
            });
        } finally {
            setLoading(false);
        }
    }, [currentMonth, roomId]);

    useEffect(() => {
        if (open) {
            loadAvailability();
        }
    }, [open, loadAvailability]);

    // Initialize dates when modal opens
    useEffect(() => {
        if (open && initialDate) {
            const checkIn = dayjs(initialDate);
            const checkOut = checkIn.add(1, 'day');
            
            if (checkIn.isAfter(dayjs().subtract(1, 'day'))) {
                setCheckInDate(checkIn);
                // Only set checkout to 1 night by default if that day is available
                // Otherwise let user select checkout manually
                if (isDateAvailable(checkOut) && isDateWithin30Days(checkOut)) {
                    setCheckOutDate(checkOut);
                } else {
                    setCheckOutDate(null);
                }
                setCurrentMonth(checkIn);
            }
        } else if (!open) {
            // Reset when modal closes
            setCheckInDate(null);
            setCheckOutDate(null);
            setHoveredDate(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, initialDate]);

    // Check if a date is within 30 days limit
    const isDateWithin30Days = (date: Dayjs): boolean => {
        const maxDate = dayjs().add(30, 'day');
        return date.isBefore(maxDate, 'day') || date.isSame(maxDate, 'day');
    };

    // Check if a date is available
    const isDateAvailable = (date: Dayjs): boolean => {
        const dateStr = date.format('YYYY-MM-DD');
        const availability = availabilityMap.get(dateStr);
        return availability?.isAvailable ?? false;
    };

    // Check if there's any unavailable day in the range
    const hasUnavailableDayInRange = (start: Dayjs, end: Dayjs): string | null => {
        let current = start;
        while (current.isBefore(end)) {
            if (!isDateAvailable(current)) {
                return current.format('DD/MM/YYYY');
            }
            current = current.add(1, 'day');
        }
        return null;
    };

    // Handle date click
    const handleDateClick = (date: Dayjs) => {
        if (date.isBefore(dayjs(), 'day')) {
            return; // Can't select past dates
        }

        if (!isDateWithin30Days(date)) {
            return; // Can't select dates beyond 30 days
        }

        if (!isDateAvailable(date)) {
            setMessage({
                type: 'error',
                text: `Ngày ${date.format('DD/MM/YYYY')} đã hết phòng. Vui lòng chọn ngày khác.`
            });
            return;
        }

        // If both check-in and check-out are already selected, reset and start new selection
        if (checkInDate && checkOutDate) {
            setCheckInDate(date);
            setCheckOutDate(null);
            return;
        }

        // If no check-in selected, set check-in and reset checkout
        if (!checkInDate) {
            setCheckInDate(date);
            setCheckOutDate(null);
            return;
        }

        // If clicking the same day as check-in, reset checkout only
        if (date.isSame(checkInDate, 'day')) {
            setCheckOutDate(null);
            return;
        }

        // If clicking before check-in, swap: clicked date becomes new check-in
        if (date.isBefore(checkInDate, 'day')) {
            // Check if all days in range are available
            const unavailableDay = hasUnavailableDayInRange(date, checkInDate);
            if (unavailableDay) {
                setMessage({
                    type: 'error',
                    text: `Ngày ${unavailableDay} trong khoảng thời gian bạn chọn đã hết phòng. Vui lòng chọn khoảng thời gian khác.`
                });
                return;
            }
            // Swap: date -> checkIn, old checkIn -> checkOut
            setCheckOutDate(checkInDate);
            setCheckInDate(date);
            return;
        }

        // If clicking after check-in, set as check-out
        if (date.isAfter(checkInDate, 'day')) {
            // Check if all days in range are available
            const unavailableDay = hasUnavailableDayInRange(checkInDate, date);
            if (unavailableDay) {
                setMessage({
                    type: 'error',
                    text: `Ngày ${unavailableDay} trong khoảng thời gian bạn chọn đã hết phòng. Vui lòng chọn khoảng thời gian khác.`
                });
                return;
            }
            setCheckOutDate(date);
        }
    };

    // Handle mouse hover
    const handleDateHover = (date: Dayjs) => {
        // Only show hover effect if check-in is selected but check-out is not
        if (checkInDate && !checkOutDate && date.isAfter(checkInDate, 'day')) {
            setHoveredDate(date);
        }
    };

    const handleMouseLeave = () => {
        setHoveredDate(null);
    };

    // Render calendar days
    const renderCalendar = () => {
        const startOfMonth = currentMonth.startOf('month');
        const endOfMonth = currentMonth.endOf('month');
        const startDate = startOfMonth.startOf('week');
        const endDate = endOfMonth.endOf('week');

        const days: Dayjs[] = [];
        let day = startDate;
        while (day.isBefore(endDate) || day.isSame(endDate, 'day')) {
            days.push(day);
            day = day.add(1, 'day');
        }

        return (
            <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(dayName => (
                    <div
                        key={dayName}
                        className="text-center font-semibold py-2 text-gray-600"
                        style={{ fontSize: '13px' }}
                    >
                        {dayName}
                    </div>
                ))}

                {/* Calendar days */}
                {days.map((day, index) => {
                    const isCurrentMonth = day.month() === currentMonth.month();
                    const isToday = day.isSame(dayjs(), 'day');
                    const isPast = day.isBefore(dayjs(), 'day');
                    const isBeyond30Days = !isDateWithin30Days(day);
                    const isAvailable = isDateAvailable(day);
                    const isCheckIn = checkInDate && day.isSame(checkInDate, 'day');
                    const isCheckOut = checkOutDate && day.isSame(checkOutDate, 'day');
                    const isInRange = checkInDate && checkOutDate && 
                        day.isAfter(checkInDate, 'day') && day.isBefore(checkOutDate, 'day');
                    
                    // Hover preview range (when check-in selected but no check-out yet)
                    const isHoverPreview = checkInDate && !checkOutDate && hoveredDate && 
                        day.isAfter(checkInDate, 'day') && day.isBefore(hoveredDate, 'day');
                    const isHoveredCheckOut = hoveredDate && day.isSame(hoveredDate, 'day');

                    let bgColor = 'white';
                    let textColor = '#333';
                    let borderColor = '#e5e7eb';
                    let cursor = 'pointer';

                    if (!isCurrentMonth) {
                        textColor = '#ccc';
                    }

                    if (isPast || isBeyond30Days) {
                        textColor = '#ccc';
                        cursor = 'not-allowed';
                    }

                    if (isCheckIn || isCheckOut) {
                        bgColor = COLORS.primary;
                        textColor = 'white';
                        borderColor = COLORS.primary;
                    } else if (isInRange) {
                        bgColor = '#FFF4E6';
                        borderColor = '#FFE4B5';
                    } else if (isHoverPreview) {
                        // Hover preview styling - lighter
                        bgColor = '#FFF9F0';
                        borderColor = '#FFE4B5';
                    } else if (isHoveredCheckOut) {
                        // Hovered checkout date - semi-transparent primary color
                        bgColor = '#E8C896';
                        textColor = 'white';
                        borderColor = COLORS.primary;
                    }

                    if (isToday && !isCheckIn && !isCheckOut && !isHoveredCheckOut) {
                        borderColor = COLORS.primary;
                    }

                    return (
                        <div
                            key={index}
                            onClick={() => !isPast && !isBeyond30Days && isCurrentMonth && handleDateClick(day)}
                            onMouseEnter={() => !isPast && !isBeyond30Days && isCurrentMonth && handleDateHover(day)}
                            onMouseLeave={handleMouseLeave}
                            className="relative text-center py-2 border rounded transition-all"
                            style={{
                                backgroundColor: bgColor,
                                color: textColor,
                                borderColor: borderColor,
                                cursor: isPast || isBeyond30Days || !isCurrentMonth ? 'not-allowed' : cursor,
                                minHeight: '70px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: !isCurrentMonth || isBeyond30Days ? 0.5 : 1
                            }}
                        >
                            <div className="font-semibold" style={{ fontSize: '14px' }}>
                                {day.date()}
                            </div>
                            
                            {isCurrentMonth && !isPast && !isBeyond30Days && (
                                <div className="mt-1" style={{ fontSize: '10px' }}>
                                    {!isAvailable ? (
                                        <span className="text-red-500 font-bold">✕</span>
                                    ) : (
                                        <span className="text-gray-500">
                                            {formatPrice(
                                                availabilityMap.get(day.format('YYYY-MM-DD'))?.price ?? defaultPrice
                                            )}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    // Check if confirm button should be disabled
    const isConfirmDisabled = (): boolean => {
        if (!checkInDate || !checkOutDate) return true;
        
        // Check if there's any unavailable day in the selected range
        const unavailableDay = hasUnavailableDayInRange(checkInDate, checkOutDate);
        if (unavailableDay) return true;
        
        // Check if check-in date is available
        if (!isDateAvailable(checkInDate)) return true;
        
        return false;
    };

    const handleConfirm = () => {
        if (!checkInDate || !checkOutDate) {
            setMessage({
                type: 'error',
                text: 'Vui lòng chọn ngày check-in và check-out'
            });
            return;
        }

        // Final validation
        const unavailableDay = hasUnavailableDayInRange(checkInDate, checkOutDate);
        if (unavailableDay) {
            setMessage({
                type: 'error',
                text: `Ngày ${unavailableDay} trong khoảng thời gian bạn chọn đã hết phòng. Vui lòng chọn khoảng thời gian khác.`
            });
            return;
        }

        if (!isDateAvailable(checkInDate)) {
            setMessage({
                type: 'error',
                text: 'Ngày check-in đã hết phòng. Vui lòng chọn ngày khác.'
            });
            return;
        }

        onConfirm(checkInDate.toDate(), checkOutDate.toDate());
        onClose();
    };

    const handleReset = () => {
        setCheckInDate(null);
        setCheckOutDate(null);
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={700}
            title={
                <div className="text-xl font-semibold">
                    Chọn ngày nhận phòng và trả phòng
                </div>
            }
        >
            <Spin spinning={loading}>
                <div className="py-4">
                    {/* Month navigation */}
                    <div className="flex items-center justify-between mb-4">
                        <Button
                            onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}
                            disabled={currentMonth.isSame(dayjs(), 'month')}
                        >
                            ← Tháng trước
                        </Button>
                        <div className="text-lg font-semibold">
                            Tháng {currentMonth.month() + 1}, {currentMonth.year()}
                        </div>
                        <Button 
                            onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))}
                            disabled={currentMonth.add(1, 'month').isAfter(dayjs().add(30, 'day'), 'month')}
                        >
                            Tháng sau →
                        </Button>
                    </div>

                    {/* Selected dates info */}
                    {checkInDate && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="font-semibold">Nhận phòng:</span>{' '}
                                    {checkInDate.format('DD/MM/YYYY')}
                                    {checkOutDate ? (
                                        <>
                                            <span className="mx-3">→</span>
                                            <span className="font-semibold">Trả phòng:</span>{' '}
                                            {checkOutDate.format('DD/MM/YYYY')}
                                            <span className="ml-3 text-gray-600">
                                                ({checkOutDate.diff(checkInDate, 'day')} đêm)
                                            </span>
                                        </>
                                    ) : (
                                        <span className="ml-3 text-gray-500 italic">
                                            (Chọn ngày trả phòng)
                                        </span>
                                    )}
                                </div>
                                <Button size="small" onClick={handleReset}>
                                    Đặt lại
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Calendar */}
                    {renderCalendar()}

                    {/* Legend */}
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-6 h-6 rounded border-2"
                                style={{ borderColor: COLORS.primary }}
                            />
                            <span>Hôm nay</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-6 h-6 rounded"
                                style={{ backgroundColor: COLORS.primary }}
                            />
                            <span>Ngày đã chọn</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div
                                className="w-6 h-6 rounded"
                                style={{ backgroundColor: '#FFF4E6' }}
                            />
                            <span>Trong khoảng</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-red-500 font-bold text-lg">✕</span>
                            <span>Hết phòng</span>
                        </div>
                    </div>

                    {/* Warning message if range has unavailable days */}
                    {checkInDate && checkOutDate && hasUnavailableDayInRange(checkInDate, checkOutDate) && (
                        <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                            <div className="flex items-center gap-2">
                                <span className="text-red-500 font-bold text-lg">⚠</span>
                                <span className="text-red-700 text-sm">
                                    Khoảng thời gian bạn chọn có ngày hết phòng. Vui lòng chọn khoảng thời gian khác.
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="mt-6 flex gap-3 justify-end">
                        <Button size="large" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleConfirm}
                            disabled={isConfirmDisabled()}
                            style={{
                                backgroundColor: COLORS.primary,
                                borderColor: COLORS.primary
                            }}
                        >
                            Xác nhận
                        </Button>
                    </div>
                </div>
            </Spin>

            <Notification message={message} onClose={() => setMessage(null)} />
        </Modal>
    );
};

export default CalendarModal;
