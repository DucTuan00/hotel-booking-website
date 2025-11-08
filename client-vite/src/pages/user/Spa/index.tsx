import React, { useState, useEffect } from 'react';
import SpaHero from '@/pages/user/Spa/components/SpaHero';
import ServiceIntroduction from '@/pages/user/Spa/components/ServiceIntroduction';
import ServicesSlider from '@/pages/user/Spa/components/ServicesSlider';
import SpaGallery from '@/pages/user/Spa/components/SpaGallery';
import BookingModal from '@/pages/user/Spa/components/BookingModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import spaService from '@/services/spa/spaService';
import spaServiceService from '@/services/spa/spaServiceService';
import spaImageService from '@/services/spa/spaImageService';
import { Spa as SpaType, SpaService, SpaImage } from '@/types/spa';

const Spa: React.FC = () => {
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [spaInfo, setSpaInfo] = useState<SpaType | null>(null);
    const [services, setServices] = useState<SpaService[]>([]);
    const [images, setImages] = useState<SpaImage[]>([]);

    useEffect(() => {
        const fetchSpaData = async () => {
            try {
                setLoading(true);
                const [infoData, servicesData, imagesData] = await Promise.all([
                    spaService.getSpaInfo(),
                    spaServiceService.getAllSpaServices(),
                    spaImageService.getAllSpaImages(),
                ]);

                setSpaInfo(infoData);
                setServices(servicesData.services || []);
                setImages(imagesData.images || []);
            } catch (error) {
                console.error('Error fetching spa data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSpaData();
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
            <SpaHero onBookingClick={handleBookingClick} />
            <ServiceIntroduction 
                information={spaInfo?.information || ''} 
                images={images.slice(0, 2)}
            />
            <ServicesSlider 
                services={services}
                onBookingClick={handleBookingClick} 
            />
            <SpaGallery images={images} />
            <BookingModal isOpen={isBookingModalOpen} onClose={handleCloseModal} />
        </div>
    );
};

export default Spa;
