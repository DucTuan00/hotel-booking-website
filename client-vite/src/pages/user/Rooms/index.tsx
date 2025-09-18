import React, { useState, useMemo, useCallback, useEffect } from 'react';
import UserLayout from '@/layouts/UserLayout';
import RoomFilters from '@/pages/user/Rooms/components/RoomFilters';
import RoomGrid from '@/pages/user/Rooms/components/RoomGrid';
import RoomModal from '@/pages/user/Rooms/components/RoomModal';
import { DEMO_IMAGES } from '@/config/constants';
import '@/pages/user/Rooms/Rooms.css';

export interface Room {
  id: number;
  name: string;
  type: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  images: string[];
  amenities: string[];
  description: string;
  size: number;
  bedType: string;
  maxGuests: number;
  discount?: number;
  isFavorite?: boolean;
  availability: 'available' | 'limited' | 'unavailable';
}

export type RoomType = 'all' | 'standard' | 'superior' | 'deluxe' | 'suite' | 'junior suite' | 'executive';
export type SortOption = 'price-asc' | 'price-desc' | 'rating' | 'name';

const mockRooms: Room[] = [
  {
    id: 1,
    name: 'Superior Double Ocean View',
    type: 'Superior',
    price: 2500000,
    originalPrice: 3000000,
    rating: 4.8,
    reviews: 124,
    images: [DEMO_IMAGES.hero, DEMO_IMAGES.lionBoutique, DEMO_IMAGES.lionWestlake],
    amenities: ['WiFi miễn phí', 'Điều hòa', 'TV màn hình phẳng', 'Mini Bar', 'View biển', 'Ban công riêng'],
    description: 'Phòng Superior với view biển tuyệt đẹp, thiết kế sang trọng và đầy đủ tiện nghi hiện đại.',
    size: 35,
    bedType: 'Giường đôi King',
    maxGuests: 2,
    discount: 17,
    isFavorite: false,
    availability: 'available',
  },
  {
    id: 2,
    name: 'Deluxe Family Suite',
    type: 'Deluxe',
    price: 4200000,
    rating: 4.9,
    reviews: 89,
    images: [DEMO_IMAGES.familySuite, DEMO_IMAGES.spa, DEMO_IMAGES.hero],
    amenities: ['WiFi miễn phí', 'Điều hòa', 'TV màn hình phẳng', 'Bếp nhỏ', 'Phòng tắm riêng', 'Phòng khách riêng'],
    description: 'Suite rộng rãi dành cho gia đình với không gian sống thoải mái và đầy đủ tiện nghi.',
    size: 55,
    bedType: '2 giường đôi',
    maxGuests: 4,
    isFavorite: true,
    availability: 'limited',
  },
  {
    id: 3,
    name: 'Standard Twin Room',
    type: 'Standard',
    price: 1800000,
    originalPrice: 2200000,
    rating: 4.6,
    reviews: 201,
    images: [DEMO_IMAGES.lionBoutique, DEMO_IMAGES.hero, DEMO_IMAGES.spa],
    amenities: ['WiFi miễn phí', 'Điều hòa', 'TV màn hình phẳng', 'Minibar', 'Két an toàn'],
    description: 'Phòng Standard với 2 giường đơn, phù hợp cho bạn bè hoặc đồng nghiệp đi công tác.',
    size: 28,
    bedType: '2 giường đơn',
    maxGuests: 2,
    discount: 18,
    isFavorite: false,
    availability: 'available',
  },
  {
    id: 4,
    name: 'Royal Suite Premium',
    type: 'Suite',
    price: 6500000,
    rating: 5.0,
    reviews: 45,
    images: [DEMO_IMAGES.lionWestlake, DEMO_IMAGES.spa, DEMO_IMAGES.hero],
    amenities: ['WiFi miễn phí', 'Điều hòa', 'TV màn hình phẳng', 'Jacuzzi', 'Butler service', 'View toàn cảnh', 'Phòng khách riêng'],
    description: 'Suite cao cấp nhất với dịch vụ butler 24/7 và view toàn cảnh thành phố tuyệt đẹp.',
    size: 85,
    bedType: 'Giường King',
    maxGuests: 2,
    isFavorite: false,
    availability: 'available',
  },
  {
    id: 5,
    name: 'Junior Suite Garden View',
    type: 'Junior Suite',
    price: 3200000,
    originalPrice: 3800000,
    rating: 4.7,
    reviews: 67,
    images: [DEMO_IMAGES.spa, DEMO_IMAGES.lionBoutique, DEMO_IMAGES.hero],
    amenities: ['WiFi miễn phí', 'Điều hòa', 'TV màn hình phẳng', 'Mini Bar', 'View vườn', 'Bồn tắm'],
    description: 'Junior Suite với view vườn xanh mát, không gian yên tĩnh và thư thái.',
    size: 42,
    bedType: 'Giường đôi Queen',
    maxGuests: 2,
    discount: 16,
    isFavorite: false,
    availability: 'limited',
  },
  {
    id: 6,
    name: 'Executive Room City View',
    type: 'Executive',
    price: 2800000,
    rating: 4.8,
    reviews: 156,
    images: [DEMO_IMAGES.hero, DEMO_IMAGES.lionWestlake, DEMO_IMAGES.spa],
    amenities: ['WiFi miễn phí', 'Điều hòa', 'TV màn hình phẳng', 'Máy pha cà phê', 'View thành phố', 'Bàn làm việc'],
    description: 'Phòng Executive dành cho khách doanh nhân với không gian làm việc riêng và view thành phố.',
    size: 38,
    bedType: 'Giường đôi King',
    maxGuests: 2,
    isFavorite: false,
    availability: 'available',
  },
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

export const getAvailabilityColor = (availability: string): string => {
  switch (availability) {
    case 'available': return '#52c41a';
    case 'limited': return '#faad14';
    case 'unavailable': return '#ff4d4f';
    default: return '#d9d9d9';
  }
};

export const getAvailabilityText = (availability: string): string => {
  switch (availability) {
    case 'available': return 'Còn phòng';
    case 'limited': return 'Sắp hết';
    case 'unavailable': return 'Hết phòng';
    default: return 'Không rõ';
  }
};

// Custom hook moved from hooks/useRooms.ts
const useRooms = (initialRooms: Room[]) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filterType, setFilterType] = useState<RoomType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('price-asc');
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading rooms data
  useEffect(() => {
    const loadRooms = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRooms(initialRooms);
      setIsLoading(false);
    };

    loadRooms();
  }, [initialRooms]);

  const toggleFavorite = useCallback((roomId: number) => {
    setRooms(prevRooms => prevRooms.map(room => 
      room.id === roomId ? { ...room, isFavorite: !room.isFavorite } : room
    ));
  }, []);

  const filterRooms = useCallback((rooms: Room[]): Room[] => {
    return rooms.filter(room => {
      if (filterType === 'all') return true;
      return room.type.toLowerCase() === filterType.toLowerCase();
    });
  }, [filterType]);

  const sortRooms = useCallback((rooms: Room[]): Room[] => {
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
  }, [sortBy]);

  const filteredAndSortedRooms = useMemo(() => {
    return sortRooms(filterRooms(rooms));
  }, [rooms, filterRooms, sortRooms]);

  // Handle filter/sort changes with loading
  const handleFilterChange = useCallback(async (newFilterType: RoomType) => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setFilterType(newFilterType);
    setIsLoading(false);
  }, []);

  const handleSortChange = useCallback(async (newSortBy: SortOption) => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    setSortBy(newSortBy);
    setIsLoading(false);
  }, []);

  return {
    rooms,
    filteredAndSortedRooms,
    filterType,
    sortBy,
    isLoading,
    setFilterType: handleFilterChange,
    setSortBy: handleSortChange,
    toggleFavorite,
  };
};

const Rooms: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const {
    filteredAndSortedRooms,
    filterType,
    sortBy,
    isLoading,
    setFilterType,
    setSortBy,
    toggleFavorite,
  } = useRooms(mockRooms);

  const showRoomDetails = (room: Room) => {
    setSelectedRoom(room);
    setIsModalVisible(true);
  };

  const handleBookRoom = (room: Room) => {
    // TODO: Implement booking logic
    console.log('Booking room:', room.name);
    setIsModalVisible(false);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedRoom(null);
  };

  return (
    <UserLayout headerTransparent={false}>
      <div className="rooms-page min-h-screen bg-gray-50 pt-20">
        <RoomFilters
          filterType={filterType}
          sortBy={sortBy}
          totalRooms={filteredAndSortedRooms.length}
          onFilterChange={setFilterType}
          onSortChange={setSortBy}
        />

        <RoomGrid
          rooms={filteredAndSortedRooms}
          isLoading={isLoading}
          onToggleFavorite={toggleFavorite}
          onShowDetails={showRoomDetails}
          onBookRoom={handleBookRoom}
        />

        <RoomModal
          room={selectedRoom}
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          onBookRoom={handleBookRoom}
        />
      </div>
    </UserLayout>
  );
};

export default Rooms;
