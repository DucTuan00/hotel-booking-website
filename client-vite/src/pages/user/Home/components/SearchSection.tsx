import React, { useState, useRef, useEffect } from 'react';
import { Button, DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import { COLORS, TYPOGRAPHY, SAME_DAY_BOOKING_CUTOFF_HOUR } from '@/config/constants';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface GuestCounts {
    adults: number;
    children: number;
}

const SearchSection: React.FC = () => {
    const navigate = useNavigate();
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
    const [guests, setGuests] = useState<GuestCounts>({ adults: 2, children: 0 });
    const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
    const guestDropdownRef = useRef<HTMLDivElement>(null);
    const MAX_ADULTS = 5;
    const MAX_TOTAL_BONUS = 2;

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (guestDropdownRef.current && !guestDropdownRef.current.contains(event.target as Node)) {
                setIsGuestDropdownOpen(false);
            }
        };

        if (isGuestDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isGuestDropdownOpen]);

    // Disable dates: past dates, dates beyond 30 days, and today if past cutoff hour
    const disabledDate = (current: Dayjs) => {
        if (!current) return false;

        const now = dayjs();
        const today = now.startOf('day');
        const maxDate = now.add(30, 'days').endOf('day');

        // If current hour >= cutoff, treat today as past (can only book from tomorrow)
        const effectiveToday = now.hour() >= SAME_DAY_BOOKING_CUTOFF_HOUR
            ? today.add(1, 'day')
            : today;

        // Disable if before effective today or after 30 days from today
        return current.isBefore(effectiveToday, 'day') || current.isAfter(maxDate, 'day');
    };

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (dateRange && dateRange[0] && dateRange[1]) {
            params.append('checkIn', dateRange[0].format('YYYY-MM-DD'));
            params.append('checkOut', dateRange[1].format('YYYY-MM-DD'));
        }

        params.append('adults', guests.adults.toString());
        params.append('children', guests.children.toString());

        navigate(`/search?${params.toString()}`);
    };

    const handleAddAdult = () => {
        setGuests(prev => ({ ...prev, adults: prev.adults + 1 }));
    };

    const handleRemoveAdult = () => {
        setGuests(prev => {
            const newAdults = prev.adults - 1;
            return { adults: newAdults, children: prev.children };
        });
    };

    const handleAddChild = () => {
        setGuests(prev => ({ ...prev, children: prev.children + 1 }));
    };

    const handleRemoveChild = () => {
        setGuests(prev => ({ ...prev, children: prev.children - 1 }));
    };

    const getGuestLabel = () => {
        const adultsText = `${guests.adults} người lớn`;
        const childrenText = guests.children > 0 ? `, ${guests.children} trẻ em` : '';
        return adultsText + childrenText;
    };

    return (
        <section id="search-section" className="relative z-30 px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 md:-mt-24 pb-12">
            <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 transform transition-transform hover:scale-[1.01] duration-300">
                {/* Search Bar Container */}
                <div className="flex flex-col lg:flex-row items-center gap-6">
                    {/* Title Mobile Only - Hidden on Desktop to save space */}
                    <div className="lg:hidden w-full text-center border-b mb-2">
                        <h2
                            className="text-lg font-bold tracking-widest uppercase"
                            style={{
                                color: COLORS.primary,
                                fontFamily: TYPOGRAPHY.fontFamily.secondary,
                            }}
                        >
                            Đặt Phòng
                        </h2>
                    </div>

                    {/* Search Form */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-end">
                        {/* Date Range Picker - Desktop */}
                        <div className="hidden md:block md:col-span-5">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Ngày nhận - trả phòng
                            </label>
                            <RangePicker
                                size="large"
                                className="w-full border-0 bg-gray-50 hover:bg-gray-100 transition-colors py-3"
                                placeholder={['Nhận phòng', 'Trả phòng']}
                                value={dateRange}
                                disabledDate={disabledDate}
                                onChange={(dates) => {
                                    if (dates && dates[0] && dates[1]) {
                                        setDateRange([dates[0], dates[1]]);
                                    } else {
                                        setDateRange(null);
                                    }
                                }}
                                style={{ borderRadius: '8px' }}
                                suffixIcon={<span className="text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></span>}
                            />
                        </div>

                        {/* Date Pickers - Mobile (2 separate pickers for better UX) */}
                        <div className="md:hidden grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Nhận phòng
                                </label>
                                <DatePicker
                                    size="large"
                                    className="w-full border-0 bg-gray-50 hover:bg-gray-100 transition-colors"
                                    placeholder="Chọn ngày"
                                    value={dateRange?.[0]}
                                    disabledDate={disabledDate}
                                    onChange={(date) => {
                                        if (date) {
                                            setDateRange(prev => [date, prev?.[1] || null] as [Dayjs, Dayjs]);
                                        } else {
                                            setDateRange(prev => prev ? [null as unknown as Dayjs, prev[1]] : null);
                                        }
                                    }}
                                    style={{ borderRadius: '8px' }}
                                    inputReadOnly
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Trả phòng
                                </label>
                                <DatePicker
                                    size="large"
                                    className="w-full border-0 bg-gray-50 hover:bg-gray-100 transition-colors"
                                    placeholder="Chọn ngày"
                                    value={dateRange?.[1]}
                                    disabledDate={(current) => {
                                        if (disabledDate(current)) return true;
                                        // Also disable dates before check-in date
                                        if (dateRange?.[0] && current.isBefore(dateRange[0], 'day')) {
                                            return true;
                                        }
                                        return false;
                                    }}
                                    onChange={(date) => {
                                        if (date) {
                                            setDateRange(prev => [prev?.[0] || null, date] as [Dayjs, Dayjs]);
                                        } else {
                                            setDateRange(prev => prev ? [prev[0], null as unknown as Dayjs] : null);
                                        }
                                    }}
                                    style={{ borderRadius: '8px' }}
                                    inputReadOnly
                                />
                            </div>
                        </div>

                        {/* Guest Selector Dropdown */}
                        <div className="md:col-span-4 relative" ref={guestDropdownRef}>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Khách
                            </label>
                            <button
                                onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
                                className="w-full px-4 py-1.5 border border-gray-200 hover:bg-gray-100 rounded-lg text-left text-gray-700 transition-colors flex items-center justify-between group"
                            >
                                <span className="font-medium">{getGuestLabel()}</span>
                                <span className="text-gray-400 group-hover:text-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </button>

                            {/* Custom Dropdown */}
                            {isGuestDropdownOpen && (
                                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-2xl border border-gray-200 p-6 z-50">
                                    <div className="space-y-3">
                                        {/* Adults */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-base font-semibold text-gray-700 !mb-0">Người lớn</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={handleRemoveAdult}
                                                    disabled={guests.adults <= 1}
                                                    className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 rounded-full hover:border-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                                >
                                                    <MinusOutlined className="text-sm" />
                                                </button>
                                                <span className="text-lg font-semibold w-8 text-center text-gray-800">{guests.adults}</span>
                                                <button
                                                    onClick={handleAddAdult}
                                                    disabled={guests.adults >= MAX_ADULTS || guests.adults + guests.children >= MAX_ADULTS + MAX_TOTAL_BONUS}
                                                    className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 rounded-full hover:border-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                                >
                                                    <PlusOutlined className="text-sm" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Children */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-base font-semibold text-gray-700 !mb-0">Trẻ em</p>
                                                <p className="text-xs text-gray-500 !mt-1 !mb-0">Dưới 12 tuổi</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={handleRemoveChild}
                                                    disabled={guests.children <= 0}
                                                    className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 rounded-full hover:border-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                                >
                                                    <MinusOutlined className="text-sm" />
                                                </button>
                                                <span className="text-lg font-semibold w-8 text-center text-gray-800">{guests.children}</span>
                                                <button
                                                    onClick={handleAddChild}
                                                    disabled={guests.children >= MAX_ADULTS + MAX_TOTAL_BONUS - guests.adults}
                                                    className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 rounded-full hover:border-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                                >
                                                    <PlusOutlined className="text-sm" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Done Button */}
                                        <div className="flex justify-end">
                                            <Button
                                                type="primary"
                                                onClick={() => setIsGuestDropdownOpen(false)}
                                                className="py-2 px-4 w-28 hover:shadow-xl font-semibold rounded-lg transition-all"
                                                style={{
                                                    backgroundColor: COLORS.primary,
                                                    borderColor: COLORS.primary,
                                                    fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                                    letterSpacing: '0.05em',
                                                }}
                                            >
                                                Xong
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Search Button */}
                        <div className="md:col-span-3">
                            <Button
                                type="primary"
                                size="large"
                                className="w-full h-12 text-base font-bold shadow-lg hover:shadow-xl transition-all"
                                onClick={handleSearch}
                                style={{
                                    backgroundColor: COLORS.primary,
                                    borderColor: COLORS.primary,
                                    fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                    letterSpacing: '0.05em',
                                }}
                            >
                                TÌM PHÒNG
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SearchSection;
