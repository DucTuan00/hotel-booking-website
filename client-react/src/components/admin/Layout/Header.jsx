import React from 'react';
import { Layout } from 'antd';

const { Header: AntHeader } = Layout;

const Header = () => {
    return (
        <AntHeader className="site-layout-background" style={{ padding: 0 }}>
            <h2 style={{ paddingLeft: '24px', margin: '10px', color: '#fff', backgroundColor: '#001529' }}>
                Admin Dashboard
            </h2>
        </AntHeader>
    );
};

export default Header;