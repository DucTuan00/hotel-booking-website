import React from 'react';
import { Button, DatePicker, Select, InputNumber } from 'antd';
import { useNavigate } from 'react-router-dom';
import { COLORS, TYPOGRAPHY, DEMO_IMAGES } from '@/config/constants';

const { RangePicker } = DatePicker;
const { Option } = Select;

const HeroSection: React.FC = () => {
    const navigate = useNavigate();

    const handleSearch = () => {
        navigate('/search');
    };
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ paddingTop: '60px' }}>
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${DEMO_IMAGES.hero})`,
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center text-white w-full max-w-5xl mx-auto px-3 sm:px-4">
                <h1
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
                    style={{
                        fontFamily: TYPOGRAPHY.fontFamily.primary,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    }}
                >
                    LION BOUTIQUE HOTEL
                </h1>
                <p
                    className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 font-light px-2 sm:px-4"
                    style={{
                        fontFamily: TYPOGRAPHY.fontFamily.secondary,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}
                >
                    Trải nghiệm sang trọng giữa lòng Hà Nội
                </p>

                {/* Booking Form */}
                <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-3 sm:p-4 lg:p-6 w-full max-w-6xl mx-auto booking-form">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 items-end">
                        {/* Check-in/Check-out */}
                        <div className="sm:col-span-2 lg:col-span-2">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                Ngày nhận - trả phòng
                            </label>
                            <RangePicker
                                size="large"
                                className="w-full"
                                placeholder={['Nhận phòng', 'Trả phòng']}
                                style={{ fontSize: '14px' }}
                            />
                        </div>

                        {/* Guests */}
                        <div className="sm:col-span-1 lg:col-span-1">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                Số khách
                            </label>
                            <InputNumber
                                size="large"
                                min={1}
                                max={10}
                                defaultValue={2}
                                className="w-full"
                                placeholder="2"
                                style={{ fontSize: '14px' }}
                            />
                        </div>

                        {/* Room Type */}
                        <div className="sm:col-span-1 lg:col-span-1">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                Loại phòng
                            </label>
                            <Select
                                size="large"
                                defaultValue="standard"
                                className="w-full"
                                placeholder="Standard"
                                style={{ fontSize: '14px' }}
                            >
                                <Option value="standard">Standard</Option>
                                <Option value="superior">Superior</Option>
                                <Option value="deluxe">Deluxe</Option>
                                <Option value="suite">Suite</Option>
                            </Select>
                        </div>

                        {/* Search Button */}
                        <div className="sm:col-span-2 lg:col-span-1">
                            <Button
                                type="primary"
                                size="large"
                                className="w-full h-10 sm:h-12 text-sm"
                                onClick={handleSearch}
                                style={{
                                    backgroundColor: COLORS.primary,
                                    borderColor: COLORS.primary,
                                    fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                    fontWeight: TYPOGRAPHY.fontWeight.semibold,
                                }}
                            >
                                TÌM PHÒNG
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="animate-bounce">
                    <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
