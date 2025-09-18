import React from 'react';
import { Select } from 'antd';
import { RoomType, SortOption } from '@/pages/user/Rooms';
import { TYPOGRAPHY } from '@/config/constants';

const { Option } = Select;

interface RoomFiltersProps {
  filterType: RoomType;
  sortBy: SortOption;
  totalRooms: number;
  onFilterChange: (value: RoomType) => void;
  onSortChange: (value: SortOption) => void;
}

const RoomFilters: React.FC<RoomFiltersProps> = ({
  filterType,
  sortBy,
  totalRooms,
  onFilterChange,
  onSortChange,
}) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 
            className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: TYPOGRAPHY.fontFamily.primary }}
          >
            Danh Sách Phòng
          </h1>
          <p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            style={{ fontFamily: TYPOGRAPHY.fontFamily.secondary }}
          >
            Khám phá những phòng nghỉ sang trọng với thiết kế tinh tế và tiện nghi hiện đại tại Lion Boutique Hotel
          </p>
        </div>
        
        {/* Filter and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại phòng
              </label>
              <Select
                size="large"
                value={filterType}
                onChange={onFilterChange}
                className="w-48"
              >
                <Option value="all">Tất cả phòng</Option>
                <Option value="standard">Standard</Option>
                <Option value="superior">Superior</Option>
                <Option value="deluxe">Deluxe</Option>
                <Option value="suite">Suite</Option>
                <Option value="junior suite">Junior Suite</Option>
                <Option value="executive">Executive</Option>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sắp xếp theo
              </label>
              <Select
                size="large"
                value={sortBy}
                onChange={onSortChange}
                className="w-48"
              >
                <Option value="price-asc">Giá: Thấp đến cao</Option>
                <Option value="price-desc">Giá: Cao đến thấp</Option>
                <Option value="rating">Đánh giá cao nhất</Option>
                <Option value="name">Tên A-Z</Option>
              </Select>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            Hiển thị {totalRooms} phòng
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomFilters;
