import React, { useState, useMemo, useCallback, useEffect } from "react";
import SearchHeader from "@/pages/user/SearchResults/components/SearchHeader";
import SearchFilters from "@/pages/user/SearchResults/components/SearchFilters";
import SearchResultsList from "@/pages/user/SearchResults/components/SearchResultsList";
import { DEMO_IMAGES } from "@/config/constants";
import "@/pages/user/SearchResults/SearchResults.css";

export interface Room {
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

export type SortOption = "price-asc" | "price-desc" | "rating" | "name";

const mockRooms: Room[] = [
    {
        id: 1,
        name: "Superior Double Ocean View",
        type: "Superior",
        price: 2500000,
        originalPrice: 3000000,
        rating: 4.8,
        reviews: 124,
        image: DEMO_IMAGES.hero,
        amenities: [
            "WiFi miễn phí",
            "Điều hòa",
            "TV màn hình phẳng",
            "Mini Bar",
            "View biển",
            "Ban công riêng",
        ],
        size: 35,
        bedType: "Giường đôi King",
        maxGuests: 2,
        discount: 17,
        isFavorite: false,
    },
    {
        id: 2,
        name: "Deluxe Family Suite",
        type: "Deluxe",
        price: 4200000,
        rating: 4.9,
        reviews: 89,
        image: DEMO_IMAGES.familySuite,
        amenities: [
            "WiFi miễn phí",
            "Điều hòa",
            "TV",
            "Bếp nhỏ",
            "Phòng tắm riêng",
        ],
        size: 55,
        bedType: "2 giường đôi",
        maxGuests: 4,
        isFavorite: true,
    },
    {
        id: 3,
        name: "Standard Twin Room",
        type: "Standard",
        price: 1800000,
        originalPrice: 2200000,
        rating: 4.6,
        reviews: 201,
        image: DEMO_IMAGES.lionBoutique,
        amenities: ["WiFi miễn phí", "Điều hòa", "TV", "Minibar"],
        size: 28,
        bedType: "2 giường đơn",
        maxGuests: 2,
        discount: 18,
        isFavorite: false,
    },
    {
        id: 4,
        name: "Royal Suite Premium",
        type: "Suite",
        price: 6500000,
        rating: 5.0,
        reviews: 45,
        image: DEMO_IMAGES.lionWestlake,
        amenities: [
            "WiFi miễn phí",
            "Điều hòa",
            "TV",
            "Jacuzzi",
            "Butler service",
            "View toàn cảnh",
        ],
        size: 85,
        bedType: "Giường King",
        maxGuests: 2,
        isFavorite: false,
    },
];

const SearchResults: React.FC = () => {
    // States
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [priceRange, setPriceRange] = useState<[number, number]>([
        1000000, 7000000,
    ]);
    const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState("price-asc");
    const [isLoading, setIsLoading] = useState(false);

    const pageSize = 8;

    // Simulate loading search results
    useEffect(() => {
        const loadResults = async () => {
            setIsLoading(true);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1200));
            setRooms(mockRooms);
            setIsLoading(false);
        };

        loadResults();
    }, []);

    const toggleFavorite = useCallback((roomId: number) => {
        setRooms((prevRooms) =>
            prevRooms.map((room) =>
                room.id === roomId
                    ? { ...room, isFavorite: !room.isFavorite }
                    : room
            )
        );
    }, []);

    const filterRooms = useCallback(
        (rooms: Room[]): Room[] => {
            return rooms.filter((room) => {
                // Price filter
                if (room.price < priceRange[0] || room.price > priceRange[1])
                    return false;

                // Room type filter
                if (
                    selectedRoomTypes.length > 0 &&
                    !selectedRoomTypes.includes(room.type)
                )
                    return false;

                // Amenities filter
                if (selectedAmenities.length > 0) {
                    const hasAllAmenities = selectedAmenities.every((amenity) =>
                        room.amenities.includes(amenity)
                    );
                    if (!hasAllAmenities) return false;
                }

                return true;
            });
        },
        [priceRange, selectedRoomTypes, selectedAmenities]
    );

    const sortRooms = useCallback(
        (rooms: Room[]): Room[] => {
            const sorted = [...rooms];
            switch (sortBy) {
                case "price-asc":
                    return sorted.sort((a, b) => a.price - b.price);
                case "price-desc":
                    return sorted.sort((a, b) => b.price - a.price);
                case "rating":
                    return sorted.sort((a, b) => b.rating - a.rating);
                case "name":
                    return sorted.sort((a, b) => a.name.localeCompare(b.name));
                default:
                    return sorted;
            }
        },
        [sortBy]
    );

    const filteredAndSortedRooms = useMemo(() => {
        return sortRooms(filterRooms(rooms));
    }, [rooms, filterRooms, sortRooms]);

    const currentRooms = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredAndSortedRooms.slice(startIndex, endIndex);
    }, [filteredAndSortedRooms, currentPage, pageSize]);

    // Handle filter changes with loading
    const handlePriceRangeChange = useCallback(
        async (newPriceRange: [number, number]) => {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 500));
            setPriceRange(newPriceRange);
            setCurrentPage(1);
            setIsLoading(false);
        },
        []
    );

    const handleRoomTypesChange = useCallback(
        async (newRoomTypes: string[]) => {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 500));
            setSelectedRoomTypes(newRoomTypes);
            setCurrentPage(1);
            setIsLoading(false);
        },
        []
    );

    const handleAmenitiesChange = useCallback(
        async (newAmenities: string[]) => {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 500));
            setSelectedAmenities(newAmenities);
            setCurrentPage(1);
            setIsLoading(false);
        },
        []
    );

    const handleSortChange = useCallback(async (newSortBy: string) => {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setSortBy(newSortBy);
        setIsLoading(false);
    }, []);

    const handleClearFilters = useCallback(() => {
        setPriceRange([1000000, 7000000]);
        setSelectedRoomTypes([]);
        setSelectedAmenities([]);
    }, []);

    return (
        <div className="search-results-page min-h-screen bg-gray-50 pt-20">
            <SearchHeader
                totalRooms={filteredAndSortedRooms.length}
                onToggleMobileFilter={() =>
                    setShowMobileFilter(!showMobileFilter)
                }
            />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex gap-8">
                    <SearchFilters
                        showMobileFilter={showMobileFilter}
                        priceRange={priceRange}
                        selectedRoomTypes={selectedRoomTypes}
                        selectedAmenities={selectedAmenities}
                        sortBy={sortBy}
                        onPriceRangeChange={handlePriceRangeChange}
                        onRoomTypesChange={handleRoomTypesChange}
                        onAmenitiesChange={handleAmenitiesChange}
                        onSortChange={handleSortChange}
                        onClearFilters={handleClearFilters}
                    />

                    <SearchResultsList
                        rooms={currentRooms}
                        allRooms={filteredAndSortedRooms}
                        currentPage={currentPage}
                        pageSize={pageSize}
                        isLoading={isLoading}
                        onPageChange={setCurrentPage}
                        onToggleFavorite={toggleFavorite}
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchResults;
