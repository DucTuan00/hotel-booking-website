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
        <section ref={sectionRef} className="relative py-24 overflow-hidden">
            {/* Background Image with Dark Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/home8.jpg"
                    alt="Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <span
                        className="text-[#E6B655] font-bold tracking-widest uppercase text-sm mb-3 block"
                        style={{
                            color: COLORS.primary
                        }}
                    >
                        Testimonials
                    </span>
                    <h2
                        className="text-4xl md:text-5xl font-bold text-white mb-6"
                        style={{ fontFamily: TYPOGRAPHY.fontFamily.primary }}
                    >
                        CẢM NHẬN KHÁCH HÀNG
                    </h2>
                    <div
                        className="w-24 h-1 bg-[#D4902A] mx-auto rounded-full"
                        style={{
                            color: COLORS.primary
                        }}
                    >
                    </div>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={testimonial.id}
                            className={`bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-2xl transition-all duration-700 transform hover:-translate-y-2 hover:bg-white/15 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                }`}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-[#D4902A]/50"
                                />
                                <div>
                                    <h4
                                        className="text-white font-bold text-lg"
                                        style={{ fontFamily: TYPOGRAPHY.fontFamily.primary }}
                                    >
                                        {testimonial.name}
                                    </h4>
                                    <Rate
                                        disabled
                                        defaultValue={testimonial.rating}
                                        className="text-[#E6B655] text-sm"
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <span className="absolute -top-4 -left-2 text-6xl text-[#D4902A]/20 font-serif leading-none">"</span>
                                <p
                                    className="text-gray-300 text-base leading-relaxed relative z-10 italic"
                                    style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
                                >
                                    {testimonial.comment}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Add a fake 3rd testimonial for better grid balance if needed, or keep 2 centered */}
                    <div
                        className={`bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-2xl transition-all duration-700 transform hover:-translate-y-2 hover:bg-white/15 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}
                        style={{ transitionDelay: '300ms' }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-full bg-[#D4902A]/20 flex items-center justify-center text-[#D4902A] font-bold text-xl border-2 border-[#D4902A]/50">
                                L
                            </div>
                            <div>
                                <h4
                                    className="text-white font-bold text-lg"
                                    style={{ fontFamily: TYPOGRAPHY.fontFamily.primary }}
                                >
                                    Le Hoang
                                </h4>
                                <Rate
                                    disabled
                                    defaultValue={5}
                                    className="text-[#E6B655] text-sm"
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <span className="absolute -top-4 -left-2 text-6xl text-[#D4902A]/20 font-serif leading-none">"</span>
                            <p
                                className="text-gray-300 text-base leading-relaxed relative z-10 italic"
                                style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
                            >
                                Không gian sang trọng, ấm cúng. Đồ ăn sáng rất ngon và đa dạng. Chắc chắn sẽ giới thiệu cho bạn bè.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
