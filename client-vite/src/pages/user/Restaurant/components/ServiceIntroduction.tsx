import React from 'react';
import { Typography, Row, Col, Card } from 'antd';
import { RestaurantImage } from '@/types/restaurant';

const { Title } = Typography;

interface ServiceIntroductionProps {
    information: string;
    images: RestaurantImage[];
}

const ServiceIntroduction: React.FC<ServiceIntroductionProps> = ({ information, images }) => {
    return (
        <section className="py-16 px-4 max-w-7xl mx-auto">
            <Row gutter={[48, 32]} align="middle">
                <Col xs={24} lg={12}>
                    <div className="space-y-6">
                        <Title level={2} className="!text-4xl !font-bold !mb-8" style={{ fontFamily: 'Playfair Display, serif', color: '#333' }}>
                            THÔNG TIN DỊCH VỤ
                        </Title>
                        
                        <div className="text-gray-600 text-base leading-relaxed whitespace-pre-line">
                            {information || 'Thông tin nhà hàng đang được cập nhật...'}
                        </div>
                    </div>
                </Col>
                
                <Col xs={24} lg={12}>
                    <Row gutter={[16, 16]}>
                        {images.length > 0 && (
                            <>
                                <Col span={12}>
                                    <Card 
                                        cover={
                                            <img 
                                                src={images[0]?.imagePath || '/images/default-image.jpg'} 
                                                alt={images[0]?.title || 'Restaurant Image'} 
                                                className="h-48 object-cover"
                                            />
                                        }
                                        className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                                        bodyStyle={{ padding: 0 }}
                                    />
                                </Col>
                                {images.length > 1 && (
                                    <Col span={12}>
                                        <Card 
                                            cover={
                                                <img 
                                                    src={images[1]?.imagePath || '/images/default-image.jpg'} 
                                                    alt={images[1]?.title || 'Restaurant Image'} 
                                                    className="h-48 object-cover"
                                                />
                                            }
                                            className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                                            bodyStyle={{ padding: 0 }}
                                        />
                                    </Col>
                                )}
                            </>
                        )}
                    </Row>
                </Col>
            </Row>
        </section>
    );
};

export default ServiceIntroduction;