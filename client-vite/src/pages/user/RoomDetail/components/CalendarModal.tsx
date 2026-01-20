import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Modal, Button, Spin, InputNumber } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/vi';
import roomAvailableService from '@/services/rooms/roomAvailableService';
import bookingService from '@/services/bookings/bookingService';
import authService from '@/services/auth/authService';
import { joinRoom, leaveRoom, subscribeToInventoryUpdates, InventoryUpdateData } from '@/services/socket/socketService';
import Notification from '@/components/Notification';
import { Message } from '@/types/message';
import { COLORS } from '@/config/constants';
import { TYPOGRAPHY } from '@/config/constants';

dayjs.extend(isBetween);
dayjs.locale('vi');

interface CalendarModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (checkIn: Date, checkOut: Date, quantity: number, adults: number, children: number) => void;
    roomId: string;
    initialDate?: string;
    maxRooms: number;
    maxGuests: number;
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
    initialDate,
    maxRooms,
    maxGuests
}) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [checkInDate, setCheckInDate] = useState<Dayjs | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(null);
    const [hoveredDate, setHoveredDate] = useState<Dayjs | null>(null);
    const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
    const [availabilityMap, setAvailabilityMap] = useState<Map<string, DayAvailability>>(new Map());
    const [message, setMessage] = useState<Message | null>(null);
    
    // Booking details state
    const [quantity, setQuantity] = useState<number>(1);
    const [adults, setAdults] = useState<number>(Math.min(2, maxGuests));
    const [children, setChildren] = useState<number>(0);
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(false);

    // Ref to track socket subscription
    const unsubscribeRef = useRef<(() => void) | null>(null);

    // Handle real-time inventory updates from WebSocket
    const handleInventoryUpdate = useCallback((data: InventoryUpdateData) => {
        if (data.roomId !== roomId) return;

        setAvailabilityMap(prevMap => {
            const newMap = new Map(prevMap);
            
            data.updates.forEach(update => {
                const existing = newMap.get(update.date);
                newMap.set(update.date, {
                    date: update.date,
                    price: update.price,
                    inventory: update.inventory,
                    isAvailable: update.inventory > 0
                });

                // Show notification if a date in the selected range became unavailable
                if (existing && existing.inventory > 0 && update.inventory === 0) {
                    setMessage({
                        type: 'error',
                        text: `Ngày ${dayjs(update.date).format('DD/MM/YYYY')} vừa hết phòng!`
                    });
                }
            });

            return newMap;
        });
    }, [roomId]);

    // Setup WebSocket subscription when modal opens
    useEffect(() => {
        if (open && roomId) {
            // Join room channel
            joinRoom(roomId);
            
            // Subscribe to inventory updates
            unsubscribeRef.current = subscribeToInventoryUpdates(handleInventoryUpdate);

            return () => {
                // Cleanup on close or unmount
                if (unsubscribeRef.current) {
                    unsubscribeRef.current();
                    unsubscribeRef.current = null;
                }
                leaveRoom(roomId);
            };
        }
    }, [open, roomId, handleInventoryUpdate]);

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
            
            if (checkIn.isAfter(dayjs().subtract(1, 'day'))) {
                setCheckInDate(checkIn);
                setCurrentMonth(checkIn);
                setIsInitialLoad(true); // Mark as initial load
            }
        } else if (!open) {
            // Reset when modal closes
            setCheckInDate(null);
            setCheckOutDate(null);
            setHoveredDate(null);
            setIsInitialLoad(false);
        }
    }, [open, initialDate]);

    // Set checkout date after availability is loaded (only on initial load)
    useEffect(() => {
        if (open && checkInDate && !checkOutDate && availabilityMap.size > 0 && isInitialLoad) {
            const checkOut = checkInDate.add(1, 'day');
            const maxDate = dayjs().add(30, 'day');
            const isWithin30Days = checkOut.isBefore(maxDate, 'day') || checkOut.isSame(maxDate, 'day');
            const checkOutStr = checkOut.format('YYYY-MM-DD');
            const availability = availabilityMap.get(checkOutStr);
            const isAvailable = availability?.isAvailable ?? false;
            
            // Set checkout to 1 night by default if that day is available
            if (isAvailable && isWithin30Days) {
                setCheckOutDate(checkOut);
                setIsInitialLoad(false); // Only auto-set once
            }
        }
    }, [open, checkInDate, checkOutDate, availabilityMap, isInitialLoad]);

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
                                            {availabilityMap.get(day.format('YYYY-MM-DD'))?.inventory ?? ''} phòng trống
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

    const handleConfirm = async () => {
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

        // Check authentication before proceeding
        try {
            setLoading(true);
            await authService.verifyToken();
        } catch {
            setLoading(false);
            setMessage({
                type: 'error',
                text: 'Vui lòng đăng nhập để tiếp tục đặt phòng'
            });
            
            setTimeout(() => {
                onClose();
                navigate('/login', { 
                    state: { 
                        from: window.location.pathname,
                        returnUrl: window.location.pathname + window.location.search
                    } 
                });
            }, 3000);
            return;
        }

        // Check if quantity is available for all dates in the range
        try {
            const formattedCheckIn = checkInDate.format('YYYY-MM-DD');
            const formattedCheckOut = checkOutDate.format('YYYY-MM-DD');
            
            await bookingService.previewBookingPrice({
                roomId,
                checkIn: formattedCheckIn,
                checkOut: formattedCheckOut,
                quantity
            });
            
            // If preview succeeds, proceed with confirmation
            onConfirm(checkInDate.toDate(), checkOutDate.toDate(), quantity, adults, children);
            onClose();
        } catch {
            setLoading(false);
            setMessage({
                type: 'error',
                text: 'Có ngày trong khoảng thời gian bạn chọn không đủ số lượng phòng. Vui lòng điều chỉnh lại.'
            });
        }
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
                <div className="text-xl font-semibold" style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}>
                    Chọn ngày nhận và trả phòng
                </div>
            }
            styles={{
                body: {
                    maxHeight: 'calc(90vh - 110px)',
                    overflowY: 'auto',
                    padding: 0
                }
            }}
            style={{
                top: 50
            }}
        >
            <Spin spinning={loading}>
                <div className="py-4 px-2">
                    {/* Booking Details Form */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <p className="font-semibold text-base !mb-4">Chi tiết đặt phòng</p>
                        
                        <div className="grid grid-cols-3 gap-4">
                            {/* Quantity */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Số lượng phòng
                                </label>
                                <InputNumber
                                    min={1}
                                    max={maxRooms}
                                    value={quantity}
                                    onChange={(value) => setQuantity(value || 1)}
                                    className="w-full"
                                    size="large"
                                />
                            </div>

                            {/* Adults */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Người lớn (tối đa {maxGuests})
                                </label>
                                <InputNumber
                                    min={1}
                                    max={maxGuests}
                                    value={adults}
                                    onChange={(value) => {
                                        const newAdults = value || 1;
                                        setAdults(newAdults);
                                        // Max children = (maxGuests + 2) - adults
                                        const maxChildrenAllowed = maxGuests + 2 - newAdults;
                                        if (children > maxChildrenAllowed) {
                                            setChildren(maxChildrenAllowed);
                                        }
                                    }}
                                    className="w-full"
                                    size="large"
                                />
                            </div>

                            {/* Children */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Trẻ em (tối đa {maxGuests + 2 - adults})
                                </label>
                                <InputNumber
                                    min={0}
                                    max={maxGuests + 2 - adults}
                                    value={children}
                                    onChange={(value) => setChildren(value || 0)}
                                    className="w-full"
                                    size="large"
                                />
                            </div>
                        </div>

                        <p 
                            className="text-xs text-gray-500"
                            style={{
                                marginBottom: 0,
                                marginTop: '10px'
                            }}
                        >
                            * Trẻ em trên 12 tuổi được tính là người lớn. Vui lòng điều chỉnh số lượng người lớn và trẻ em phù hợp với quy định của khách sạn.
                        </p>
                    </div>

                    {/* Month navigation */}
                    <div className="flex items-center justify-between mb-4">
                        <Button
                            onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}
                            disabled={currentMonth.isSame(dayjs(), 'month')}
                        >
                            ← Tháng trước
                        </Button>
                        <div className="text-lg font-semibold">
                            T{currentMonth.month() + 1}, {currentMonth.year()}
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
