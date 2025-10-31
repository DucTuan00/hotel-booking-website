import React, { useState, useEffect, useCallback } from 'react';
import { Button, Drawer, Layout, Dropdown, Space } from 'antd';
import { MenuOutlined, CloseOutlined, UserOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { COLORS, TYPOGRAPHY } from '@/config/constants';
import userService from '@/services/users/userService';
import authService from '@/services/auth/authService';
import { User } from '@/types/user';
import Notification from '@/components/Notification';
import { onLoginSuccess } from '@/utils/authEvents';

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

    const menuItems = [
        { name: 'GIỚI THIỆU', path: '/#about' },
        { name: 'PHÒNG', path: '/rooms' },
        { name: 'NHÀ HÀNG & SKY BAR', path: '/restaurant' },
        { name: 'SPA & TẮM BIA', path: '/spa' },
        { name: 'AI PLANNER', path: '/#' },
        { name: 'LIÊN HỆ', path: '/#contact' },
    ];

    // Fetch user info on component mount
    const fetchUserInfo = useCallback(async () => {
        try {
            const user = await userService.getUserInfo();
            setCurrentUser(user);
        } catch {
            setCurrentUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Check if user just logged out (flag in sessionStorage)
        const justLoggedOut = sessionStorage.getItem('justLoggedOut');
        if (justLoggedOut) {
            sessionStorage.removeItem('justLoggedOut');
            setCurrentUser(null);
            setLoading(false);
            return;
        }

        // Only fetch if not on login page to avoid unnecessary API calls
        if (window.location.pathname !== '/login') {
            fetchUserInfo();
        } else {
            setLoading(false);
        }
    }, [fetchUserInfo]);

    // Listen for login success event
    useEffect(() => {
        const handleLoginSuccess = () => {
            console.log('Login success event received, fetching user info...');
            fetchUserInfo();
        };

        // Subscribe to login success event
        const unsubscribe = onLoginSuccess(handleLoginSuccess);

        // Cleanup on unmount
        return unsubscribe;
    }, [fetchUserInfo]);

    // User dropdown menu
    const userMenuItems: MenuProps['items'] = [
        {
            key: 'profile',
            label: 'Hồ sơ',
            icon: <UserOutlined />,
            onClick: () => navigate('/user/profile'),
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
            
            // Set flag to prevent fetching user info after logout
            sessionStorage.setItem('justLoggedOut', 'true');
            
            setMessage({ type: 'success', text: 'Đăng xuất thành công!' });
            
            // Navigate to home page
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
                                className="text-sm font-semibold transition-opacity whitespace-nowrap bg-transparent border-none cursor-pointer px-4"
                                style={{
                                    color: transparent
                                        ? COLORS.white
                                        : COLORS.gray[700],
                                    fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = COLORS.primary;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = transparent ? COLORS.white : COLORS.gray[700];
                                }}
                            >
                                {item.name}
                            </button>
                        ))}
                    </nav>

                    {/* Right Side - User Menu or Login Button, Mobile Menu */}
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        {/* Desktop - User Menu or Login Button */}
                        {!loading && (
                            currentUser ? (
                                <Dropdown 
                                    menu={{ items: userMenuItems }} 
                                    placement="bottomRight"
                                    trigger={['click']}
                                >
                                    <Space
                                        className="hidden sm:flex cursor-pointer hover:opacity-75 transition-opacity"
                                        style={{
                                            fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                            fontWeight: TYPOGRAPHY.fontWeight.medium,
                                            color: transparent ? COLORS.white : COLORS.gray[700],
                                            paddingBottom: '4px',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = COLORS.primary;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = transparent ? COLORS.white : COLORS.gray[700];
                                        }}
                                    >
                                        {currentUser.name}
                                        <DownOutlined style={{ fontSize: '10px' }} />
                                    </Space>
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
                        

                        <div className="flex justify-center space-x-4 text-sm text-gray-500">
                            <span>Hotline: 0258.3834.666</span>
                        </div>
                    </div>
                </div>
            </Drawer>

            {/* Notification */}
            <Notification message={message} onClose={() => setMessage(null)} />
        </>
    );
};

export default Header;
