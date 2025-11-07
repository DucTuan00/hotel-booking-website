import React from 'react';
import { Rate } from 'antd';
import { COLORS, TYPOGRAPHY } from '@/config/constants';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

const TestimonialsSection: React.FC = () => {
    const { elementRef: sectionRef, isVisible } = useIntersectionObserver({
        threshold: 0.3
    });

    const testimonials = [
        {
            id: 1,
            name: 'Nguyễn Văn A',
            rating: 5,
            comment: 'Khách sạn tuyệt vời với dịch vụ chuyên nghiệp. Nhân viên rất thân thiện và phòng ốc sạch sẽ, thoải mái. Tôi sẽ quay lại lần sau.',
            avatar: '/images/default-image.jpg',
        },
        {
            id: 2,
            name: 'Trần Văn Nam',
            rating: 5,
            comment: 'Vị trí tuyệt vời, gần biển và các điểm tham quan. Spa ở đây rất tuyệt, giúp tôi thư giãn hoàn toàn sau những ngày làm việc căng thẳng.',
            avatar: '/images/default-image.jpg',
        },
    ];

    return (
        <section ref={sectionRef} className="relative h-96 sm:h-[28rem] lg:h-[32rem] my-12 sm:my-16 lg:my-20 bg-gray-100">
            {/* Background Image - Full width, centered */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url(/images/home8.jpg)`,
                }}
            >
            </div>

            {/* Content - Overlay */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="w-full max-w-6xl mx-auto px-3 sm:px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center h-full">

                    {/* Right Side - Testimonials (Red Box Overlay) */}
                    <div
                        className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                            }`}
                        style={{ transitionDelay: '200ms' }}
                    >
                        <div
                            className="p-6 sm:p-8 lg:p-10 rounded-lg shadow-2xl h-full flex flex-col justify-center"
                            style={{ backgroundColor: COLORS.secondary }}
                        >
                            {/* Title with line */}
                            <div className="mb-5 sm:mb-6">
                                <div className="flex items-center gap-3 mb-1">
                                    <div 
                                        className="w-10 h-1"
                                        style={{ backgroundColor: COLORS.primary }}
                                    ></div>
                                    <h2
                                        className="text-lg sm:text-xl lg:text-2xl font-bold text-white"
                                        style={{ fontFamily: TYPOGRAPHY.fontFamily.primary }}
                                    >
                                        CẢM NHẬN KHÁCH HÀNG
                                    </h2>
                                </div>
                            </div>

                            <div className="space-y-4 sm:space-y-5">
                                {testimonials.map((testimonial, index) => (
                                    <div
                                        key={testimonial.id}
                                        className={`bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 sm:p-6 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                                            }`}
                                        style={{ transitionDelay: `${600 + index * 200}ms` }}
                                    >
                                    <div
                                    className="flex items-center mb-2 sm:mb-3"
                                >
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover mr-3"
                                    />
                                    <div className="flex-1">
                                        <h4
                                            className="text-black font-semibold text-xs sm:text-sm"
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
                                    className="text-white text-xs sm:text-sm leading-relaxed opacity-95"
                                    style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
                                >
                                    "{testimonial.comment}"
                                </p>
                                    </div>
                                ))}
                            </div>

                            {/* Navigation Buttons */}
                            <div
                                className={`flex justify-start gap-2 mt-3 sm:mt-4 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                                style={{ transitionDelay: '1000ms' }}
                            >
                                <button className="p-1.5 rounded-full border-2 border-white hover:bg-white hover:text-gray-800 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button className="p-1.5 rounded-full border-2 border-white hover:bg-white hover:text-gray-800 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
