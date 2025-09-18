import React from 'react';
import { COLORS } from '@/config/constants';
import './Loading.css';

interface LoadingProps {
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Loading: React.FC<LoadingProps> = ({
  loading = false,
  children,
  className = '',
  style,
}) => {
  return (
    <div className={`loading-wrapper ${className}`} style={style}>
      {loading && (
        <div className="progress-bar-container">
          <div 
            className="progress-bar"
            style={{ 
              backgroundColor: COLORS.primary,
              boxShadow: `0 0 10px ${COLORS.primary}40`
            }}
          />
        </div>
      )}
      {children}
    </div>
  );
};

// Room Grid Loading Skeleton
export const RoomGridSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="room-card-skeleton rounded-lg overflow-hidden bg-white">
            <div className="h-64 bg-gray-200 animate-pulse"></div>
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-3/4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-14"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-1/2"></div>
              <div className="flex justify-between items-end">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Search Results Loading Skeleton
export const SearchResultsSkeleton: React.FC = () => {
  return (
    <div className="grid gap-6">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-80 h-64 bg-gray-200 animate-pulse"></div>
            <div className="flex-1 p-6">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-3/4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-14"></div>
              </div>
              <div className="flex justify-between items-end">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse w-24"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;
