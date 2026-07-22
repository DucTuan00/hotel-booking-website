import React, { useEffect, useRef } from 'react';
import { notification } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Message } from '@/types/message';

interface NotificationProps {
  message: Message | null;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  const [api, contextHolder] = notification.useNotification();
  const lastMessageRef = useRef<string | null>(null);

  useEffect(() => {
    if (message && message.text !== lastMessageRef.current) {
      lastMessageRef.current = message.text;
      
      const getTitle = (type: Message['type']) => {
        switch (type) {
          case 'success': return 'Thành công';
          case 'error': return 'Lỗi';
          case 'warning': return 'Cảnh báo';
          case 'info': return 'Thông tin';
          default: return '';
        }
      };

      const getIcon = (type: Message['type']) => {
        switch (type) {
          case 'success': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
          case 'error': return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
          case 'warning': return <WarningOutlined style={{ color: '#faad14' }} />;
          case 'info': return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
          default: return null;
        }
      };

      const config = {
        message: getTitle(message.type),
        description: message.text,
        placement: 'topRight' as const,
        duration: 5,
        style: {
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
        icon: getIcon(message.type),
        onClose: () => {
          lastMessageRef.current = null;
          onClose();
        }
      };

      if (message.type === 'success') {
        api.success(config);
      } else if (message.type === 'error') {
        api.error(config);
      } else if (message.type === 'warning') {
        api.warning(config);
      } else {
        api.info(config);
      }
    }
  }, [message, api, onClose]);

  return <>{contextHolder}</>;
};

export default Notification;