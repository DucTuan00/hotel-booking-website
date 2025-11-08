import React, { useState } from 'react';
import { Row, Col, Empty } from 'antd';
import { SpaImage } from '@/types/spa';

interface SpaGalleryProps {
    images: SpaImage[];
}

const SpaGallery: React.FC<SpaGalleryProps> = ({ images }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const handleThumbnailClick = (index: number) => {
        setSelectedImageIndex(index);
    };

    if (images.length === 0) {
        return (
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <Empty description="Chưa có ảnh nào" />
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
                <Row gutter={[24, 24]}>
                    {/* Main Image */}
                    <Col xs={24} lg={18}>
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <img 
                                src={images[selectedImageIndex]?.imagePath} 
                                alt={images[selectedImageIndex]?.title || `Spa view ${selectedImageIndex + 1}`}
                                className="w-full h-[400px] md:h-[500px] object-cover transition-all duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                        </div>
                    </Col>
                    
                    {/* Thumbnail Images */}
                    <Col xs={24} lg={6}>
                        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                            {images.map((image, index) => (
                                <div
                                    key={image.id}
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
                                        src={image.imagePath} 
                                        alt={image.title || `Spa thumbnail ${index + 1}`}
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

export default SpaGallery;
