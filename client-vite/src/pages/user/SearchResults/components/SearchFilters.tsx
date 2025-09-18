import React from 'react';
import { Button, Slider, Checkbox, Select } from 'antd';
import { COLORS, TYPOGRAPHY } from '@/config/constants';

const { Option } = Select;

interface SearchFiltersProps {
  showMobileFilter: boolean;
  priceRange: [number, number];
  selectedRoomTypes: string[];
  selectedAmenities: string[];
  sortBy: string;
  onPriceRangeChange: (value: [number, number]) => void;
  onRoomTypesChange: (value: string[]) => void;
  onAmenitiesChange: (value: string[]) => void;
  onSortChange: (value: string) => void;
  onClearFilters: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  showMobileFilter,
  priceRange,
  selectedRoomTypes,
  selectedAmenities,
  sortBy,
  onPriceRangeChange,
  onRoomTypesChange,
  onAmenitiesChange,
  onSortChange,
  onClearFilters,
}) => {
  const roomTypes = ['Standard', 'Superior', 'Deluxe', 'Suite'];
  const amenities = ['WiFi miễn phí', 'Điều hòa', 'TV', 'Mini Bar', 'View biển', 'Bếp nhỏ', 'Jacuzzi'];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className={`lg:w-80 ${showMobileFilter ? 'block' : 'hidden'} lg:block`}>
      <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
        <div className="flex justify-between items-center mb-6">
          <h3
            className="text-lg font-bold text-gray-900"
            style={{ fontFamily: TYPOGRAPHY.fontFamily.primary }}
          >
            Bộ lọc
          </h3>
          <Button
            type="text"
            size="small"
            onClick={onClearFilters}
            style={{ color: COLORS.primary }}
          >
            Xóa bộ lọc
          </Button>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Giá phòng (VNĐ/đêm)</h4>
          <Slider
            range
            min={1000000}
            max={7000000}
            step={100000}
            value={priceRange}
            onChange={(value) => onPriceRangeChange(value as [number, number])}
            tooltip={{
              formatter: (value) => formatPrice(value!)
            }}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>

        {/* Room Type */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Loại phòng</h4>
          <Checkbox.Group
            value={selectedRoomTypes}
            onChange={(values) => onRoomTypesChange(values as string[])}
          >
            <div className="space-y-2">
              {roomTypes.map(type => (
                <div key={type}>
                  <Checkbox value={type}>{type}</Checkbox>
                </div>
              ))}
            </div>
          </Checkbox.Group>
        </div>

        {/* Amenities */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Tiện ích</h4>
          <Checkbox.Group
            value={selectedAmenities}
            onChange={(values) => onAmenitiesChange(values as string[])}
          >
            <div className="space-y-2">
              {amenities.map(amenity => (
                <div key={amenity}>
                  <Checkbox value={amenity}>{amenity}</Checkbox>
                </div>
              ))}
            </div>
          </Checkbox.Group>
        </div>

        {/* Sort Options */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Sắp xếp theo</h4>
          <Select
            value={sortBy}
            onChange={onSortChange}
            className="w-full"
          >
            <Option value="price-asc">Giá thấp đến cao</Option>
            <Option value="price-desc">Giá cao đến thấp</Option>
            <Option value="rating">Đánh giá cao nhất</Option>
            <Option value="name">Tên A-Z</Option>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;