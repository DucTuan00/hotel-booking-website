import React, { useState } from 'react';
import { Row, Col } from 'antd';

const restaurantImages = [
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
];

const RestaurantGallery: React.FC = () => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const handleThumbnailClick = (index: number) => {
        setSelectedImageIndex(index);
    };

    return (
        <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
                <Row gutter={[24, 24]}>
                    {/* Main Image */}
                    <Col xs={24} lg={18}>
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <img 
                                src={restaurantImages[selectedImageIndex]} 
                                alt={`Restaurant view ${selectedImageIndex + 1}`}
                                className="w-full h-[400px] md:h-[500px] object-cover transition-all duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                        </div>
                    </Col>
                    
                    {/* Thumbnail Images */}
                    <Col xs={24} lg={6}>
                        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                            {restaurantImages.map((image, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleThumbnailClick(index)}
                                    className={`
                                        relative flex-shrink-0 cursor-pointer rounded-lg overflow-hidden transition-all duration-300 border-2
                                        ${selectedImageIndex === index 
                                            ? 'border-[#D4902A] shadow-lg scale-105' 
                                            : 'border-transparent hover:border-gray-300 hover:shadow-md'
                                        }
                                    `}
                                >
                                    <img 
                                        src={image} 
                                        alt={`Restaurant thumbnail ${index + 1}`}
                                        className="w-20 h-16 md:w-24 md:h-20 lg:w-full lg:h-20 object-cover"
                                    />
                                    {/* Active overlay */}
                                    {selectedImageIndex === index && (
                                        <div className="absolute inset-0 bg-[#D4902A]/20" />
                                    )}
                                    {/* Hover overlay */}
                                    <div className={`
                                        absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-300
                                        ${selectedImageIndex !== index ? 'hover:bg-black/20' : ''}
                                    `} />
                                </div>
                            ))}
                        </div>
                    </Col>
                </Row>
            </div>
        </section>
    );
};

export default RestaurantGallery;