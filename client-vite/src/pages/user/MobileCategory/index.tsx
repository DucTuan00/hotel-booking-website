import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, TYPOGRAPHY } from '@/config/constants';

const MobileCategory: React.FC = () => {
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Giới thiệu', path: '/#about', icon: '/images/information.png' },
        { name: 'Phòng', path: '/rooms', icon: '/images/bed.png' },
        { name: 'Nhà hàng & Sky Bar', path: '/restaurant', icon: '/images/restaurant.png' },
        { name: 'Spa & Tắm bià', path: '/spa', icon: '/images/massage.png' },
        { name: 'AI Planner', path: '/ai-planner', icon: '/images/ai.png' },
        { name: 'Liên hệ', path: '/#contact', icon: '/images/contact-mail.png' },
    ];

    const handleNavigation = (path: string) => {
        if (path.startsWith('/#')) {
            navigate('/');
            setTimeout(() => {
                const element = document.querySelector(path.substring(1));
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else {
            navigate(path);
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundColor: '#F8F9FA',
                padding: '20px 16px 85px',
            }}
        >
            {/* Title */}
            <p
                style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    fontFamily: TYPOGRAPHY.fontFamily.primary,
                    color: COLORS.gray[800],
                    marginBottom: '24px',
                    marginTop: 0,
                }}
            >
                Danh mục
            </p>

            {/* Grid 2 columns */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                }}
            >
                {menuItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => handleNavigation(item.path)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '24px 12px',
                            backgroundColor: '#fff',
                            border: `2px solid ${COLORS.gray[200]}`,
                            borderRadius: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            maxHeight: '100px',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
                            e.currentTarget.style.borderColor = COLORS.primary;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                            e.currentTarget.style.borderColor = COLORS.gray[200];
                        }}
                    >
                        {/* Icon with background */}
                        <div
                            style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '2px',
                                fontSize: '28px',
                            }}
                        >
                            <img
                                src={item.icon}
                                alt={item.name}
                                style={{
                                    width: 'auto',
                                    height: 'auto',
                                    maxWidth: '40px',
                                    maxHeight: '40px',
                                    objectFit: 'contain',
                                }}
                            />
                        </div>

                        {/* Name */}
                        <span
                            style={{
                                fontSize: '14px',
                                fontWeight: 600,
                                fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                color: COLORS.gray[700],
                                textAlign: 'center',
                                lineHeight: '1.3',
                            }}
                        >
                            {item.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MobileCategory;
