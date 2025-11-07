import React, { useState, useEffect, useRef } from 'react';

interface ImageSliderProps {
    images: string[];
    interval?: number;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, interval = 3000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const autoSlideTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-slide effect
    useEffect(() => {
        const startAutoSlide = () => {
            autoSlideTimerRef.current = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % images.length);
            }, interval);
        };

        startAutoSlide();

        return () => {
            if (autoSlideTimerRef.current) {
                clearInterval(autoSlideTimerRef.current);
            }
        };
    }, [images.length, interval]);

    return (
        <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat overflow-hidden"
            style={{
                backgroundImage: `url('${images[currentIndex]}')`,
                transition: 'background-image 0.5s ease-in-out',
            }}
        >
        </div>
    );
};

export default ImageSlider;
