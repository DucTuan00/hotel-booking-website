import React from 'react';
import { Button } from 'antd';

interface RestaurantHeroProps {
    onBookingClick: () => void;
}

const RestaurantHero: React.FC<RestaurantHeroProps> = ({ onBookingClick }) => {
    return (
        <section className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center text-white text-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/images/restaurants/cover.jpg')`,
                }}
            />
            
            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 text-shadow-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
                    RESTAURANT & BAR
                </h1>
                <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                    Trải nghiệm ẩm thực đẳng cấp với không gian sang trọng
                </p>
                
                <Button 
                    type="primary"
                    size="large"
                    onClick={onBookingClick}
                    className="bg-[#D4902A] hover:bg-[#B8761E] border-[#D4902A] hover:border-[#B8761E] font-semibold text-lg px-12 py-6 h-auto uppercase tracking-wider"
                >
                    ĐẶT NGAY
                </Button>
            </div>
        </section>
    );
};

export default RestaurantHero;