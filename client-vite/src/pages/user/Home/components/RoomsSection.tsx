import React from 'react';
import { Button } from 'antd';
import { COLORS, TYPOGRAPHY } from '@/config/constants';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

const RoomsSection: React.FC = () => {
    const { elementRef: sectionRef, isVisible } = useIntersectionObserver({
        threshold: 0.3
    });

        return (
            <section ref={sectionRef} className="py-12 sm:py-20 bg-gray-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Title */}
                    <div className="text-center mb-10 sm:mb-16">
                        <span 
                            className="block text-xs sm:text-sm font-bold tracking-[0.2em] text-gray-500 uppercase mb-2 sm:mb-3"
                            style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
                        >
                            Accommodation
                        </span>
                        <h2
                            className={`text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                }`}
                            style={{
                                fontFamily: TYPOGRAPHY.fontFamily.primary,
                                transitionDelay: '200ms'
                            }}
                        >
                            PHÒNG & GIÁ
                        </h2>
                        <div className="w-12 sm:w-16 h-0.5 bg-gray-300 mx-auto"></div>
                    </div>
    
                    {/* Rooms Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-16">
                        {/* Phòng Đôi */}
                        <div
                            className={`group cursor-pointer relative overflow-hidden rounded-xl shadow-lg transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                                }`}
                            style={{ transitionDelay: '400ms' }}
                            onClick={() => window.location.href = '/rooms'}
                        >
                            <div className="aspect-w-16 aspect-h-10 h-64 sm:h-80 md:h-[400px]">
                                <img
                                    src="/images/home4.jpg"
                                    alt="Phòng Đôi"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity duration-300"></div>
                            
                            <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                                 <span className="bg-white/20 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full uppercase tracking-wider border border-white/30">
                                    PHỔ BIẾN
                                 </span>
                            </div>
    
                            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                <h3
                                    className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2"
                                    style={{ fontFamily: TYPOGRAPHY.fontFamily.primary }}
                                >
                                    PHÒNG ĐÔI
                                </h3>
                                <div className="h-0.5 w-12 bg-white/50 mb-2 sm:mb-4 group-hover:w-20 transition-all duration-500"></div>
                                <p
                                    className="text-gray-200 text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 delay-100"
                                    style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
                                >
                                    Phòng thoải mái với giường đôi, view đẹp, đầy đủ tiện nghi cao cấp. Lý tưởng cho cặp đôi và khách công tác
                                </p>
                                <span className="inline-flex items-center text-white text-xs sm:text-sm font-bold uppercase tracking-widest border-b border-transparent group-hover:border-white transition-colors pb-1">
                                    Xem chi tiết
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </span>
                            </div>
                        </div>
    
                        {/* Phòng Suite Gia Đình */}
                        <div
                            className={`group cursor-pointer relative overflow-hidden rounded-xl shadow-lg transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                                }`}
                            style={{ transitionDelay: '600ms' }}
                            onClick={() => window.location.href = '/rooms'}
                        >
                            <div className="aspect-w-16 aspect-h-10 h-64 sm:h-80 md:h-[400px]">
                                <img
                                    src="/images/home5.jpg"
                                    alt="Phòng Suite Gia Đình"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity duration-300"></div>
                            
                            <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                                 <span className="bg-white/20 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full uppercase tracking-wider border border-white/30">
                                    GIA ĐÌNH
                                 </span>
                            </div>
    
                            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                <h3
                                    className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2"
                                    style={{ fontFamily: TYPOGRAPHY.fontFamily.primary }}
                                >
                                    PHÒNG SUITE GIA ĐÌNH
                                </h3>
                                <div className="h-0.5 w-12 bg-white/50 mb-2 sm:mb-4 group-hover:w-20 transition-all duration-500"></div>
                                <p
                                    className="text-gray-200 text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 delay-100"
                                    style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
                                >
                                    Phòng rộng rãi với không gian riêng biệt, giường tách, phòng khách. Lý tưởng cho gia đình và nhóm bạn
                                </p>
                                <span className="inline-flex items-center text-white text-xs sm:text-sm font-bold uppercase tracking-widest border-b border-transparent group-hover:border-white transition-colors pb-1">
                                    Xem chi tiết
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </span>
                            </div>
                        </div>
                    </div>
    
                    {/* CTA Section */}                <div
                    className={`text-center transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                        }`}
                    style={{ transitionDelay: '800ms' }}
                >
                    <Button
                        size="large"
                        className="px-10 py-6 h-auto text-base border-2 hover:bg-gray-900 hover:text-white transition-all duration-300 rounded"
                        style={{
                            borderColor: COLORS.black,
                            color: COLORS.black,
                            fontFamily: TYPOGRAPHY.fontFamily.secondary,
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase'
                        }}
                        onClick={() => {
                            window.location.href = '/rooms';
                        }}
                    >
                        Xem Tất Cả Các Phòng
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default RoomsSection;
