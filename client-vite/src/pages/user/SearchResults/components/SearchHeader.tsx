import React from 'react';
import { Button } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { TYPOGRAPHY, COLORS } from '@/config/constants';

interface SearchHeaderProps {
  totalRooms: number;
  onToggleMobileFilter: () => void;
  searchInfo?: {
    checkIn?: string;
    checkOut?: string;
    adults?: number;
    children?: number;
  };
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  totalRooms,
  onToggleMobileFilter,
  searchInfo,
}) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getSearchDescription = () => {
    const parts: string[] = [];
    
    // Date range
    if (searchInfo?.checkIn && searchInfo?.checkOut) {
      parts.push(`${formatDate(searchInfo.checkIn)} - ${formatDate(searchInfo.checkOut)}`);
    }
    
    // Guests
    if (searchInfo?.adults || searchInfo?.children) {
      const adults = searchInfo.adults || 0;
      const children = searchInfo.children || 0;
      const total = adults + children;
      parts.push(`${total} khách`);
    }
    
    return parts.length > 0 ? parts.join(' • ') : '';
  };

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1
              className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: TYPOGRAPHY.fontFamily.primary }}
            >
              Kết quả tìm kiếm
            </h1>
            <p
              className="text-gray-600"
              style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
            >
              Tìm thấy {totalRooms} phòng phù hợp
              {getSearchDescription() && ` • ${getSearchDescription()}`}
            </p>
          </div>

          {/* Mobile Filter Button */}
          <Button
            icon={<FilterOutlined />}
            onClick={onToggleMobileFilter}
            className="lg:hidden"
            style={{ borderColor: COLORS.primary, color: COLORS.primary }}
          >
            Bộ lọc
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;