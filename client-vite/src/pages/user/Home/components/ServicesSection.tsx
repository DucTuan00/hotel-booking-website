import React from 'react';
import { Button } from 'antd';
import { COLORS, TYPOGRAPHY } from '@/config/constants';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

const ServicesSection: React.FC = () => {
    const { elementRef: sectionRef, isVisible } = useIntersectionObserver({
        threshold: 0.3
    });

    return (
        <section ref={sectionRef} className="py-12 sm:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Title */}
                <div className="text-center mb-10 sm:mb-20">
                    <span
                        className="block text-xs sm:text-sm font-bold tracking-[0.2em] text-gray-500 uppercase mb-2 sm:mb-3"
                        style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
                    >
                        Experience
                    </span>
                    <h2
                        className={`text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                        style={{
                            fontFamily: TYPOGRAPHY.fontFamily.primary,
                            transitionDelay: '200ms'
                        }}
                    >
                        DỊCH VỤ CỦA CHÚNG TÔI
                    </h2>
                    <div className="w-12 sm:w-16 h-0.5 bg-gray-300 mx-auto"></div>
                </div>

                {/* Spa Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-24 items-center mb-16 sm:mb-32">
                    <div
                        className={`relative order-2 lg:order-1 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                            }`}
                        style={{ transitionDelay: '400ms' }}
                    >
                        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="/images/home9.jpg"
                                alt="Lion Westlake Studio & Spa"
                                className="w-full h-64 sm:h-80 lg:h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        {/* Decorative element */}
                        <div className="absolute -z-10 -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-full h-full border-2 border-gray-100 rounded-2xl hidden lg:block"></div>
                    </div>

                    <div
                        className={`order-1 lg:order-2 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                            }`}
                        style={{ transitionDelay: '600ms' }}
                    >
                        <span
                            className="font-bold tracking-widest uppercase text-xs sm:text-sm mb-2 sm:mb-4 block"
                            style={{
                                color: COLORS.primary
                            }}
                        >
                            Wellness
                        </span>
                        <h3
                            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-gray-900"
                            style={{ fontFamily: TYPOGRAPHY.fontFamily.primary }}
                        >
                            LION SPA & TẮM BIA
                        </h3>
                        <p
                            className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 font-light"
                            style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
                        >
                            Là một trong những spa hàng đầu, với đội ngũ kỹ thuật viên
                            chuyên nghiệp và các liệu pháp massage truyền thống kết hợp hiện đại.
                            Chúng tôi mang đến cho bạn những giây phút thư giãn tuyệt vời nhất.
                        </p>
                        <Button
                            type="link"
                            className="p-0 text-sm sm:text-base font-semibold uppercase tracking-widest group"
                            style={{
                                fontFamily: TYPOGRAPHY.fontFamily.secondary,
                            }}
                            onClick={() => {
                                window.location.href = '/spa';
                            }}
                        >
                            Tìm hiểu thêm
                            <span className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                        </Button>
                    </div>
                </div>

                {/* Restaurant Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-24 items-center">
                    <div
                        className={`order-1 lg:order-1 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                            }`}
                        style={{ transitionDelay: '800ms' }}
                    >
                        <span
                            className="font-bold tracking-widest uppercase text-xs sm:text-sm mb-2 sm:mb-4 block"
                            style={{
                                color: COLORS.primary
                            }}
                        >
                            Dining
                        </span>
                        <h3
                            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-gray-900"
                            style={{ fontFamily: TYPOGRAPHY.fontFamily.primary }}
                        >
                            NHÀ HÀNG LION & SKY BAR
                        </h3>
                        <p
                            className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 font-light"
                            style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
                        >
                            Trải nghiệm ẩm thực đẳng cấp tại nhà hàng của chúng tôi với thực đơn đa dạng
                            từ món Á đến món Âu. Không gian sang trọng, view biển tuyệt đẹp và phục vụ tận tâm
                            sẽ mang đến cho bạn những bữa ăn đáng nhớ.
                        </p>
                        <Button
                            type="link"
                            className="p-0 text-sm sm:text-base font-semibold uppercase tracking-widest group"
                            style={{
                                fontFamily: TYPOGRAPHY.fontFamily.secondary,
                            }}
                            onClick={() => {
                                window.location.href = '/restaurant';
                            }}
                        >
                            Khám phá thực đơn
                            <span className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                        </Button>
                    </div>

                    <div
                        className={`relative order-2 lg:order-2 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                            }`}
                        style={{ transitionDelay: '1000ms' }}
                    >
                        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="/images/home10.jpg"
                                alt="Nhà hàng Lion"
                                className="w-full h-64 sm:h-80 lg:h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        {/* Decorative element */}
                        <div className="absolute -z-10 -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-full h-full border-2 border-gray-100 rounded-2xl hidden lg:block"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
