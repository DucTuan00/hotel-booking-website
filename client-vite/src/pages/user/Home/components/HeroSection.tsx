import React from 'react';
import { TYPOGRAPHY, COLORS } from '@/config/constants';
import ImageSlider from './ImageSlider';
import { ArrowDownOutlined } from '@ant-design/icons';

const HeroSection: React.FC = () => {
    const sliderImages = [
        '/images/home1.jpg',
        '/images/home2.jpg',
        '/images/home3.jpg',
    ];

    const scrollToSearch = () => {
        const searchSection = document.getElementById('search-section');
        if (searchSection) {
            searchSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <section className="relative h-[60vh] sm:h-[85vh] min-h-[400px] sm:min-h-[500px] flex items-center justify-center overflow-hidden">
            {/* Background Image Slider with improved overlay */}
            <div className="absolute inset-0 w-full h-full">
                <ImageSlider images={sliderImages} interval={5000} />
                {/* Gradient Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center text-white w-full max-w-6xl mx-auto px-4 sm:px-6 fade-in-up visible pt-10 sm:pt-0">
                <p 
                    className="text-[10px] sm:text-base md:text-lg tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-2 sm:mb-6 opacity-100 md:animate-fadeIn"
                    style={{ 
                        fontFamily: TYPOGRAPHY.fontFamily.secondary,
                        animationDelay: '0.2s',
                        animationFillMode: 'forwards'
                    }}
                >
                    Welcome to
                </p>
                <h1
                    className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-3 sm:mb-8 leading-tight opacity-100 md:animate-fadeIn"
                    style={{
                        fontFamily: TYPOGRAPHY.fontFamily.primary,
                        textShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        animationDelay: '0.4s',
                        animationFillMode: 'forwards'
                    }}
                >
                    LION BOUTIQUE HOTEL
                </h1>
                <div 
                    className="w-12 sm:w-24 h-0.5 sm:h-1 mx-auto mb-4 sm:mb-8 opacity-100 md:animate-fadeIn"
                    style={{ 
                        backgroundColor: COLORS.primary,
                        animationDelay: '0.6s',
                        animationFillMode: 'forwards'
                    }}
                ></div>
                <p
                    className="text-sm sm:text-xl md:text-3xl font-light max-w-3xl mx-auto opacity-100 md:animate-fadeIn px-2"
                    style={{
                        fontFamily: TYPOGRAPHY.fontFamily.primary,
                        fontStyle: 'italic',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        animationDelay: '0.8s',
                        animationFillMode: 'forwards'
                    }}
                >
                    "Trải nghiệm sang trọng giữa lòng Hà Nội"
                </p>
            </div>    
                {/* Scroll Indicator */}
                <div 
                    className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 text-white animate-bounce cursor-pointer z-10"
                    onClick={scrollToSearch}
                >
                    <ArrowDownOutlined style={{ fontSize: '24px', opacity: 0.8 }} />
                </div>
            </section>
        );};

export default HeroSection;
