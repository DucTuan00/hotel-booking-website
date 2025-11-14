import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    HomeOutlined,
    AppstoreOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { COLORS, TYPOGRAPHY } from '@/config/constants';

const BottomNavigation: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('home');

    // Update active tab based on current route
    useEffect(() => {
        if (location.pathname === '/') {
            setActiveTab('home');
        } else if (location.pathname === '/mobile/category') {
            setActiveTab('category');
        } else if (location.pathname === '/mobile/account') {
            setActiveTab('account');
        } else if (location.pathname.startsWith('/user/')) {
            setActiveTab('account');
        } else {
            setActiveTab('home');
        }
    }, [location.pathname]);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        
        if (tab === 'home') {
            navigate('/');
        } else if (tab === 'category') {
            navigate('/mobile/category');
        } else if (tab === 'account') {
            navigate('/mobile/account');
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: '65px',
                backgroundColor: '#fff',
                borderTop: `1px solid ${COLORS.gray[200]}`,
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                zIndex: 1000,
                boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
            }}
        >
            {/* Home Tab */}
            <button
                onClick={() => handleTabClick('home')}
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px 0',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: activeTab === 'home' ? COLORS.primary : COLORS.gray[500],
                    transition: 'all 0.2s',
                }}
            >
                <HomeOutlined style={{ fontSize: '22px', marginBottom: '4px' }} />
                <span
                    style={{
                        fontSize: '11px',
                        fontFamily: TYPOGRAPHY.fontFamily.secondary,
                        fontWeight: activeTab === 'home' ? 600 : 400,
                    }}
                >
                    Trang chủ
                </span>
            </button>

            {/* Category Tab */}
            <button
                onClick={() => handleTabClick('category')}
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px 0',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: activeTab === 'category' ? COLORS.primary : COLORS.gray[500],
                    transition: 'all 0.2s',
                }}
            >
                <AppstoreOutlined style={{ fontSize: '22px', marginBottom: '4px' }} />
                <span
                    style={{
                        fontSize: '11px',
                        fontFamily: TYPOGRAPHY.fontFamily.secondary,
                        fontWeight: activeTab === 'category' ? 600 : 400,
                    }}
                >
                    Danh mục
                </span>
            </button>

            {/* Account Tab */}
            <button
                onClick={() => handleTabClick('account')}
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px 0',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: activeTab === 'account' ? COLORS.primary : COLORS.gray[500],
                    transition: 'all 0.2s',
                }}
            >
                <UserOutlined style={{ fontSize: '22px', marginBottom: '4px' }} />
                <span
                    style={{
                        fontSize: '11px',
                        fontFamily: TYPOGRAPHY.fontFamily.secondary,
                        fontWeight: activeTab === 'account' ? 600 : 400,
                    }}
                >
                    Tài khoản
                </span>
            </button>
        </div>
    );
};

export default BottomNavigation;
