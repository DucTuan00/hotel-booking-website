import React from 'react';
import { EnvironmentOutlined, PhoneOutlined, MailOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { COLORS, TYPOGRAPHY } from '@/config/constants';

const Contact: React.FC = () => {
    const contactInfo = [
        {
            icon: <EnvironmentOutlined />,
            title: 'Địa chỉ',
            content: '105 P. Nguyễn Văn Tố, Hoàn Kiếm, Hà Nội, Việt Nam'
        },
        {
            icon: <PhoneOutlined />,
            title: 'Điện thoại',
            content: '(+84) 987654321'
        },
        {
            icon: <MailOutlined />,
            title: 'Email',
            content: 'admin@lionhotel.com'
        },
        {
            icon: <ClockCircleOutlined />,
            title: 'Giờ làm việc',
            content: 'Thứ 2 - Chủ Nhật: 24/7'
        }
    ];

    return (
        <div className="contact-page bg-gray-50">
            {/* Header Section */}
            <section className="py-16 sm:py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <span 
                        className="block text-sm font-bold tracking-[0.3em] uppercase mb-4"
                        style={{ 
                            fontFamily: TYPOGRAPHY.fontFamily.secondary,
                            color: COLORS.primary
                        }}
                    >
                        Get In Touch
                    </span>
                    <h1 
                        className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
                        style={{ 
                            fontFamily: TYPOGRAPHY.fontFamily.primary,
                            color: COLORS.gray[900]
                        }}
                    >
                        LIÊN HỆ CHÚNG TÔI
                    </h1>
                    <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: COLORS.primary }}></div>
                    <p 
                        className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed text-gray-700"
                        style={{ 
                            fontFamily: TYPOGRAPHY.fontFamily.secondary
                        }}
                    >
                        Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
                    </p>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((item, index) => (
                            <div 
                                key={index}
                                className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
                            >
                                <div 
                                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                                    style={{ backgroundColor: `${COLORS.primary}20` }}
                                >
                                    <span 
                                        className="text-2xl"
                                        style={{ color: COLORS.primary }}
                                    >
                                        {item.icon}
                                    </span>
                                </div>
                                <p 
                                    className="text-lg font-semibold text-center !mb-2"
                                    style={{ 
                                        fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                        color: COLORS.gray[900]
                                    }}
                                >
                                    {item.title}
                                </p>
                                <p 
                                    className="text-sm text-gray-700 text-center leading-relaxed"
                                    style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
                                >
                                    {item.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-12 sm:py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h2 
                            className="text-3xl sm:text-4xl font-bold mb-4"
                            style={{ 
                                fontFamily: TYPOGRAPHY.fontFamily.primary,
                                color: COLORS.gray[900]
                            }}
                        >
                            VỊ TRÍ KHÁCH SẠN
                        </h2>
                        <div className="w-24 h-1 mx-auto" style={{ backgroundColor: COLORS.primary }}></div>
                    </div>

                    <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14896.08017375022!2d105.846336!3d21.031884!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab47c98c2919%3A0xa0d1de04eb7d5313!2sHanoi%20Lion%20Boutique%20Hotel%20%26%20Spa!5e0!3m2!1svi!2sus!4v1761245560624!5m2!1svi!2sus" 
                            width="100%" 
                            height="500"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            title="Lion Hotel Boutique - Bản đồ"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;