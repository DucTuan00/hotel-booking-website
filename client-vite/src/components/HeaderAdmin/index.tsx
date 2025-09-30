import React, { useState, useEffect } from 'react';
import { Layout, Typography, Space, Divider, Button } from 'antd';
import { CrownOutlined, MenuOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

interface HeaderProps {
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
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
        
        <CrownOutlined 
          style={{ 
            fontSize: '24px', 
            color: '#D4902A',
          }} 
        />
        <Divider type="vertical" style={{ height: '32px' }} />
        <Title 
          level={3} 
          style={{ 
            margin: 0,
            color: '#000',
            fontWeight: 600,
          }}
        >
          Hotel Boutique Admin
        </Title>
      </Space>
    </AntHeader>
  );
};

export default Header;