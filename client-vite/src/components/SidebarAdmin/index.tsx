import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Typography, Drawer } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  HomeOutlined,
  CalendarOutlined,
  TagOutlined,
  LogoutOutlined,
  CoffeeOutlined
} from '@ant-design/icons';
import authService from '@/services/auth/authService';

const { Sider } = Layout;
const { Text } = Typography;

interface SidebarProps {
  mobileMenuOpen?: boolean;
  onMobileMenuClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  mobileMenuOpen = false, 
  onMobileMenuClose 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const menuItems = [
    { 
      key: '/dashboard', 
      icon: <DashboardOutlined />, 
      label: 'Dashboard'
    },
    { 
      key: '/dashboard/users', 
      icon: <UserOutlined />, 
      label: 'Người dùng'
    },
    { 
      key: 'rooms', 
      icon: <HomeOutlined />, 
      label: 'Phòng',
      children: [
        {
          key: '/dashboard/rooms',
          label: 'Danh sách phòng'
        },
        {
          key: '/dashboard/rooms/pricing',
          label: 'Tùy chỉnh giá'
        }
      ]
    },
    { 
      key: '/dashboard/bookings', 
      icon: <CalendarOutlined />, 
      label: 'Đơn đặt phòng'
    },
    { 
      key: '/dashboard/amenities', 
      icon: <TagOutlined />, 
      label: 'Tiện nghi'
    },
    {
      key: 'restaurant',
      icon: <CoffeeOutlined />,
      label: 'Nhà hàng',
      children: [
        {
          key: '/dashboard/restaurant',
          label: 'Thông tin nhà hàng'
        },
        {
          key: '/dashboard/restaurant/services',
          label: 'Dịch vụ nhà hàng'
        },
        {
          key: '/dashboard/restaurant/images',
          label: 'Hình ảnh nhà hàng'
        }
      ]
    },
  ];

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      localStorage.removeItem('isAuthenticated');
      navigate('/login');
    } catch (error) {
      console.error('Lỗi khi logout:', error);
      localStorage.removeItem('isAuthenticated');
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    // Direct navigation for simple keys that are paths
    if (key.startsWith('/dashboard')) {
      navigate(key);
    }
    // Close mobile menu after navigation
    if (isMobile && onMobileMenuClose) {
      onMobileMenuClose();
    }
  };

  // Render sidebar content
  const renderSidebarContent = () => (
    <>
      {/* Header */}
      <div style={{
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid #f0f0f0',
        background: 'linear-gradient(135deg, #D4902A 0%, #B8761E 100%)',
        margin: 0,
      }}>
        <Text 
          strong 
          style={{ 
            color: '#fff',
            fontSize: '18px',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
        >
          Admin Panel
        </Text>
      </div>

      {/* Menu */}
      <div style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          style={{
            border: 'none',
            background: 'transparent',
          }}
          items={menuItems}
        />
      </div>

      {/* Logout Section - Fixed at bottom of viewport */}
      <div style={{ 
        padding: '16px',
        borderTop: '1px solid #f0f0f0',
        background: '#fafafa',
        marginTop: 'auto',
      }}>
        <Button
          type="text"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          loading={isLoading}
          style={{
            width: '100%',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            borderRadius: '8px',
            fontWeight: 500,
          }}
        >
          Đăng xuất
        </Button>
      </div>
    </>
  );

  // Mobile view with Drawer
  if (isMobile) {
    return (
      <>
        {/* Mobile hamburger button - will be positioned by parent layout */}
        <Drawer
          title={null}
          placement="left"
          onClose={onMobileMenuClose}
          open={mobileMenuOpen}
          bodyStyle={{ padding: 0 }}
          width={260}
          style={{ zIndex: 1001 }}
        >
          <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {renderSidebarContent()}
          </div>
        </Drawer>
      </>
    );
  }

  // Desktop view with fixed Sider

  return (
    <Sider
      width={260}
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        background: '#fff',
        borderRight: '1px solid #f0f0f0',
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        zIndex: 1000,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {renderSidebarContent()}
    </Sider>
  );
};

// Export both the component and a function to toggle mobile menu
export const useSidebarControl = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);
  return { mobileMenuOpen, setMobileMenuOpen, toggleMobileMenu, closeMobileMenu };
};

export default Sidebar;
