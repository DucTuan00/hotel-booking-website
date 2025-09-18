import React from 'react';
import { Button } from 'antd';
import { COLORS, TYPOGRAPHY, DEMO_IMAGES } from '@/config/constants';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

const RoomsSection: React.FC = () => {
    const { elementRef: sectionRef, isVisible } = useIntersectionObserver({
        threshold: 0.3
    });

    return (
        <section ref={sectionRef} className="py-12 sm:py-16 lg:py-20 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
                {/* Section Title */}
                <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                    <h2
                        className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                        style={{
                            fontFamily: TYPOGRAPHY.fontFamily.primary,
                            transitionDelay: '200ms'
                        }}
                    >
                        PHÒNG & GIÁ
                    </h2>
                </div>

                {/* Rooms Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12 lg:mb-16">
                    {/* Lion Boutique Hotel & Spa */}
                    <div
                        className={`relative group transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                            }`}
                        style={{ transitionDelay: '400ms' }}
                    >
                        <div className="relative overflow-hidden rounded-lg shadow-2xl">
                            <img
                                src={DEMO_IMAGES.lionBoutique}
                                alt="Lion Boutique Hotel & Spa"
                                className="w-full h-64 sm:h-72 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                                <h3
                                    className="text-lg sm:text-xl lg:text-2xl font-bold mb-2"
                                    style={{ fontFamily: TYPOGRAPHY.fontFamily.primary }}
                                >
                                    LION BOUTIQUE HOTEL & SPA
                                </h3>
                                <p
                                    className="text-xs sm:text-sm mb-3 sm:mb-4 opacity-90 line-clamp-2"
                                    style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
                                >
                                    Phòng cao cấp với đầy đủ tiện nghi hiện đại và dịch vụ spa thư giãn
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
                        </div>
                    </div>

                    {/* Lion Westlake Studio & Spa */}
                    <div
                        className={`relative group transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                            }`}
                        style={{ transitionDelay: '600ms' }}
                    >
                        <div className="relative overflow-hidden rounded-lg shadow-2xl">
                            <img
                                src={DEMO_IMAGES.lionWestlake}
                                alt="Lion Westlake Studio & Spa"
                                className="w-full h-64 sm:h-72 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                                <h3
                                    className="text-lg sm:text-xl lg:text-2xl font-bold mb-2"
                                    style={{ fontFamily: TYPOGRAPHY.fontFamily.primary }}
                                >
                                    LION WESTLAKE STUDIO & SPA
                                </h3>
                                <p
                                    className="text-xs sm:text-sm mb-3 sm:mb-4 opacity-90 line-clamp-2"
                                    style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
                                >
                                    Studio rộng rãi với view tuyệt đẹp và dịch vụ spa cao cấp
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
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <Button
                        type="primary"
                        size="large"
                        className="px-6 sm:px-8 lg:px-12 py-2 sm:py-3 h-auto text-sm sm:text-base"
                        style={{
                            backgroundColor: COLORS.primary,
                            borderColor: COLORS.primary,
                            fontFamily: TYPOGRAPHY.fontFamily.secondary,
                            fontWeight: TYPOGRAPHY.fontWeight.semibold,
                        }}
                    >
                        XEM TẤT CẢ PHÒNG
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default RoomsSection;
