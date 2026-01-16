import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import {
    UserOutlined,
    LogoutOutlined,
    UnorderedListOutlined,
    LoginOutlined,
} from '@ant-design/icons';
import { COLORS, TYPOGRAPHY } from '@/config/constants';
import userService from '@/services/users/userService';
import authService from '@/services/auth/authService';
import { User } from '@/types/user';
import Notification from '@/components/Notification';

const MobileAccount: React.FC = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
        fetchUserInfo();
    }, [fetchUserInfo]);

    const handleLogout = async () => {
        try {
            await authService.logout();
            setCurrentUser(null);
            setMessage({ type: 'success', text: 'Đăng xuất thành công!' });
            setTimeout(() => {
                navigate('/');
            }, 500);
        } catch (error) {
            console.error('Logout error:', error);
            setMessage({ type: 'error', text: 'Có lỗi xảy ra khi đăng xuất!' });
        }
    };

    if (loading) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#F8F9FA',
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundColor: '#F8F9FA',
                paddingBottom: '85px',
            }}
        >
            {currentUser ? (
                <>
                    {/* User Header with Avatar */}
                    <div
                        style={{
                            background: `${COLORS.primary}`,
                            padding: '40px 16px 32px',
                            textAlign: 'center',
                            marginBottom: '24px',
                        }}
                    >
                        {/* Avatar */}
                        <div
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                backgroundColor: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            }}
                        >
                            <UserOutlined style={{ fontSize: '40px', color: COLORS.primary }} />
                        </div>

                        {/* Name */}
                        <div
                            style={{
                                fontSize: '22px',
                                fontWeight: 700,
                                fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                color: '#fff',
                                marginBottom: '6px',
                            }}
                        >
                            {currentUser.name}
                        </div>

                        {/* Email */}
                        <div
                            style={{
                                fontSize: '14px',
                                color: 'rgba(255,255,255,0.9)',
                                fontFamily: TYPOGRAPHY.fontFamily.secondary,
                            }}
                        >
                            {currentUser.email}
                        </div>
                    </div>

                    {/* Menu Grid */}
                    <div style={{ padding: '0 16px' }}>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr',
                                gap: '16px',
                            }}
                        >
                            {/* Profile Button */}
                            <button
                                onClick={() => navigate('/user/profile')}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    padding: '20px 16px',
                                    backgroundColor: '#fff',
                                    border: `1px solid ${COLORS.gray[300]}`,
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    gap: '12px',
                                    maxHeight: '60px'
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
                                <div
                                    style={{
                                        width: '56px',
                                        height: '56px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    <UserOutlined style={{ fontSize: '24px' }} />
                                </div>
                                <span
                                    style={{
                                        fontSize: '15px',
                                        fontWeight: 600,
                                        fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                        color: COLORS.gray[700],
                                        textAlign: 'left',
                                    }}
                                >
                                    Hồ sơ
                                </span>
                            </button>

                            {/* Bookings Button */}
                            <button
                                onClick={() => navigate('/user/bookings')}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    padding: '20px 16px',
                                    backgroundColor: '#fff',
                                    border: `1px solid ${COLORS.gray[300]}`,
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    gap: '12px',
                                    maxHeight: '60px'
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
                                <div
                                    style={{
                                        width: '56px',
                                        height: '56px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    <UnorderedListOutlined style={{ fontSize: '24px' }} />
                                </div>
                                <span
                                    style={{
                                        fontSize: '15px',
                                        fontWeight: 600,
                                        fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                        color: COLORS.gray[700],
                                        textAlign: 'left',
                                    }}
                                >
                                    Đơn đặt phòng
                                </span>
                            </button>

                            {/* Logout Button - Full width */}
                            <button
                                onClick={handleLogout}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    padding: '20px 16px',
                                    backgroundColor: '#fff',
                                    border: `1px solid ${COLORS.gray[300]}`,
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    gap: '12px',
                                    maxHeight: '60px'
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
                                <div
                                    style={{
                                        width: '56px',
                                        height: '56px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    <LogoutOutlined style={{ fontSize: '24px' }} />
                                </div>
                                <span
                                    style={{
                                        fontSize: '15px',
                                        fontWeight: 600,
                                        fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                        color: COLORS.gray[700],
                                        textAlign: 'left',
                                    }}
                                >
                                    Đăng xuất
                                </span>
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                // Not logged in state
                <div
                    style={{
                        padding: '40px 16px',
                        textAlign: 'center',
                    }}
                >
                    {/* Icon */}
                    <div
                        style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            backgroundColor: COLORS.gray[100],
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                        }}
                    >
                        <UserOutlined style={{ fontSize: '50px', color: COLORS.gray[400] }} />
                    </div>

                    {/* Message */}
                    <div
                        style={{
                            fontSize: '20px',
                            fontWeight: 600,
                            fontFamily: TYPOGRAPHY.fontFamily.secondary,
                            color: COLORS.gray[700],
                            marginBottom: '12px',
                        }}
                    >
                        Bạn chưa đăng nhập
                    </div>
                    <div
                        style={{
                            fontSize: '14px',
                            color: COLORS.gray[500],
                            fontFamily: TYPOGRAPHY.fontFamily.secondary,
                            marginBottom: '32px',
                            lineHeight: '1.5',
                        }}
                    >
                        Đăng nhập để quản lý đặt phòng
                        <br />
                        và thông tin cá nhân của bạn
                    </div>

                    {/* Login Button */}
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            width: '100%',
                            maxWidth: '280px',
                            margin: '0 auto',
                            padding: '16px 32px',
                            backgroundColor: COLORS.primary,
                            color: '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: 600,
                            fontFamily: TYPOGRAPHY.fontFamily.secondary,
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(212, 144, 42, 0.3)',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(212, 144, 42, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 144, 42, 0.3)';
                        }}
                    >
                        <LoginOutlined style={{ fontSize: '20px' }} />
                        ĐĂNG NHẬP
                    </button>
                </div>
            )}

            <Notification message={message} onClose={() => setMessage(null)} />
        </div>
    );
};

export default MobileAccount;
