import React from 'react';

interface DetailSectionProps {
    title: string;
    children: React.ReactNode;
}

const DetailSection: React.FC<DetailSectionProps> = ({ title, children }) => {
    return (
        <div className="mb-6">
            <p 
                className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-gray-300"
                style={{
                    marginBottom: 0
                }}
            >
                {title}
            </p>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                {children}
            </div>
        </div>
    );
};

export default DetailSection;
