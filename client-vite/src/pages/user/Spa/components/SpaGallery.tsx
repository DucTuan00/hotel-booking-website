import React, { useState } from 'react';
import { Empty, Typography } from 'antd';
import { SpaImage } from '@/types/spa';

const { Title } = Typography;

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
                <div className="max-w-5xl mx-auto">
                    <Empty description="Chưa có ảnh nào" />
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 px-4">
            <div className="max-w-5xl mx-auto">
                <Title 
                    level={2} 
                    className="text-center !text-4xl !font-bold !mb-12" 
                    style={{ fontFamily: 'Playfair Display, serif', color: '#333' }}
                >
                    HÌNH ẢNH
                </Title>
                {/* Main Image */}
                <div className="relative rounded-2xl overflow-hidden mb-4">
                    <img 
                        src={images[selectedImageIndex]?.imagePath} 
                        alt={images[selectedImageIndex]?.title || `Spa view ${selectedImageIndex + 1}`}
                        className="!w-full h-[400px] md:h-[500px] !object-cover transition-all duration-500"
                    />
                </div>
                
                {/* Thumbnail Images - Horizontal scroll */}
                <div className="overflow-x-auto pb-2 px-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <div className="flex gap-3 w-fit mx-auto">
                    {images.map((image, index) => (
                        <div
                            key={image.id}
                            onClick={() => handleThumbnailClick(index)}
                            className={`
                                relative flex-shrink-0 cursor-pointer rounded-lg overflow-hidden transition-all duration-300 border-2
                                ${selectedImageIndex === index 
                                    ? 'border-[#D4902A]' 
                                    : 'border-transparent hover:shadow-md'
                                }
                            `}
                        >
                            <img 
                                src={image.imagePath} 
                                alt={image.title || `Spa thumbnail ${index + 1}`}
                                className="!w-24 !h-16 md:!w-32 md:!h-20 !object-cover"
                            />
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SpaGallery;
