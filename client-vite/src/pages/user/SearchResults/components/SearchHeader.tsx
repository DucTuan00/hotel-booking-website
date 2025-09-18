import React from 'react';
import { Button } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { TYPOGRAPHY, COLORS } from '@/config/constants';

interface SearchHeaderProps {
  totalRooms: number;
  onToggleMobileFilter: () => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  totalRooms,
  onToggleMobileFilter,
}) => {
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
              Tìm thấy {totalRooms} phòng phù hợp • 15-17 Tháng 9, 2025 • 2 khách
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