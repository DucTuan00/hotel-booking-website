import React, { useState } from 'react';
import { Button, Drawer, Layout } from 'antd';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { COLORS, TYPOGRAPHY } from '@/config/constants';

const { Header: AntHeader } = Layout;

interface HeaderProps {
    transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({ transparent = false }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const menuItems = [
        { name: 'GIỚI THIỆU', path: '/#about' },
        { name: 'PHÒNG', path: '/rooms' },
        { name: 'NHÀ HÀNG', path: '/restaurant' },
        { name: 'SPA', path: '/spa' },
        { name: 'AI PLANNER', path: '/#' },
        { name: 'LIÊN HỆ', path: '/#contact' },
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
        setMobileMenuOpen(false);
    };

    return (
        <>
            <AntHeader
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 50,
                    width: "100%",
                    alignItems: "center",
                    background: "#fff",
                    borderBottom: "1px solid #f0f0f0",
                }}
            >
                <div className="max-w-7xl mx-auto px-3 sm:px-4 h-full flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div
                            className="text-lg sm:text-xl lg:text-2xl font-bold"
                            style={{
                                fontFamily: TYPOGRAPHY.fontFamily.primary,
                                color: transparent
                                    ? COLORS.white
                                    : COLORS.primary,
                            }}
                        >
                            LION
                        </div>
                    </div>

                    {/* Desktop Navigation - Hidden on mobile */}
                    <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                        {menuItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleNavigation(item.path)}
                                className="text-sm font-medium hover:opacity-75 transition-opacity whitespace-nowrap bg-transparent border-none cursor-pointer px-2"
                                style={{
                                    color: transparent
                                        ? COLORS.white
                                        : COLORS.gray[700],
                                    fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                }}
                            >
                                {item.name}
                            </button>
                        ))}
                    </nav>

                    {/* Right Side - Language, Booking Button, Mobile Menu */}
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        {/* Desktop Booking Button */}
                        <Button
                            type="primary"
                            size="small"
                            className="hidden sm:block text-xs lg:text-sm px-3 lg:px-4 h-8 lg:h-10"
                            onClick={() => handleNavigation('/login')}
                            style={{
                                backgroundColor: COLORS.primary,
                                borderColor: COLORS.primary,
                                fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                fontWeight: TYPOGRAPHY.fontWeight.medium,
                            }}
                        >
                            ĐĂNG NHẬP
                        </Button>

                        {/* Mobile Menu Button */}
                        <div className="block lg:hidden">
                            <Button
                                type="text"
                                icon={<MenuOutlined />}
                                onClick={() => setMobileMenuOpen(true)}
                                className="p-1"
                                style={{
                                    color: transparent
                                        ? COLORS.white
                                        : COLORS.gray[700],
                                    border: "none",
                                    boxShadow: "none",
                                }}
                            />
                        </div>
                    </div>
                </div>
            </AntHeader>

            {/* Mobile Drawer Menu */}
            <Drawer
                title={
                    <div
                        className="text-xl font-bold"
                        style={{
                            fontFamily: TYPOGRAPHY.fontFamily.primary,
                            color: COLORS.primary,
                        }}
                    >
                        LION
                    </div>
                }
                placement="right"
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
                closeIcon={<CloseOutlined />}
                width={280}
                styles={{
                    body: { padding: 0 },
                    header: {
                        borderBottom: `1px solid ${COLORS.gray[200]}`,
                        background: "white",
                    },
                }}
            >
                <div className="flex flex-col h-full">
                    {/* Menu Items */}
                    <nav className="flex-1 py-4">
                        {menuItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleNavigation(item.path)}
                                className="block w-full text-left px-6 py-4 text-base font-medium hover:bg-gray-50 transition-colors border-b border-gray-100 bg-transparent border-none"
                                style={{
                                    color: COLORS.gray[700],
                                    fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                }}
                            >
                                {item.name}
                            </button>
                        ))}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="p-6 border-t border-gray-200 bg-gray-50">
                        <Button
                            type="primary"
                            size="large"
                            block
                            className="mb-4"
                            style={{
                                backgroundColor: COLORS.primary,
                                borderColor: COLORS.primary,
                                fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                fontWeight: TYPOGRAPHY.fontWeight.semibold,
                                height: "48px",
                            }}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            ĐẶT PHÒNG NGAY
                        </Button>

                        <div className="flex justify-center space-x-4 text-sm text-gray-500">
                            <span>Hotline: 0258.3834.666</span>
                        </div>
                    </div>
                </div>
            </Drawer>
        </>
    );
};

export default Header;
