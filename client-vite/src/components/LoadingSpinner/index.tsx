import React from 'react';
import { Spin, Typography } from 'antd';

interface LoadingSpinnerProps {
    message?: string;
    size?: 'small' | 'default' | 'large';
    style?: React.CSSProperties;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
    message = 'Đang tải dữ liệu...', 
    size = 'large',
    style = {}
}) => {
    const defaultStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#fff',
        ...style
    };

    return (
        <div style={defaultStyle}>
            <Spin size={size} />
            <Typography.Text style={{ marginTop: '16px', fontSize: '16px' }}>
                {message}
            </Typography.Text>
        </div>
    );
};

export default LoadingSpinner;
