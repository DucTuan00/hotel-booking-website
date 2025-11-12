import React, { useEffect } from 'react';
import { Button, Slider, Checkbox, Select, Input, Form } from 'antd';
import { COLORS, TYPOGRAPHY } from '@/config/constants';
import { formatPrice } from '@/utils/formatPrice';
import { RoomType } from '@/types/room';
import { Amenity } from '@/types/amenity';

const { Option } = Select;

interface SearchFiltersProps {
  showMobileFilter: boolean;
  priceRange: [number, number];
  selectedRoomTypes: string[];
  selectedAmenities: string[];
  sortBy: string;
  availableAmenities: Amenity[];
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
  availableAmenities,
  onPriceRangeChange,
  onRoomTypesChange,
  onAmenitiesChange,
  onSortChange,
  onClearFilters,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      priceFrom: priceRange[0],
      priceTo: priceRange[1],
    });
  }, [priceRange, form]);

  const roomTypes = Object.values(RoomType);

  const handleCustomPriceChange = () => {
    form.validateFields(['priceFrom', 'priceTo']).then(() => {
      const fromValue = form.getFieldValue('priceFrom');
      const toValue = form.getFieldValue('priceTo');
      
      if (fromValue !== undefined && toValue !== undefined) {
        onPriceRangeChange([fromValue, toValue]);
      }
    }).catch(() => {
      // Validation failed, do nothing
    });
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
            min={0}
            max={10000000}
            step={100000}
            value={priceRange}
            onChange={(value) => {
              const newRange = value as [number, number];
              form.setFieldsValue({
                priceFrom: newRange[0],
                priceTo: newRange[1],
              });
              onPriceRangeChange(newRange);
            }}
            tooltip={{
              formatter: (value) => formatPrice(value!)
            }}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2 mb-4">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>

          {/* Custom Price Inputs */}
          <Form form={form} layout="vertical">
            <div className="grid grid-cols-2 gap-2">
              <Form.Item
                label="Từ"
                name="priceFrom"
                rules={[
                  { required: true, message: 'Vui lòng nhập giá' },
                  {
                    type: 'number',
                    min: 0,
                    message: 'Giá phải lớn hơn hoặc bằng 0',
                    transform: (value) => Number(value)
                  }
                ]}
                className="mb-0"
              >
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  onBlur={handleCustomPriceChange}
                />
              </Form.Item>
              <Form.Item
                label="Đến"
                name="priceTo"
                rules={[
                  { required: true, message: 'Vui lòng nhập giá' },
                  {
                    type: 'number',
                    min: 100000,
                    max: 10000000,
                    message: 'Giá từ 100,000 đến 10,000,000',
                    transform: (value) => Number(value)
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const fromValue = getFieldValue('priceFrom');
                      if (!value || !fromValue || Number(value) >= Number(fromValue)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Giá đến phải lớn hơn giá từ'));
                    },
                  }),
                ]}
                className="mb-0"
              >
                <Input
                  type="number"
                  min={100000}
                  max={10000000}
                  placeholder="10,000,000"
                  onBlur={handleCustomPriceChange}
                />
              </Form.Item>
            </div>
          </Form>
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
              {availableAmenities.map((amenity) => (
                <div key={amenity.id}>
                  <Checkbox value={amenity.name}>{amenity.name}</Checkbox>
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
            <Option value="name">Tên A-Z</Option>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;