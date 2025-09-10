import React, { useState } from 'react';
import { Button, DatePicker, InputNumber, Select, Slider, Checkbox, Rate, Pagination } from 'antd';
import { FilterOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import UserLayout from '@/layouts/UserLayout';
import { COLORS, TYPOGRAPHY, DEMO_IMAGES } from '@/config/constants';
import { useIntersectionObserver } from '@/utils/useIntersectionObserver';
import '@/pages/user/SearchResults/SearchResults.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface Room {
    id: number;
    name: string;
    type: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    image: string;
    amenities: string[];
    size: number;
    bedType: string;
    maxGuests: number;
    discount?: number;
    isFavorite?: boolean;
}

const mockRooms: Room[] = [
    {
        id: 1,
        name: 'Superior Double Ocean View',
        type: 'Superior',
        price: 2500000,
        originalPrice: 3000000,
        rating: 4.8,
        reviews: 124,
        image: DEMO_IMAGES.hero,
        amenities: ['WiFi miễn phí', 'Điều hòa', 'TV', 'Mini Bar', 'View biển'],
        size: 35,
        bedType: 'Giường đôi',
        maxGuests: 2,
        discount: 17,
        isFavorite: false,
    },
    {
        id: 2,
        name: 'Deluxe Family Suite',
        type: 'Deluxe',
        price: 4200000,
        rating: 4.9,
        reviews: 89,
        image: DEMO_IMAGES.familySuite,
        amenities: ['WiFi miễn phí', 'Điều hòa', 'TV', 'Bếp nhỏ', 'Phòng tắm riêng'],
        size: 55,
        bedType: '2 giường đôi',
        maxGuests: 4,
        isFavorite: true,
    },
    {
        id: 3,
        name: 'Standard Twin Room',
        type: 'Standard',
        price: 1800000,
        originalPrice: 2200000,
        rating: 4.6,
        reviews: 201,
        image: DEMO_IMAGES.lionBoutique,
        amenities: ['WiFi miễn phí', 'Điều hòa', 'TV', 'Minibar'],
        size: 28,
        bedType: '2 giường đơn',
        maxGuests: 2,
        discount: 18,
        isFavorite: false,
    },
    {
        id: 4,
        name: 'Royal Suite Premium',
        type: 'Suite',
        price: 6500000,
        rating: 5.0,
        reviews: 45,
        image: DEMO_IMAGES.lionWestlake,
        amenities: ['WiFi miễn phí', 'Điều hòa', 'TV', 'Jacuzzi', 'Butler service', 'View toàn cảnh'],
        size: 85,
        bedType: 'Giường King',
        maxGuests: 2,
        isFavorite: false,
    },
];

