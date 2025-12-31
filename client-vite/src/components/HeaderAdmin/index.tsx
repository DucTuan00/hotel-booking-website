import React, { useState, useEffect } from 'react';
import { Layout, Typography, Space, Button, Dropdown, Avatar } from 'antd';
import type { MenuProps } from 'antd';
import { MenuOutlined, UserOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import authService from '@/services/auth/authService';
import userService from '@/services/users/userService';
import { User } from '@/types/user';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

interface HeaderProps {
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await userService.getUserInfo();
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      localStorage.removeItem('isAuthenticated');
      navigate('/login');
    } catch (error) {
      console.error('Lỗi khi logout:', error);
      localStorage.removeItem('isAuthenticated');
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const dropdownItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin tài khoản',
      onClick: () => navigate('/dashboard/profile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất',
      danger: true,
      onClick: handleLogout,
      disabled: isLoggingOut,
    },
  ];

  return (
    <AntHeader
      style={{
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <Space align="center">
        {/* Hamburger menu for mobile */}
        {isMobile && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={onMenuToggle}
            style={{
              fontSize: '18px',
              color: '#D4902A',
              marginRight: '12px',
            }}
          />
        )}
        
        <Title 
          level={3} 
          style={{ 
            margin: 0,
            color: '#000',
            fontWeight: 600,
          }}
        >
          Lion Boutique Hotel Admin
        </Title>
      </Space>

      {/* User Avatar Dropdown */}
      <Dropdown
        menu={{ items: dropdownItems }}
        trigger={['click']}
        placement="bottomRight"
      >
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            cursor: 'pointer',
            padding: '3px 6px',
            borderRadius: '20px',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Avatar 
            size="small" 
            icon={<UserOutlined />} 
            style={{ 
              backgroundColor: 'white',
              color: '#D4902A',
              border: '1px solid #D4902A'
            }} 
          />
          {!isMobile && currentUser && (
            <span style={{ color: '#333', fontWeight: 500, fontSize: '16px' }}>
              Xin chào, {currentUser.name}
            </span>
          )}
          <DownOutlined 
            style={{ 
              fontSize: '10px', 
              color: '#8c8c8c' 
            }} 
          />
        </div>
      </Dropdown>
    </AntHeader>
  );
};

export default Header;