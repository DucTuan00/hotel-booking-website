import React, { useState } from 'react';
import RestaurantHero from '@/pages/user/Restaurant/components/RestaurantHero';
import ServiceIntroduction from '@/pages/user/Restaurant/components/ServiceIntroduction';
import ServicesSlider from '@/pages/user/Restaurant/components/ServicesSlider';
import RestaurantGallery from '@/pages/user/Restaurant/components/RestaurantGallery';
import BookingModal from '@/pages/user/Restaurant/components/BookingModal';

const Restaurant: React.FC = () => {
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    const handleBookingClick = () => {
        setIsBookingModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsBookingModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-white">
            <RestaurantHero onBookingClick={handleBookingClick} />
            <ServiceIntroduction />
            <ServicesSlider onBookingClick={handleBookingClick} />
            <RestaurantGallery />
            <BookingModal isOpen={isBookingModalOpen} onClose={handleCloseModal} />
        </div>
    );
};

export default Restaurant;
