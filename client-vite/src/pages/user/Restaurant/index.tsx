import React, { useState, useEffect } from 'react';
import RestaurantHero from '@/pages/user/Restaurant/components/RestaurantHero';
import ServiceIntroduction from '@/pages/user/Restaurant/components/ServiceIntroduction';
import ServicesSlider from '@/pages/user/Restaurant/components/ServicesSlider';
import RestaurantGallery from '@/pages/user/Restaurant/components/RestaurantGallery';
import BookingModal from '@/pages/user/Restaurant/components/BookingModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import restaurantService from '@/services/restaurants/restaurantService';
import restaurantServiceService from '@/services/restaurants/restaurantServiceService';
import restaurantImageService from '@/services/restaurants/restaurantImageService';
import { Restaurant as RestaurantType, RestaurantService, RestaurantImage } from '@/types/restaurant';

const Restaurant: React.FC = () => {
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [restaurantInfo, setRestaurantInfo] = useState<RestaurantType | null>(null);
    const [services, setServices] = useState<RestaurantService[]>([]);
    const [images, setImages] = useState<RestaurantImage[]>([]);

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                setLoading(true);
                const [infoData, servicesData, imagesData] = await Promise.all([
                    restaurantService.getRestaurantInfo(),
                    restaurantServiceService.getAllRestaurantServices(),
                    restaurantImageService.getAllRestaurantImages(),
                ]);

                setRestaurantInfo(infoData);
                setServices(servicesData.services || []);
                setImages(imagesData.images || []);
            } catch (error) {
                console.error('Error fetching restaurant data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantData();
    }, []);

    const handleBookingClick = () => {
        setIsBookingModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsBookingModalOpen(false);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-white">
            <RestaurantHero onBookingClick={handleBookingClick} />
            <ServiceIntroduction 
                information={restaurantInfo?.information || ''} 
                images={images.slice(0, 2)}
            />
            <ServicesSlider 
                services={services}
                onBookingClick={handleBookingClick} 
            />
            <RestaurantGallery images={images} />
            <BookingModal isOpen={isBookingModalOpen} onClose={handleCloseModal} />
        </div>
    );
};

export default Restaurant;
