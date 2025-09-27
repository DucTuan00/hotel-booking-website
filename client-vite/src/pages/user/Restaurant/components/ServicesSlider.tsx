import React, { useRef } from 'react';
import { Typography, Card, Button, Carousel } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { CarouselRef } from 'antd/es/carousel';

const { Title, Paragraph, Text } = Typography;

interface Service {
    id: number;
    title: string;
    description: string;
    price: string;
    image: string;
}

const services: Service[] = [
    {
        id: 1,
        title: 'Cocktail Daiquiri',
        description: 'Thưởng thức sự tươi mát và sự cân bằng hoàn hảo của cocktail Daiquiri được pha chế tài tình. Sự kết hợp hài hòa giữa rum trắng, nước cốt chanh tươi và đường tạo nên hương vị sảng khoái và thanh mát.',
        price: 'Liên hệ',
        image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
        id: 2,
        title: 'Cocktail Manhattan',
        description: 'Với sự hoàn hảo của Manhattan được phục vụ trong ly cocktail chuyên dụng. Sự pha trộn tinh tế giữa whiskey rye, vermouth đỏ và một ít bitter tạo nên hương vị mạnh mẽ và phức tạp.',
        price: 'Liên hệ',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
        id: 3,
        title: 'Cocktail Espresso Martini',
        description: 'Espresso Martini cocktail là sự pha trộn hoàn hảo giữa cà phê espresso mạnh, vodka chất lượng cao và liqueur cà phê. Được phục vụ trong ly martini lạnh với lớp bọt mịn trên bề mặt.',
        price: 'Liên hệ',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
        id: 4,
        title: 'Cocktail Mojito',
        description: 'Mojito tươi mát với sự kết hợp hoàn hảo giữa rum trắng, lá mint tươi, đường, nước cốt chanh và soda. Hương vị nhẹ nhàng, sảng khoái và đầy sức sống.',
        price: 'Liên hệ',
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
        id: 5,
        title: 'Cocktail Old Fashioned',
        description: 'Old Fashioned cổ điển với whiskey bourbon cao cấp, đường, angostura bitters và vỏ cam. Được phục vụ với đá lớn và trang trí bằng vỏ cam tươi.',
        price: 'Liên hệ',
        image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
];

const ServicesSlider: React.FC<{ onBookingClick: () => void }> = ({ onBookingClick }) => {
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
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
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
                
                <div className="relative">
                    <Carousel {...carouselSettings} ref={carouselRef}>
                        {services.map(service => (
                            <div key={service.id} className="px-3">
                                <Card
                                    cover={
                                        <div className="h-48 overflow-hidden">
                                            <img 
                                                src={service.image} 
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
                                        {service.description}
                                    </Paragraph>
                                    <Text strong className="text-[#D4902A] text-base">
                                        Giá: {service.price}
                                    </Text>
                                </Card>
                            </div>
                        ))}
                    </Carousel>
                    
                    {/* Custom Navigation Buttons - Positioned outside carousel */}
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
            </div>
        </section>
    );
};

export default ServicesSlider;