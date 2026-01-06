import React from 'react';
import { Button } from 'antd';
import { AimOutlined, BulbOutlined, CrownOutlined, HeartOutlined, RocketOutlined } from '@ant-design/icons';
import { COLORS, TYPOGRAPHY } from '@/config/constants';

const Introduction: React.FC = () => {

    const stats = [
        { value: '5+', label: 'Năm kinh nghiệm' },
        { value: '500+', label: 'Khách hàng hài lòng' },
        { value: '40+', label: 'Phòng sang trọng' },
        { value: '24/7', label: 'Dịch vụ tận tâm' },
    ];

    return (
        <div className="introduction-page">
            {/* Hero Section */}
            <section className="py-16 sm:py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <span 
                        className="block text-sm font-bold tracking-[0.3em] uppercase mb-4"
                        style={{ 
                            fontFamily: TYPOGRAPHY.fontFamily.secondary,
                            color: COLORS.primary
                        }}
                    >
                        Welcome to Lion Hotel
                    </span>
                    <h1 
                        className="text-4xl sm:text-5xl md:text-5xl font-bold mb-6"
                        style={{ 
                            fontFamily: TYPOGRAPHY.fontFamily.primary,
                            color: COLORS.gray[900]
                        }}
                    >
                        GIỚI THIỆU VỀ CHÚNG TÔI
                    </h1>
                    <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: COLORS.primary }}></div>
                    <p 
                        className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed text-gray-700"
                        style={{ 
                            fontFamily: TYPOGRAPHY.fontFamily.secondary
                        }}
                    >
                        Khám phá trải nghiệm sang trọng giữa lòng Hà Nội cổ kính
                    </p>
                </div>
            </section>

            {/* About Section */}
            <section className="py-16 sm:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Content */}
                        <div>
                            <span 
                                className="block text-sm font-bold tracking-[0.2em] uppercase mb-3"
                                style={{ 
                                    fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                    color: COLORS.primary
                                }}
                            >
                                About Us
                            </span>
                            <h2 
                                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
                                style={{ 
                                    fontFamily: TYPOGRAPHY.fontFamily.primary,
                                    color: COLORS.gray[900]
                                }}
                            >
                                LION BOUTIQUE HOTEL & SPA
                            </h2>
                            <div className="w-16 h-1 mb-6" style={{ backgroundColor: COLORS.primary }}></div>
                            
                            <div className="space-y-4 text-gray-700 leading-relaxed" style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}>
                                <p className="text-base sm:text-md">
                                    Lion Boutique Hotel & Spa là một trong những khách sạn boutique hàng đầu tại Hà Nội, 
                                    mang đến cho bạn trải nghiệm lưu trú đẳng cấp với thiết kế tinh tế và dịch vụ chu đáo.
                                </p>
                                <p className="text-base sm:text-md">
                                    Tọa lạc tại vị trí đắc địa trong khu du lịch nổi tiếng của thủ đô, khách sạn chúng tôi 
                                    kết hợp hoàn hảo giữa nét đẹp truyền thống và hiện đại, tạo nên một không gian nghỉ dưỡng 
                                    lý tưởng cho mọi du khách.
                                </p>
                                <p className="text-base sm:text-md">
                                    Với hơn 5 năm kinh nghiệm trong ngành khách sạn, chúng tôi tự hào mang đến những 
                                    phòng nghỉ sang trọng, nhà hàng đẳng cấp, spa thư giãn và dịch vụ 24/7 luôn sẵn sàng 
                                    phục vụ nhu cầu của bạn.
                                </p>
                            </div>

                            <Button
                                size="large"
                                className="mt-8"
                                style={{
                                    backgroundColor: COLORS.primary,
                                    borderColor: COLORS.primary,
                                    color: COLORS.white,
                                    fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                    fontWeight: 600,
                                    height: 'auto',
                                    padding: '12px 32px',
                                    fontSize: '16px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = COLORS.gray[900];
                                    e.currentTarget.style.borderColor = COLORS.gray[900];
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = COLORS.primary;
                                    e.currentTarget.style.borderColor = COLORS.primary;
                                }}
                                onClick={() => window.location.href = '/rooms'}
                            >
                                Khám phá phòng
                            </Button>
                        </div>

                        {/* Single Image */}
                        <div className="flex justify-center">
                            <div className="overflow-hidden rounded-lg shadow-lg max-w-md w-full">
                                <img 
                                    src="/images/home4.jpg" 
                                    alt="Lion Boutique Hotel"
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-16 sm:py-20 relative overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('/images/home8.jpg')`,
                    }}
                />
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div 
                                key={index}
                                className="text-center"
                            >
                                <p 
                                    className="text-4xl sm:text-4xl md:text-4xl font-bold !mb-3"
                                    style={{ 
                                        fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                        color: COLORS.primary
                                    }}
                                >
                                    {stat.value}
                                </p>
                                <p 
                                    className="text-white text-sm sm:text-base uppercase tracking-wider"
                                    style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
                                >
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-16 sm:py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 
                            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
                            style={{ 
                                fontFamily: TYPOGRAPHY.fontFamily.primary,
                                color: COLORS.gray[900]
                            }}
                        >
                            SỨ MỆNH & TẦM NHÌN
                        </h2>
                        <div className="w-24 h-1 mx-auto" style={{ backgroundColor: COLORS.primary }}></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Mission */}
                        <div className="bg-white p-8 rounded-lg border border-gray-200">
                            <div className="flex items-center mb-6">
                                <div 
                                    className="w-16 h-16 rounded-full flex items-center justify-center mr-4"
                                    style={{ backgroundColor: `${COLORS.primary}20` }}
                                >
                                    <AimOutlined 
                                        className="text-3xl"
                                        style={{ color: COLORS.primary }}
                                    />
                                </div>
                                <p 
                                    className="text-2xl font-semibold !mb-0"
                                    style={{ 
                                        fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                        color: COLORS.gray[900]
                                    }}
                                >
                                    SỨ MỆNH
                                </p>
                            </div>
                            <p 
                                className="text-gray-700 leading-relaxed text-base"
                                style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
                            >
                                Mang đến cho mỗi vị khách trải nghiệm lưu trú đẳng cấp và những kỷ niệm khó quên 
                                thông qua dịch vụ xuất sắc, không gian sang trọng và sự chăm sóc tận tâm. Chúng tôi 
                                cam kết tạo ra một ngôi nhà xa nhà, nơi mọi nhu cầu đều được đáp ứng vượt mong đợi.
                            </p>
                        </div>

                        {/* Vision */}
                        <div className="bg-white p-8 rounded-lg border border-gray-200">
                            <div className="flex items-center mb-6">
                                <div 
                                    className="w-16 h-16 rounded-full flex items-center justify-center mr-4"
                                    style={{ backgroundColor: `${COLORS.primary}20` }}
                                >
                                    <BulbOutlined 
                                        className="text-3xl"
                                        style={{ color: COLORS.primary }}
                                    />
                                </div>
                                <p 
                                    className="text-2xl font-semibold !mb-0"
                                    style={{ 
                                        fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                        color: COLORS.gray[900]
                                    }}
                                >
                                    TẦM NHÌN
                                </p>
                            </div>
                            <p 
                                className="text-gray-700 leading-relaxed text-base"
                                style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
                            >
                                Trở thành chuỗi khách sạn boutique hàng đầu Việt Nam, được biết đến với tiêu chuẩn 
                                dịch vụ quốc tế, thiết kế độc đáo và trải nghiệm khách hàng xuất sắc. Chúng tôi 
                                hướng tới việc mở rộng mạng lưới khách sạn tại các điểm đến du lịch hấp dẫn nhất Việt Nam.
                            </p>
                        </div>
                    </div>

                    {/* Core Values */}
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { Icon: CrownOutlined, title: 'Chất Lượng', desc: 'Cam kết chất lượng dịch vụ và tiện nghi cao cấp' },
                            { Icon: HeartOutlined, title: 'Tận Tâm', desc: 'Phục vụ từ trái tim với sự chân thành và nhiệt huyết' },
                            { Icon: RocketOutlined, title: 'Đổi Mới', desc: 'Không ngừng cải tiến để mang đến trải nghiệm tốt nhất' },
                        ].map((value, index) => (
                            <div key={index} className="text-center p-6 bg-white rounded-lg border border-gray-200">
                                <div 
                                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                                    style={{ backgroundColor: `${COLORS.primary}20` }}
                                >
                                    <value.Icon 
                                        className="text-3xl"
                                        style={{ color: COLORS.primary }}
                                    />
                                </div>
                                <p 
                                    className="text-xl font-semibold !mb-2"
                                    style={{ 
                                        fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                        color: COLORS.gray[900]
                                    }}
                                >
                                    {value.title}
                                </p>
                                <p 
                                    className="text-gray-600 text-sm"
                                    style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
                                >
                                    {value.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 
                        className="text-3xl sm:text-4xl font-bold mb-4"
                        style={{ 
                            fontFamily: TYPOGRAPHY.fontFamily.primary,
                            color: COLORS.gray[900]
                        }}
                    >
                        SẴN SÀNG TRẢI NGHIỆM?
                    </h2>
                    <p 
                        className="text-lg text-gray-600 mb-8"
                        style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
                    >
                        Đặt phòng ngay hôm nay để nhận ưu đãi đặc biệt
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="large"
                            style={{
                                backgroundColor: COLORS.primary,
                                borderColor: COLORS.primary,
                                color: COLORS.white,
                                fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                fontWeight: 600,
                                height: 'auto',
                                padding: '14px 36px',
                                fontSize: '16px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = COLORS.gray[900];
                                e.currentTarget.style.borderColor = COLORS.gray[900];
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = COLORS.primary;
                                e.currentTarget.style.borderColor = COLORS.primary;
                            }}
                            onClick={() => window.location.href = '/rooms'}
                        >
                            Đặt phòng ngay
                        </Button>
                        <Button
                            size="large"
                            style={{
                                backgroundColor: COLORS.white,
                                borderColor: COLORS.gray[900],
                                borderWidth: '2px',
                                color: COLORS.gray[900],
                                fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                fontWeight: 600,
                                height: 'auto',
                                padding: '14px 36px',
                                fontSize: '16px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = COLORS.gray[900];
                                e.currentTarget.style.color = COLORS.white;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = COLORS.white;
                                e.currentTarget.style.color = COLORS.gray[900];
                            }}
                            onClick={() => {
                                const contactSection = document.querySelector('#contact');
                                if (contactSection) {
                                    contactSection.scrollIntoView({ behavior: 'smooth' });
                                } else {
                                    window.location.href = '/#contact';
                                }
                            }}
                        >
                            Liên hệ chúng tôi
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Introduction;