import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Typography } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  HomeOutlined,
  CalendarOutlined,
  TagOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import authService from '@/services/authService';

const { Sider } = Layout;
const { Text } = Typography;

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  collapsed: externalCollapsed, 
  onCollapse: externalOnCollapse 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  
  // Use external collapsed state if provided, otherwise use internal state
  const collapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const onCollapse = externalOnCollapse || setInternalCollapsed;

  // Auto collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && !collapsed) {
        onCollapse(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check on initial load

    return () => window.removeEventListener('resize', handleResize);
  }, [collapsed, onCollapse]);

  const menuItems = [
    { 
      key: '/dashboard', 
      icon: <DashboardOutlined />, 
      label: 'Dashboard',
      path: '/dashboard'
    },
    { 
      key: '/dashboard/users', 
      icon: <UserOutlined />, 
      label: 'Người dùng',
      path: '/dashboard/users'
    },
    { 
      key: '/dashboard/rooms', 
      icon: <HomeOutlined />, 
      label: 'Phòng',
      path: '/dashboard/rooms'
    },
    { 
      key: '/dashboard/bookings', 
      icon: <CalendarOutlined />, 
      label: 'Đơn đặt phòng',
      path: '/dashboard/bookings'
    },
    { 
      key: '/dashboard/amenities', 
      icon: <TagOutlined />, 
      label: 'Tiện nghi',
      path: '/dashboard/amenities'
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
    const menuItem = menuItems.find(item => item.key === key);
    if (menuItem) {
      navigate(menuItem.path);
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={260}
      collapsedWidth={80}
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
        overflow: 'auto',
      }}
      trigger={
        <div style={{ 
          textAlign: 'center', 
          padding: '12px',
          background: '#fafafa',
          borderTop: '1px solid #f0f0f0',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      }
    >
      {/* Header */}
      <div style={{
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid #f0f0f0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        margin: 0,
      }}>
        <Text 
          strong 
          style={{ 
            color: '#fff',
            fontSize: collapsed ? '14px' : '18px',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
        >
          {collapsed ? 'AP' : 'Admin Panel'}
        </Text>
      </div>

      {/* Menu */}
      <div style={{ flex: 1, padding: '16px 0' }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          style={{
            border: 'none',
            background: 'transparent',
          }}
          items={menuItems.map(item => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            style: {
              margin: '4px 8px',
              borderRadius: '8px',
              height: '48px',
              lineHeight: '48px',
              display: 'flex',
              alignItems: 'center',
            }
          }))}
        />
      </div>

      {/* Logout Section */}
      <div style={{ 
        padding: '16px',
        borderTop: '1px solid #f0f0f0',
        background: '#fafafa'
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
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderRadius: '8px',
            fontWeight: 500,
          }}
        >
          {!collapsed && 'Đăng xuất'}
        </Button>
      </div>
    </Sider>
  );
};

export default Sidebar;
