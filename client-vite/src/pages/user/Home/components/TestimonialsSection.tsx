import React from 'react';
import { Rate } from 'antd';
import { COLORS, TYPOGRAPHY, DEMO_IMAGES } from '@/config/constants';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

const TestimonialsSection: React.FC = () => {
    const { elementRef: sectionRef, isVisible } = useIntersectionObserver({
        threshold: 0.3
    });

    const testimonials = [
        {
            id: 1,
            name: 'Nguyễn Minh Anh',
            rating: 5,
            comment: 'Khách sạn tuyệt vời với dịch vụ chuyên nghiệp. Nhân viên rất thân thiện và phòng ốc sạch sẽ, thoải mái. Tôi sẽ quay lại lần sau.',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        },
        {
            id: 2,
            name: 'Trần Văn Nam',
            rating: 5,
            comment: 'Vị trí tuyệt vời, gần biển và các điểm tham quan. Spa ở đây rất tuyệt, giúp tôi thư giãn hoàn toàn sau những ngày làm việc căng thẳng.',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
        },
    ];

    return (
        <section ref={sectionRef} className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${DEMO_IMAGES.hero})`,
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-70"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                    {/* Left Side - Hotel Image */}
                    <div
                        className={`order-2 lg:order-1 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                            }`}
                        style={{ transitionDelay: '200ms' }}
                    >
                        <img
                            src={DEMO_IMAGES.hero}
                            alt="Lion Boutique Hotel"
                            className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-2xl"
                        />
                    </div>

                    {/* Right Side - Testimonials */}
                    <div
                        className={`order-1 lg:order-2 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                            }`}
                        style={{ transitionDelay: '400ms' }}
                    >
                        <div
                            className="p-6 sm:p-8 rounded-lg"
                            style={{ backgroundColor: COLORS.secondary }}
                        >
                            <h2
                                className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center"
                                style={{ fontFamily: TYPOGRAPHY.fontFamily.primary }}
                            >
                                CẢM NHẬN KHÁCH HÀNG
                            </h2>

                            <div className="space-y-6 sm:space-y-8">
                                {testimonials.map((testimonial, index) => (
                                    <div
                                        key={testimonial.id}
                                        className={`bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 sm:p-6 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                                            }`}
                                        style={{ transitionDelay: `${600 + index * 200}ms` }}
                                    >
                                        <div className="flex items-center mb-3 sm:mb-4">
                                            <img
                                                src={testimonial.avatar}
                                                alt={testimonial.name}
                                                className="w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover mr-3 sm:mr-4"
                                            />
                                            <div>
                                                <h4
                                                    className="text-white font-semibold text-sm sm:text-base"
                                                    style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
                                                >
                                                    {testimonial.name}
                                                </h4>
                                                <Rate
                                                    disabled
                                                    defaultValue={testimonial.rating}
                                                    className="text-yellow-400"
                                                    style={{ fontSize: '12px' }}
                                                />
                                            </div>
                                        </div>
                                        <p
                                            className="text-white text-xs sm:text-sm leading-relaxed opacity-90"
                                            style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
                                        >
                                            "{testimonial.comment}"
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Navigation Dots */}
                            <div
                                className={`flex justify-center mt-6 sm:mt-8 space-x-2 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                                style={{ transitionDelay: '1000ms' }}
                            >
                                <div
                                    className="w-2 sm:w-3 h-2 sm:h-3 rounded-full"
                                    style={{ backgroundColor: COLORS.primary }}
                                ></div>
                                <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-white bg-opacity-30"></div>
                                <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-white bg-opacity-30"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
