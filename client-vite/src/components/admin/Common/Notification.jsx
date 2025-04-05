import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'; // Using solid icons

const Notification = ({ message, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setIsVisible(true); // Show notification when message arrives

            // Set timer to automatically close
            const timer = setTimeout(() => {
                handleClose();
            }, 3000); // 3 seconds duration

            // Cleanup timer if component unmounts or message changes before timer ends
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false); // Hide if message becomes null
        }
    }, [message]); // Effect runs when message changes

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose(); 
        }, 300); 
    };


    if (!isVisible || !message) {
        return null; 
    }

    const isSuccess = message.type === 'success';
    const bgColor = isSuccess ? 'bg-green-600' : 'bg-red-600';
    const Icon = isSuccess ? CheckCircleIcon : XCircleIcon;

    return (
        // Position the notification container
        <div
            // Using Tailwind JIT mode allows arbitrary values like translate-x-1/2
            className={`fixed top-5 right-5 w-auto max-w-sm z-50 transform transition-all duration-300 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}
            role="alert" // Accessibility
        >
            {/* Notification content */}
            <div className={`rounded-lg shadow-lg p-4 text-white ${bgColor}`}>
                <div className="flex items-start">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    {/* Message Text */}
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium">{message.text}</p>
                    </div>
                    {/* Close Button */}
                    <div className="ml-4 flex-shrink-0 flex">
                        <button
                            onClick={handleClose}
                            className="inline-flex rounded-md text-white hover:bg-white hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-white p-1" // Added padding
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