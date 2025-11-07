import React from 'react';
import { TYPOGRAPHY } from '@/config/constants';
import ImageSlider from './ImageSlider';

const HeroSection: React.FC = () => {
    const sliderImages = [
        '/images/home1.jpg',
        '/images/home2.jpg',
        '/images/home3.jpg',
    ];

    return (
        <section className="relative h-96 sm:h-screen md:h-screen flex items-center justify-center overflow-hidden" style={{ paddingTop: '60px' }}>
            {/* Background Image Slider */}
            <ImageSlider images={sliderImages} interval={5000} />

            {/* Content */}
            <div className="relative z-10 text-center text-white w-full max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-0">
                <h1
                    className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-6 leading-tight"
                    style={{
                        fontFamily: TYPOGRAPHY.fontFamily.primary,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    }}
                >
                    LION BOUTIQUE HOTEL
                </h1>
                <p
                    className="text-xs sm:text-xl md:text-2xl mb-4 sm:mb-12 font-light px-2 sm:px-4"
                    style={{
                        fontFamily: TYPOGRAPHY.fontFamily.secondary,
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}
                >
                    Trải nghiệm sang trọng giữa lòng Hà Nội
                </p>
            </div>
        </section>
    );
};

export default HeroSection;
