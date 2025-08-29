import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface NotificationMessage {
  type: 'success' | 'error';
  text: string;
}

interface NotificationProps {
  message: NotificationMessage | null;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        handleClose();
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [message, handleClose]);

  if (!isVisible || !message) {
    return null;
  }

  const isSuccess = message.type === 'success';
  const bgColor = isSuccess ? 'bg-green-600' : 'bg-red-600';
  const Icon = isSuccess ? CheckCircleIcon : XCircleIcon;

  return (
    <div
      className={`fixed top-5 right-5 w-auto max-w-sm z-50 transform transition-all duration-300 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}
      role="alert"
    >
      <div className={`rounded-lg shadow-lg p-4 text-white ${bgColor}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">{message.text}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleClose}
              className="inline-flex rounded-md text-white hover:bg-white hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-white p-1"
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;