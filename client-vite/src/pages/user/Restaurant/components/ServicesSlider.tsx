import React, { useRef } from 'react';
import { Typography, Card, Button, Carousel, Empty } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { CarouselRef } from 'antd/es/carousel';
import { RestaurantService } from '@/types/restaurant';
import { formatPrice } from '@/utils/formatPrice';

const { Title, Paragraph, Text } = Typography;

interface ServicesSliderProps {
    services: RestaurantService[];
    onBookingClick: () => void;
}

const ServicesSlider: React.FC<ServicesSliderProps> = ({ services, onBookingClick }) => {
    const carouselRef = useRef<CarouselRef>(null);

    const goToPrevious = () => {
        carouselRef.current?.prev();
    };

    const goToNext = () => {
        carouselRef.current?.next();
    };

    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: Math.min(3, services.length),
        slidesToScroll: 1,
        autoplay: services.length > 0,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: Math.min(2, services.length),
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <Title 
                    level={2} 
                    className="text-center !text-4xl !font-bold !mb-12" 
                    style={{ fontFamily: 'Playfair Display, serif', color: '#333' }}
                >
                    DỊCH VỤ
                </Title>
                
                {services.length === 0 ? (
                    <Empty 
                        description="Chưa có dịch vụ nào" 
                        className="my-12"
                    />
                ) : (
                    <>
                        <div className="relative">
                            <Carousel {...carouselSettings} ref={carouselRef}>
                                {services.map(service => (
                                    <div key={service.id} className="px-3">
                                        <Card
                                            cover={
                                                <div className="h-48 overflow-hidden">
                                                    <img 
                                                        src={service.imagePath || '/images/default-image.jpg'} 
                                                        alt={service.title}
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                            }
                                            className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300"
                                            bodyStyle={{ height: '200px', display: 'flex', flexDirection: 'column' }}
                                        >
                                            <Title level={4} className="!mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                                                {service.title}
                                            </Title>
                                            <Paragraph 
                                                className="text-gray-600 text-sm leading-relaxed flex-1" 
                                                ellipsis={{ rows: 3, expandable: false }}
                                            >
                                                {service.description || 'Không có mô tả'}
                                            </Paragraph>
                                            <Text strong className="text-[#D4902A] text-base">
                                                Giá: {service.price ? formatPrice(service.price) : 'Liên hệ'}
                                            </Text>
                                        </Card>
                                    </div>
                                ))}
                            </Carousel>
                            
                            {/* Custom Navigation Buttons - Positioned outside carousel */}
                            {services.length > 1 && (
                                <div className="flex justify-between items-center mt-8">
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        size="large"
                                        icon={<LeftOutlined />}
                                        onClick={goToPrevious}
                                        className="bg-[#D4902A] hover:bg-[#B8761E] border-[#D4902A] hover:border-[#B8761E] shadow-lg"
                                    />
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        size="large"
                                        icon={<RightOutlined />}
                                        onClick={goToNext}
                                        className="bg-[#D4902A] hover:bg-[#B8761E] border-[#D4902A] hover:border-[#B8761E] shadow-lg"
                                    />
                                </div>
                            )}
                        </div>
                        
                        <div className="text-center mt-12">
                            <Button 
                                type="primary"
                                size="large"
                                onClick={onBookingClick}
                                className="bg-[#D4902A] hover:bg-[#B8761E] border-[#D4902A] hover:border-[#B8761E] font-semibold px-8 py-6 h-auto uppercase tracking-wider"
                            >
                                ĐẶT NGAY
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default ServicesSlider;