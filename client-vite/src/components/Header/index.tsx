import React, { useState, useEffect, useCallback } from 'react';
import { Button, Drawer, Layout, Dropdown, Avatar } from 'antd';
import { MenuOutlined, CloseOutlined, UserOutlined, LogoutOutlined, DownOutlined, UnorderedListOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { COLORS, TYPOGRAPHY } from '@/config/constants';
import userService from '@/services/users/userService';
import authService from '@/services/auth/authService';
import { User } from '@/types/user';
import Notification from '@/components/Notification';

const { Header: AntHeader } = Layout;

interface HeaderProps {
    transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({ transparent = false }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { name: 'Giới thiệu', path: '/introduction' },
        { name: 'Phòng', path: '/rooms' },
        { name: 'Nhà hàng', path: '/restaurant' },
        { name: 'Spa', path: '/spa' },
        { name: 'AI planner', path: '/ai-planner' },
        { name: 'Liên hệ', path: '/contact' },
    ];

    const fetchUserInfo = useCallback(async () => {
        try {
            // This will work for both web (cookies sent automatically) and mobile (Authorization header)
            const user = await userService.getUserInfo();
            setCurrentUser(user);
        } catch {
            // Token invalid, expired, or no token at all
            setCurrentUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Fetch user info on mount
        fetchUserInfo();
    }, [fetchUserInfo]);

    // Handle login success (both Google OAuth and regular login)
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const authParam = searchParams.get('auth');

        if (authParam === 'success') {
            setMessage({ type: 'success', text: 'Đăng nhập thành công!' });
            
            setLoading(true);
            fetchUserInfo();
            
            window.history.replaceState({}, '', location.pathname);
        }
    }, [location.search, location.pathname, fetchUserInfo]);

    // User dropdown menu
    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            label: 'Hồ sơ',
            icon: <UserOutlined />,
            onClick: () => navigate('/user/profile'),
        },
        {
            key: 'bookings',
            label: 'Đơn đặt phòng',
            icon: <UnorderedListOutlined />,
            onClick: () => navigate('/user/bookings'),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
            danger: true,
        },
    ];

    async function handleLogout() {
        try {
            await authService.logout();
            setCurrentUser(null);
            setMessage({ type: 'success', text: 'Đăng xuất thành công!' });
            
            // Navigate to home - useEffect will handle fetching user info
            setTimeout(() => {
                navigate('/');
            }, 500);
        } catch (error) {
            console.error('Logout error:', error);
            setMessage({ type: 'error', text: 'Có lỗi xảy ra khi đăng xuất!' });
        }
    }

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

    const isActive = (path: string) => {
        if (path.startsWith('/#')) {
            return location.pathname === '/' && location.hash === path.substring(1);
        }
        return location.pathname.startsWith(path);
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
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                    borderBottom: "none",
                    // borderBottom: "1px solid #f0f0f0"
                }}
            >
                <div className="max-w-7xl mx-auto px-3 sm:px-4 h-full flex items-center">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div
                            className="text-lg sm:text-xl lg:text-2xl font-bold cursor-pointer"
                            onClick={() => navigate('/')}
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

                    {/* Desktop Navigation - Hidden on mobile - Moved to right with ml-auto */}
                    <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 ml-auto">
                        {menuItems.map((item) => {
                            const active = isActive(item.path);
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavigation(item.path)}
                                    className="group relative text-sm font-semibold transition-opacity whitespace-nowrap bg-transparent border-none cursor-pointer px-4 py-2"
                                    style={{
                                        color: active 
                                            ? COLORS.primary 
                                            : (transparent ? COLORS.white : COLORS.gray[700]),
                                        fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!active) e.currentTarget.style.color = COLORS.primary;
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!active) e.currentTarget.style.color = transparent ? COLORS.white : COLORS.gray[700];
                                    }}
                                >
                                    {item.name}
                                    <span 
                                        className={`absolute bottom-4 left-0 h-[2px] transition-all duration-300 ease-out ${active ? 'w-full' : 'w-0 group-hover:w-full'}`}
                                        style={{ backgroundColor: COLORS.primary }}
                                    />
                                </button>
                            );
                        })}
                    </nav>

                    {/* Right Side - User Menu or Login Button, Mobile Menu */}
                    <div className="flex items-center space-x-2 sm:space-x-3 ml-auto lg:ml-8">
                        {/* Desktop - User Menu or Login Button */}
                        {!loading && (
                            currentUser ? (
                                <Dropdown 
                                    menu={{ items: userMenuItems }} 
                                    placement="bottomRight"
                                    trigger={['click']}
                                >
                                    <div 
                                        className="hidden sm:flex items-center gap-2 cursor-pointer hover:bg-gray-100 py-1.5 px-3 rounded-full transition-colors"
                                    >
                                        <Avatar 
                                            size="small" 
                                            icon={<UserOutlined />} 
                                            style={{ 
                                                backgroundColor: transparent ? 'rgba(255,255,255,0.2)' : 'white',
                                                color: COLORS.primary,
                                                border: `1px solid ${COLORS.primary}`
                                            }} 
                                        />
                                        <span 
                                            className="font-medium text-sm"
                                            style={{
                                                fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                                color: transparent ? COLORS.white : COLORS.gray[700],
                                            }}
                                        >
                                            {currentUser.name}
                                        </span>
                                        <DownOutlined 
                                            style={{ 
                                                fontSize: '10px', 
                                                color: transparent ? COLORS.white : COLORS.gray[500] 
                                            }} 
                                        />
                                    </div>
                                </Dropdown>
                            ) : (
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
                            )
                        )}

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
                        {currentUser ? (
                            <div className="space-y-3">
                                <div className="text-center mb-4">
                                    <div className="text-sm text-gray-500 mb-1">Xin chào,</div>
                                    <div className="font-semibold text-base" style={{ color: COLORS.primary }}>
                                        {currentUser.name}
                                    </div>
                                </div>
                                <Button
                                    block
                                    size="large"
                                    icon={<UserOutlined />}
                                    onClick={() => {
                                        navigate('/user/profile');
                                        setMobileMenuOpen(false);
                                    }}
                                    style={{
                                        fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                        height: '48px',
                                        marginBottom: '8px',
                                    }}
                                >
                                    Hồ sơ
                                </Button>
                                <Button
                                    block
                                    size="large"
                                    icon={<UnorderedListOutlined />}
                                    onClick={() => {
                                        navigate('/user/bookings');
                                        setMobileMenuOpen(false);
                                    }}
                                    style={{
                                        fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                        height: '48px',
                                        marginBottom: '8px',
                                    }}
                                >
                                    Đơn đặt phòng
                                </Button>
                                <Button
                                    block
                                    size="large"
                                    danger
                                    icon={<LogoutOutlined />}
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        handleLogout();
                                    }}
                                    style={{
                                        fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                        height: '48px',
                                    }}
                                >
                                    Đăng xuất
                                </Button>
                            </div>
                        ) : (
                            <Button
                                type="primary"
                                size="large"
                                block
                                onClick={() => {
                                    navigate('/login');
                                    setMobileMenuOpen(false);
                                }}
                                style={{
                                    backgroundColor: COLORS.primary,
                                    borderColor: COLORS.primary,
                                    fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                    fontWeight: TYPOGRAPHY.fontWeight.semibold,
                                    height: '48px',
                                }}
                            >
                                ĐĂNG NHẬP
                            </Button>
                        )}
                    </div>
                </div>
            </Drawer>

            {/* Notification */}
            <Notification message={message} onClose={() => setMessage(null)} />
        </>
    );
};

export default Header;
