import React from 'react';
import { Button } from 'antd';
import { COLORS, TYPOGRAPHY, DEMO_IMAGES } from '@/config/constants';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

const ServicesSection: React.FC = () => {
    const { elementRef: sectionRef, isVisible } = useIntersectionObserver({
        threshold: 0.3
    });

    return (
        <section ref={sectionRef} className="py-12 sm:py-16 lg:py-20 bg-gray-50">
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
                        DỊCH VỤ CỦA CHÚNG TÔI
                    </h2>
                </div>

                {/* Spa Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-12 sm:mb-16 lg:mb-20">
                    <div
                        className={`order-2 lg:order-1 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                            }`}
                        style={{ transitionDelay: '400ms' }}
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
                        style={{ transitionDelay: '600ms' }}
                    >
                        <div
                            className="text-white p-6 sm:p-8 rounded-lg"
                            style={{ backgroundColor: COLORS.secondary }}
                        >
                            <h3
                                className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4"
                                style={{ fontFamily: TYPOGRAPHY.fontFamily.primary }}
                            >
                                LION SPA & TẮM BIA
                            </h3>
                            <p
                                className="text-base leading-relaxed mb-4 sm:mb-6"
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
                                onClick={() => {
                                    window.location.href = '/spa';
                                }}
                            >
                                TÌM HIỂU THÊM
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Restaurant Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                    <div
                        className={`order-1 lg:order-1 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                            }`}
                        style={{ transitionDelay: '800ms' }}
                    >
                        <div
                            className="text-white p-6 sm:p-8 rounded-lg"
                            style={{ backgroundColor: COLORS.secondary }}
                        >
                            <h3
                                className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4"
                                style={{ fontFamily: TYPOGRAPHY.fontFamily.primary }}
                            >
                                NHÀ HÀNG LION
                            </h3>
                            <p
                                className="text-base leading-relaxed mb-4 sm:mb-6"
                                style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
                            >
                                Trải nghiệm ẩm thực đẳng cấp tại nhà hàng của chúng tôi với thực đơn đa dạng
                                từ món Á đến món Âu, được chế biến bởi đội ngũ đầu bếp chuyên nghiệp.
                                Không gian sang trọng, view biển tuyệt đẹp và phục vụ tận tâm sẽ mang đến
                                cho bạn những bữa ăn đáng nhớ.
                            </p>
                            <Button
                                type="primary"
                                size="small"
                                className="border-white hover:bg-white hover:text-yellow-800 text-xs sm:text-sm underline"
                                style={{
                                    fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                    fontWeight: TYPOGRAPHY.fontWeight.medium,
                                    backgroundColor: 'transparent',
                                    color: 'white',
                                }}
                                onClick={() => {
                                    window.location.href = '/restaurant';
                                }}
                            >
                                KHÁM PHÁ THỰC ĐƠN
                            </Button>
                        </div>
                    </div>
                    <div
                        className={`order-2 lg:order-2 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                            }`}
                        style={{ transitionDelay: '1000ms' }}
                    >
                        <img
                            src={DEMO_IMAGES.restaurant}
                            alt="Nhà hàng Lion"
                            className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
