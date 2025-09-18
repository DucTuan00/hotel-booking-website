import React from 'react';
import { Button } from 'antd';
import { COLORS, TYPOGRAPHY, DEMO_IMAGES } from '@/config/constants';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

const ToursSection: React.FC = () => {
    const { elementRef: sectionRef, isVisible } = useIntersectionObserver({
        threshold: 0.3
    });

    const tours = [
        {
            id: 1,
            title: 'HẠ LONG',
            subtitle: 'THUYỀN RỒNG NGỌC THÁI',
            description: 'Khám phá vịnh Hạ Long huyền thoại với thuyền rồng sang trọng',
            image: DEMO_IMAGES.haLongBay,
            duration: '2 ngày 1 đêm',
        },
        {
            id: 2,
            title: 'SẢN VẬN MAY',
            subtitle: 'FANSIPAN DAY TOUR',
            description: 'Chinh phục nóc nhà Đông Dương trong chuyến du lịch một ngày',
            image: DEMO_IMAGES.sapa,
            duration: '1 ngày',
        },
        {
            id: 3,
            title: 'HỘI AN',
            subtitle: 'ĐI VỚI CON QUÁ DÀNH',
            description: 'Khám phá phố cổ Hội An cùng gia đình với tour đặc biệt cho trẻ em',
            image: DEMO_IMAGES.hoiAn,
            duration: '3 ngày 2 đêm',
        },
    ];

    return (
        <section ref={sectionRef} className="py-12 sm:py-16 lg:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
                {/* Section Header */}
                <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                    <h2
                        className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                        style={{
                            fontFamily: TYPOGRAPHY.fontFamily.primary,
                            transitionDelay: '200ms'
                        }}
                    >
                        TOURS & PACKAGES
                    </h2>
                    <p
                        className={`text-gray-600 max-w-3xl mx-auto text-sm sm:text-base lg:text-lg transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                        style={{
                            fontFamily: TYPOGRAPHY.fontFamily.secondary,
                            transitionDelay: '400ms'
                        }}
                    >
                        Khám phá những điểm đến tuyệt vời cùng các gói tour đặc biệt được thiết kế riêng cho khách lưu trú
                    </p>
                </div>

                {/* Tours Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
                    {tours.map((tour, index) => (
                        <div
                            key={tour.id}
                            className={`relative group cursor-pointer transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                                }`}
                            style={{ transitionDelay: `${600 + index * 200}ms` }}
                        >
                            <div className="relative overflow-hidden rounded-lg shadow-xl">
                                <img
                                    src={tour.image}
                                    alt={tour.title}
                                    className="w-full h-64 sm:h-72 lg:h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80"></div>

                                {/* Duration Badge */}
                                <div className="absolute top-4 right-4">
                                    <span
                                        className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium text-white"
                                        style={{ backgroundColor: COLORS.primary }}
                                    >
                                        {tour.duration}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                                    <h3
                                        className="text-lg sm:text-xl lg:text-2xl font-bold mb-2"
                                        style={{ fontFamily: TYPOGRAPHY.fontFamily.primary }}
                                    >
                                        {tour.title}
                                    </h3>
                                    <h4
                                        className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-3 opacity-90"
                                        style={{
                                            fontFamily: TYPOGRAPHY.fontFamily.primary,
                                            color: COLORS.primary
                                        }}
                                    >
                                        {tour.subtitle}
                                    </h4>
                                    <p
                                        className="text-xs sm:text-sm mb-3 sm:mb-4 opacity-90 line-clamp-2"
                                        style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
                                    >
                                        {tour.description}
                                    </p>
                                    <Button
                                        type="primary"
                                        size="small"
                                        className="bg-transparent border-white text-white hover:bg-white hover:text-gray-800 text-xs sm:text-sm"
                                        style={{
                                            fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                            fontWeight: TYPOGRAPHY.fontWeight.medium,
                                        }}
                                    >
                                        XEM CHI TIẾT
                                    </Button>
                                </div>

                                {/* Hover Effect */}
                                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="text-center">
                    <Button
                        type="primary"
                        size="large"
                        className={`px-6 sm:px-8 lg:px-12 py-2 sm:py-3 h-auto text-sm sm:text-base transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                        style={{
                            backgroundColor: COLORS.primary,
                            borderColor: COLORS.primary,
                            fontFamily: TYPOGRAPHY.fontFamily.secondary,
                            fontWeight: TYPOGRAPHY.fontWeight.semibold,
                            transitionDelay: '1200ms'
                        }}
                    >
                        XEM TẤT CẢ TOUR
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default ToursSection;
