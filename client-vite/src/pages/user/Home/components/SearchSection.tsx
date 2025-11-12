import React, { useState } from 'react';
import { Button, DatePicker, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { COLORS, TYPOGRAPHY } from '@/config/constants';
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
    const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);

    // Disable dates: past dates and dates beyond 30 days from today
    const disabledDate = (current: Dayjs) => {
        if (!current) return false;
        
        const today = dayjs().startOf('day');
        const maxDate = dayjs().add(30, 'days').endOf('day');
        
        // Disable if before today or after 30 days from today
        return current.isBefore(today, 'day') || current.isAfter(maxDate, 'day');
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
        if (guests.adults > 1) {
            setGuests(prev => ({ ...prev, adults: prev.adults - 1 }));
        }
    };

    const handleAddChild = () => {
        setGuests(prev => ({ ...prev, children: prev.children + 1 }));
    };

    const handleRemoveChild = () => {
        if (guests.children > 0) {
            setGuests(prev => ({ ...prev, children: prev.children - 1 }));
        }
    };

    const getTotalGuests = () => {
        return guests.adults + guests.children;
    };

    const getGuestLabel = () => {
        const adultsText = `${guests.adults} người lớn`;
        const childrenText = guests.children > 0 ? `, ${guests.children} trẻ em` : '';
        return adultsText + childrenText;
    };

    return (
        <section className="relative bg-white border-t border-gray-200">
            <div className="w-full max-w-7xl mx-auto px-4 py-4 md:py-5">
                {/* Search Bar Container */}
                <div className="flex flex-col md:flex-row md:items-end md:gap-3 lg:gap-4">
                    {/* Title */}
                    <div className="mb-3 md:mb-0 flex-shrink-0">
                        <h2
                            className="text-lg md:text-xl font-bold"
                            style={{
                                color: COLORS.primary,
                                fontFamily: TYPOGRAPHY.fontFamily.primary,
                            }}
                        >
                            ĐẶT PHÒNG
                        </h2>
                    </div>

                    {/* Search Form */}
                    <div className="flex-1 flex flex-col sm:flex-row gap-2 md:gap-2 items-stretch sm:items-end">
                        {/* Date Range Picker */}
                        <div className="flex-1">
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                                Ngày nhận - trả phòng
                            </label>
                            <RangePicker
                                size="large"
                                className="w-full"
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
                                style={{ fontSize: '13px', border: `1px solid ${COLORS.gray[300]}` }}
                            />
                        </div>

                        {/* Guest Selector Modal */}
                        <div className="flex-shrink-0 w-full sm:w-48">
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                                Khách
                            </label>
                            <button
                                onClick={() => setIsGuestModalOpen(true)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-left text-gray-700 hover:border-gray-400 transition-colors text-sm"
                                style={{ fontSize: '13px' }}
                            >
                                {getGuestLabel()}
                            </button>
                        </div>

                        {/* Search Button */}
                        <Button
                            type="primary"
                            size="large"
                            className="w-full sm:w-auto px-5 text-sm font-semibold flex-shrink-0"
                            onClick={handleSearch}
                            style={{
                                backgroundColor: COLORS.primary,
                                borderColor: COLORS.primary,
                                fontFamily: TYPOGRAPHY.fontFamily.secondary,
                            }}
                        >
                            TÌM PHÒNG
                        </Button>
                    </div>
                </div>
            </div>

            {/* Guest Selection Modal */}
            <Modal
                title="Chọn khách"
                open={isGuestModalOpen}
                onCancel={() => setIsGuestModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsGuestModalOpen(false)}>
                        Hoàn tất
                    </Button>,
                ]}
                centered
            >
                <div className="space-y-6">
                    {/* Adults */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-lg font-medium text-gray-700">Người lớn</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleRemoveAdult}
                                disabled={guests.adults <= 1}
                                className="p-2 border border-gray-300 rounded hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <MinusOutlined />
                            </button>
                            <span className="text-lg font-semibold w-8 text-center">{guests.adults}</span>
                            <button
                                onClick={handleAddAdult}
                                className="p-2 border border-gray-300 rounded hover:border-gray-400"
                            >
                                <PlusOutlined />
                            </button>
                        </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-lg font-medium text-gray-700">Trẻ em</p>
                            <p className="text-sm text-gray-500">Dưới 12 tuổi</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleRemoveChild}
                                disabled={guests.children <= 0}
                                className="p-2 border border-gray-300 rounded hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <MinusOutlined />
                            </button>
                            <span className="text-lg font-semibold w-8 text-center">{guests.children}</span>
                            <button
                                onClick={handleAddChild}
                                className="p-2 border border-gray-300 rounded hover:border-gray-400"
                            >
                                <PlusOutlined />
                            </button>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Tổng cộng: <span className="font-semibold">{getTotalGuests()} khách</span>
                        </p>
                    </div>
                </div>
            </Modal>
        </section>
    );
};

export default SearchSection;
