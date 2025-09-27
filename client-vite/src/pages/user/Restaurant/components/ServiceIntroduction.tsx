import React from 'react';
import { Typography, Row, Col, Card } from 'antd';

const { Title, Paragraph, Text } = Typography;

const ServiceIntroduction: React.FC = () => {
    const services = [
        'BUFFET sáng đa dạng từ 06h00-10h00',
        'Thực đơn à la carte với hơn 100 món',
        'Bar trang & cocktail cao cấp',
        'Set tiệc đầy đủ theo yêu cầu'
    ];

    return (
        <section className="py-16 px-4 max-w-7xl mx-auto">
            <Row gutter={[48, 32]} align="middle">
                <Col xs={24} lg={12}>
                    <div className="space-y-6">
                        <Title level={2} className="!text-4xl !font-bold !mb-8" style={{ fontFamily: 'Playfair Display, serif', color: '#333' }}>
                            SERVICE INTRODUCTION
                        </Title>
                        
                        <Paragraph className="text-gray-600 text-base leading-relaxed">
                            Khám phá sự quyến rũ của ẩm thực cao cấp tại nhà hàng của chúng tôi, 
                            nơi hương vị tinh tế được kết hợp hoàn hảo với không gian sang trọng. 
                            Chúng tôi tự hào mang đến cho bạn những món ăn đậm đà hương vị 
                            và thức uống tuyệt vời trong không gian ấm áp và lịch sự.
                        </Paragraph>
                        
                        <Paragraph className="text-gray-600 text-base leading-relaxed">
                            Nhà hàng của chúng tôi cung cấp trải nghiệm ẩm thực đa dạng, 
                            từ những món ăn truyền thống Việt Nam đến những sáng tạo hiện đại. 
                            Mỗi món ăn đều được chế biến từ những nguyên liệu tươi ngon 
                            nhất và được trình bày một cách nghệ thuật.
                        </Paragraph>
                        
                        <Text strong className="block text-gray-800 text-base mb-4">
                            Các dịch vụ nổi bật của chúng tôi:
                        </Text>
                        
                        <ul className="space-y-2">
                            {services.map((service, index) => (
                                <li key={index} className="flex items-start text-gray-600">
                                    <span className="text-[#D4902A] font-bold mr-3 mt-1">•</span>
                                    <span>{service}</span>
                                </li>
                            ))}
                        </ul>
                        
                        <div className="space-y-4 pt-4">
                            <Paragraph className="text-gray-600 text-base leading-relaxed">
                                <Text strong>Giờ phục vụ:</Text> Từ 06h00 đến 23h00 hàng ngày với đội ngũ phục vụ 
                                chuyên nghiệp. Đặt bàn trước để có trải nghiệm tốt nhất trong không gian 
                                hợp rượu và các món ăn với nhiều hương vị khác nhau.
                            </Paragraph>
                            
                            <Paragraph className="text-gray-600 text-base leading-relaxed">
                                <Text strong>Giá tham khảo:</Text> Từ 450.000đ đến hơn 2.000.000đ cho một 
                                bữa tiệc hoàn hảo. Chúng tôi cam kết mang đến cho khách hàng cảm giác 
                                ấm áp và sang trọng qua từng khoảnh khắc.
                            </Paragraph>
                        </div>
                    </div>
                </Col>
                
                <Col xs={24} lg={12}>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Card 
                                cover={
                                    <img 
                                        src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                                        alt="Restaurant interior" 
                                        className="h-48 object-cover"
                                    />
                                }
                                className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                                bodyStyle={{ padding: 0 }}
                            />
                        </Col>
                        <Col span={12}>
                            <Card 
                                cover={
                                    <img 
                                        src="https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                                        alt="Fine dining" 
                                        className="h-48 object-cover"
                                    />
                                }
                                className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                                bodyStyle={{ padding: 0 }}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </section>
    );
};

export default ServiceIntroduction;