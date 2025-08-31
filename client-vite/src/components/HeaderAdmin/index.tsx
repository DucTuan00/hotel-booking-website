import React from 'react';
import { Layout, Typography, Space, Divider } from 'antd';
import { CrownOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const Header: React.FC = () => {
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
      }}
    >
      <Space align="center">
        <CrownOutlined 
          style={{ 
            fontSize: '24px', 
            color: '#667eea',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }} 
        />
        <Divider type="vertical" style={{ height: '32px' }} />
        <Title 
          level={3} 
          style={{ 
            margin: 0,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
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