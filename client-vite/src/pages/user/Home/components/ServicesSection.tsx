import React from 'react';
import { Button } from 'antd';
import { COLORS, TYPOGRAPHY, DEMO_IMAGES } from '@/config/constants';
import useIntersectionObserver from '@/utils/useIntersectionObserver';

const ServicesSection: React.FC = () => {
    const { elementRef: sectionRef, isVisible } = useIntersectionObserver({
        threshold: 0.3
    });

    return (
        <section ref={sectionRef} className="py-12 sm:py-16 lg:py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
                {/* Spa Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-12 sm:mb-16 lg:mb-20">
                    <div
                        className={`order-2 lg:order-1 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                            }`}
                        style={{ transitionDelay: '200ms' }}
                    >
                        <img
                            src={DEMO_IMAGES.spa}
                            alt="Lion Westlake Studio & Spa"
                            className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-lg"
                        />
                    </div>
                    <div
                        className={`order-1 lg:order-2 lg:pl-8 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                            }`}
                        style={{ transitionDelay: '400ms' }}
                    >
                        <div
                            className="text-white p-6 sm:p-8 rounded-lg"
                            style={{ backgroundColor: COLORS.secondary }}
                        >
                            <h2
                                className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6"
                                style={{ fontFamily: TYPOGRAPHY.fontFamily.primary }}
                            >
                                DỊCH VỤ CỦA CHÚNG TÔI
                            </h2>
                            <h3
                                className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4"
                                style={{ fontFamily: TYPOGRAPHY.fontFamily.primary }}
                            >
                                LION WESTLAKE STUDIO & SPA
                            </h3>
                            <p
                                className="text-sm leading-relaxed mb-4 sm:mb-6"
                                style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
                            >
                                Là một trong những spa hàng đầu tại Nha Trang, với đội ngũ kỹ thuật viên
                                chuyên nghiệp và các liệu pháp massage truyền thống kết hợp hiện đại.
                                Chúng tôi mang đến cho bạn những giây phút thư giãn tuyệt vời nhất.
                            </p>
                            <Button
                                type="primary"
                                size="small"
                                className="bg-white text-red-800 border-white hover:bg-gray-100 text-xs sm:text-sm"
                                style={{
                                    fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                    fontWeight: TYPOGRAPHY.fontWeight.medium,
                                }}
                            >
                                TÌM HIỂU THÊM
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Amenities Section */}
                <div className="text-center mb-8 sm:mb-12">
                    <h2
                        className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                        style={{
                            fontFamily: TYPOGRAPHY.fontFamily.primary,
                            transitionDelay: '600ms'
                        }}
                    >
                        ƯU ĐÃI ĐẶC BIỆT
                    </h2>
                    <p
                        className={`text-gray-600 max-w-3xl mx-auto text-sm sm:text-base transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                        style={{
                            fontFamily: TYPOGRAPHY.fontFamily.secondary,
                            transitionDelay: '800ms'
                        }}
                    >
                        Khám phá những dịch vụ đặc biệt và trải nghiệm tuyệt vời tại khách sạn của chúng tôi
                    </p>
                </div>

                {/* Amenities Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {/* Family Suite Terrace */}
                    <div
                        className={`relative group cursor-pointer transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                            }`}
                        style={{ transitionDelay: '1000ms' }}
                    >
                        <div className="relative overflow-hidden rounded-lg shadow-lg">
                            <img
                                src={DEMO_IMAGES.familySuite}
                                alt="Family Suite Terrace"
                                className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
                            <div className="absolute top-4 left-4">
                                <span className="bg-white text-gray-800 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                                    ĐẶC BIỆT
                                </span>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                <h3
                                    className="text-base sm:text-lg font-bold mb-2"
                                    style={{ fontFamily: TYPOGRAPHY.fontFamily.primary }}
                                >
                                    Family Suite Terrace
                                </h3>
                                <p
                                    className="text-xs sm:text-sm opacity-90 line-clamp-2"
                                    style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
                                >
                                    Căn hộ gia đình với sân vườn riêng và view tuyệt đẹp ra biển
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Cocktail Bar */}
                    <div
                        className={`relative group cursor-pointer transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                            }`}
                        style={{ transitionDelay: '1200ms' }}
                    >
                        <div className="relative overflow-hidden rounded-lg shadow-lg">
                            <img
                                src={DEMO_IMAGES.cocktailBar}
                                alt="Cocktail Bar"
                                className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
                            <div className="absolute top-4 left-4">
                                <span className="bg-white text-gray-800 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                                    ĐẶC BIỆT
                                </span>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                <h3
                                    className="text-base sm:text-lg font-bold mb-2"
                                    style={{ fontFamily: TYPOGRAPHY.fontFamily.primary }}
                                >
                                    Combo Yên Bình & Cảm Hứng
                                </h3>
                                <p
                                    className="text-xs sm:text-sm opacity-90 line-clamp-2"
                                    style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
                                >
                                    Thưởng thức cocktail đặc biệt với không gian sang trọng
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Restaurant */}
                    <div
                        className={`relative group cursor-pointer transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                            } sm:col-span-2 lg:col-span-1`}
                        style={{ transitionDelay: '1400ms' }}
                    >
                        <div className="relative overflow-hidden rounded-lg shadow-lg">
                            <img
                                src={DEMO_IMAGES.restaurant}
                                alt="Love Your Body"
                                className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
                            <div className="absolute top-4 left-4">
                                <span className="bg-white text-gray-800 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                                    ĐẶC BIỆT
                                </span>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                <h3
                                    className="text-base sm:text-lg font-bold mb-2"
                                    style={{ fontFamily: TYPOGRAPHY.fontFamily.primary }}
                                >
                                    Love Your Body
                                </h3>
                                <p
                                    className="text-xs sm:text-sm opacity-90 line-clamp-2"
                                    style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
                                >
                                    Thời gian yêu thương bản thân với các dịch vụ chăm sóc
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
