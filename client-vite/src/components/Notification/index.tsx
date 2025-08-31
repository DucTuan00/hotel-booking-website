import React, { useEffect, useRef } from 'react';
import { notification } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

interface NotificationMessage {
  type: 'success' | 'error';
  text: string;
}

interface NotificationProps {
  message: NotificationMessage | null;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  const [api, contextHolder] = notification.useNotification();
  const lastMessageRef = useRef<string | null>(null);

  useEffect(() => {
    if (message && message.text !== lastMessageRef.current) {
      lastMessageRef.current = message.text;
      
      const config = {
        message: message.type === 'success' ? 'Thành công' : 'Lỗi',
        description: message.text,
        placement: 'topRight' as const,
        duration: 3,
        style: {
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
        onClose: () => {
          lastMessageRef.current = null;
          onClose();
        }
      };

      if (message.type === 'success') {
        api.success({
          ...config,
          icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        });
      } else {
        api.error({
          ...config,
          icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
        });
      }
    }
  }, [message, api, onClose]);

  return <>{contextHolder}</>;
};

export default Notification;