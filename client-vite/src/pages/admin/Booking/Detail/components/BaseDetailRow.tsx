import React from 'react';

interface BaseDetailRowProps {
    label: string;
    value: React.ReactNode;
    fullWidth?: boolean;
}

const BaseDetailRow: React.FC<BaseDetailRowProps> = ({ label, value, fullWidth = false }) => {
    return (
        <div
            className={`grid ${fullWidth ? 'grid-cols-1' : 'grid-cols-[200px_1fr]'} border-b border-gray-200 last:border-b-0`}
        >
            <div className="px-4 py-3 bg-gray-50 font-medium text-gray-700 border-r border-gray-200">
                {label}
            </div>
            <div className="px-4 py-3 bg-white text-gray-900">
                {value}
            </div>
        </div>
    );
};

export default BaseDetailRow;