const SearchResults: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>(mockRooms);
    const [currentPage, setCurrentPage] = useState(1);
    const [priceRange, setPriceRange] = useState<[number, number]>([1000000, 7000000]);
    const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState('price-asc');
    const [showMobileFilter, setShowMobileFilter] = useState(false);

    const { elementRef: pageRef, isVisible: pageVisible } = useIntersectionObserver();

    const roomTypes = ['Standard', 'Superior', 'Deluxe', 'Suite'];
    const amenities = ['WiFi miễn phí', 'Điều hòa', 'TV', 'Mini Bar', 'View biển', 'Bếp nhỏ', 'Jacuzzi'];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const toggleFavorite = (roomId: number) => {
        setRooms(rooms.map(room =>
            room.id === roomId ? { ...room, isFavorite: !room.isFavorite } : room
        ));
    };

    const filterRooms = () => {
        return rooms.filter(room => {
            const priceInRange = room.price >= priceRange[0] && room.price <= priceRange[1];
            const typeMatch = selectedRoomTypes.length === 0 || selectedRoomTypes.includes(room.type);
            const amenityMatch = selectedAmenities.length === 0 ||
                selectedAmenities.some(amenity => room.amenities.includes(amenity));

            return priceInRange && typeMatch && amenityMatch;
        });
    };

    const sortRooms = (rooms: Room[]) => {
        const sorted = [...rooms];
        switch (sortBy) {
            case 'price-asc':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return sorted.sort((a, b) => b.price - a.price);
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            default:
                return sorted;
        }
    };

    const filteredAndSortedRooms = sortRooms(filterRooms());

    return (
        <UserLayout headerTransparent={false}>
            <div
                ref={pageRef}
                className={`search-results-page min-h-screen bg-gray-50 pt-20 transition-all duration-800 ${pageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
            >
                {/* Search Header */}
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
                                    Tìm thấy {filteredAndSortedRooms.length} phòng phù hợp • 15-17 Tháng 9, 2025 • 2 khách
                                </p>
                            </div>

                            {/* Mobile Filter Button */}
                            <Button
                                icon={<FilterOutlined />}
                                onClick={() => setShowMobileFilter(!showMobileFilter)}
                                className="lg:hidden"
                                style={{ borderColor: COLORS.primary, color: COLORS.primary }}
                            >
                                Bộ lọc
                            </Button>
                        </div>

                        {/* Quick Search Bar */}
                        <div className="mt-6 bg-gray-50 rounded-lg p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ngày nhận - trả phòng
                                    </label>
                                    <RangePicker
                                        size="large"
                                        className="w-full"
                                        placeholder={['Nhận phòng', 'Trả phòng']}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số khách
                                    </label>
                                    <InputNumber
                                        size="large"
                                        min={1}
                                        max={10}
                                        defaultValue={2}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sắp xếp theo
                                    </label>
                                    <Select
                                        size="large"
                                        value={sortBy}
                                        onChange={setSortBy}
                                        className="w-full"
                                    >
                                        <Option value="price-asc">Giá: Thấp đến cao</Option>
                                        <Option value="price-desc">Giá: Cao đến thấp</Option>
                                        <Option value="rating">Đánh giá cao nhất</Option>
                                        <Option value="name">Tên A-Z</Option>
                                    </Select>
                                </div>

                                <Button
                                    type="primary"
                                    size="large"
                                    className="w-full"
                                    style={{
                                        backgroundColor: COLORS.primary,
                                        borderColor: COLORS.primary,
                                    }}
                                >
                                    Tìm lại
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex gap-8">
                        {/* Filter Sidebar */}
                        <div className={`${showMobileFilter ? 'block' : 'hidden'} lg:block w-full lg:w-80 bg-white rounded-lg shadow-sm p-6 h-fit`}>
                            <h3
                                className="text-lg font-semibold mb-6"
                                style={{
                                    fontFamily: TYPOGRAPHY.fontFamily.primary,
                                    color: COLORS.gray[900]
                                }}
                            >
                                Bộ lọc tìm kiếm
                            </h3>

                            {/* Price Range */}
                            <div className="mb-8">
                                <h4 className="font-medium mb-4 text-gray-900">Khoảng giá (VNĐ/đêm)</h4>
                                <Slider
                                    range
                                    min={1000000}
                                    max={10000000}
                                    step={100000}
                                    value={priceRange}
                                    onChange={(value) => setPriceRange(value as [number, number])}
                                    tooltip={{
                                        formatter: (value) => formatPrice(value || 0)
                                    }}
                                    trackStyle={[{ backgroundColor: COLORS.primary }]}
                                    handleStyle={[
                                        { borderColor: COLORS.primary },
                                        { borderColor: COLORS.primary }
                                    ]}
                                />
                                <div className="flex justify-between text-sm text-gray-600 mt-2">
                                    <span>{formatPrice(priceRange[0])}</span>
                                    <span>{formatPrice(priceRange[1])}</span>
                                </div>
                            </div>

                            {/* Room Type */}
                            <div className="mb-8">
                                <h4 className="font-medium mb-4 text-gray-900">Loại phòng</h4>
                                <div className="space-y-3">
                                    {roomTypes.map(type => (
                                        <Checkbox
                                            key={type}
                                            checked={selectedRoomTypes.includes(type)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedRoomTypes([...selectedRoomTypes, type]);
                                                } else {
                                                    setSelectedRoomTypes(selectedRoomTypes.filter(t => t !== type));
                                                }
                                            }}
                                        >
                                            {type}
                                        </Checkbox>
                                    ))}
                                </div>
                            </div>

                            {/* Amenities */}
                            <div className="mb-8">
                                <h4 className="font-medium mb-4 text-gray-900">Tiện nghi</h4>
                                <div className="space-y-3">
                                    {amenities.map(amenity => (
                                        <Checkbox
                                            key={amenity}
                                            checked={selectedAmenities.includes(amenity)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedAmenities([...selectedAmenities, amenity]);
                                                } else {
                                                    setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                                                }
                                            }}
                                        >
                                            {amenity}
                                        </Checkbox>
                                    ))}
                                </div>
                            </div>

                            {/* Clear Filters */}
                            <Button
                                block
                                onClick={() => {
                                    setPriceRange([1000000, 7000000]);
                                    setSelectedRoomTypes([]);
                                    setSelectedAmenities([]);
                                }}
                                className="text-gray-600 border-gray-300"
                            >
                                Xóa bộ lọc
                            </Button>
                        </div>

                        {/* Results */}
                        <div className="flex-1">
                            <div className="grid gap-6">
                                {filteredAndSortedRooms.map((room, index) => (
                                    <div
                                        key={room.id}
                                        className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 room-card`}
                                        style={{
                                            animationDelay: `${index * 100}ms`
                                        }}
                                    >
                                        <div className="flex flex-col md:flex-row">
                                            {/* Room Image */}
                                            <div className="md:w-80 h-64 md:h-auto relative">
                                                <img
                                                    src={room.image}
                                                    alt={room.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                {room.discount && (
                                                    <div
                                                        className="absolute top-4 left-4 px-2 py-1 rounded text-white text-sm font-medium"
                                                        style={{ backgroundColor: COLORS.secondary }}
                                                    >
                                                        -{room.discount}%
                                                    </div>
                                                )}
                                                <Button
                                                    type="text"
                                                    icon={room.isFavorite ? <HeartFilled /> : <HeartOutlined />}
                                                    onClick={() => toggleFavorite(room.id)}
                                                    className="absolute top-4 right-4 bg-white bg-opacity-80 hover:bg-opacity-100"
                                                    style={{
                                                        color: room.isFavorite ? COLORS.secondary : COLORS.gray[600]
                                                    }}
                                                />
                                            </div>

                                            {/* Room Details */}
                                            <div className="flex-1 p-6">
                                                <div className="flex flex-col h-full justify-between">
                                                    <div>
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div>
                                                                <h3
                                                                    className="text-xl font-semibold mb-1"
                                                                    style={{
                                                                        fontFamily: TYPOGRAPHY.fontFamily.primary,
                                                                        color: COLORS.gray[900]
                                                                    }}
                                                                >
                                                                    {room.name}
                                                                </h3>
                                                                <p className="text-gray-600 text-sm">{room.type}</p>
                                                            </div>

                                                            <div className="text-right">
                                                                <div className="flex items-center gap-1 mb-1">
                                                                    <Rate disabled defaultValue={room.rating} allowHalf className="text-sm" />
                                                                    <span className="text-sm text-gray-600">({room.reviews})</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mb-4">
                                                            <div className="flex flex-wrap gap-2 mb-3">
                                                                {room.amenities.slice(0, 4).map(amenity => (
                                                                    <span
                                                                        key={amenity}
                                                                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                                                    >
                                                                        {amenity}
                                                                    </span>
                                                                ))}
                                                                {room.amenities.length > 4 && (
                                                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                                                        +{room.amenities.length - 4} tiện nghi
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                                <span>📐 {room.size}m²</span>
                                                                <span>🛏️ {room.bedType}</span>
                                                                <span>👥 {room.maxGuests} khách</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-end justify-between">
                                                        <div>
                                                            {room.originalPrice && (
                                                                <span className="text-sm text-gray-400 line-through block">
                                                                    {formatPrice(room.originalPrice)}
                                                                </span>
                                                            )}
                                                            <div className="flex items-baseline gap-2">
                                                                <span
                                                                    className="text-2xl font-bold"
                                                                    style={{ color: COLORS.primary }}
                                                                >
                                                                    {formatPrice(room.price)}
                                                                </span>
                                                                <span className="text-gray-600 text-sm">/đêm</span>
                                                            </div>
                                                        </div>

                                                        <Button
                                                            type="primary"
                                                            size="large"
                                                            className="px-8"
                                                            style={{
                                                                backgroundColor: COLORS.primary,
                                                                borderColor: COLORS.primary,
                                                                fontFamily: TYPOGRAPHY.fontFamily.secondary,
                                                            }}
                                                        >
                                                            Đặt ngay
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="mt-12 flex justify-center">
                                <Pagination
                                    current={currentPage}
                                    total={filteredAndSortedRooms.length}
                                    pageSize={10}
                                    onChange={setCurrentPage}
                                    showSizeChanger={false}
                                    showQuickJumper
                                    showTotal={(total, range) =>
                                        `${range[0]}-${range[1]} trong ${total} kết quả`
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
};

export default SearchResults;
