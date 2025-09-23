import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import Sidebar, { useSidebarControl } from '@/components/SidebarAdmin';
import Header from '@/components/HeaderAdmin';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

const AdminLayout: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useSidebarControl();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto close mobile menu when switching to desktop
      if (!mobile && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check on initial load

    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen, closeMobileMenu]);

  const siderWidth = 260;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar 
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuClose={closeMobileMenu}
      />
      <Layout 
        style={{ 
          marginLeft: isMobile ? 0 : siderWidth,
          transition: 'margin-left 0.2s',
        }}
      >
        <Header onMenuToggle={toggleMobileMenu} />
        <Content
          style={{
            // margin: isMobile ? '16px' : '24px',
            padding: isMobile ? '16px' : '24px',
            background: '#fff',
            // borderRadius: '8px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
            minHeight: 'calc(100vh - 112px)',
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;