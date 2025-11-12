import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import SearchHeader from "@/pages/user/SearchResults/components/SearchHeader";
import SearchFilters from "@/pages/user/SearchResults/components/SearchFilters";
import SearchResultsList from "@/pages/user/SearchResults/components/SearchResultsList";
import roomService from "@/services/rooms/roomService";
import amenityService from "@/services/amenities/amenityService";
import { Room } from "@/types/room";
import { Amenity } from "@/types/amenity";
import "@/pages/user/SearchResults/SearchResults.css";

export type SortOption = "price-asc" | "price-desc" | "name";

const SearchResults: React.FC = () => {
    const [searchParams] = useSearchParams();
    
    // States
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [total, setTotal] = useState(0);
    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
    const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<SortOption>("price-asc");
    const [isLoading, setIsLoading] = useState(false);
    
    // Debounce ref for price filter
    const priceDebounceRef = useRef<NodeJS.Timeout | null>(null);

    const pageSize = 8;

    // Get search params from URL
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const adults = parseInt(searchParams.get('adults') || '0');
    const children = parseInt(searchParams.get('children') || '0');
    const maxGuests = adults + children;

    // Load amenities once on mount
    useEffect(() => {
        const loadAmenities = async () => {
            try {
                const amenitiesData = await amenityService.getAllAmenities({
                    page: 1,
                    pageSize: 100,
                });
                setAmenities(amenitiesData.amenities);
            } catch (error) {
                console.error('Error loading amenities:', error);
                setAmenities([]);
            }
        };

        loadAmenities();
    }, []);

    // Search rooms whenever filters change
    useEffect(() => {
        const searchRooms = async () => {
            setIsLoading(true);
            try {
                const response = await roomService.searchRooms({
                    checkIn: checkIn || undefined,
                    checkOut: checkOut || undefined,
                    guests: maxGuests > 0 ? maxGuests : undefined,
                    roomType: selectedRoomTypes.length > 0 ? selectedRoomTypes[0] : undefined,
                    minPrice: priceRange[0],
                    maxPrice: priceRange[1],
                    amenities: selectedAmenities,
                    page: currentPage,
                    pageSize,
                });
                
                setRooms(response.rooms);
                setTotal(response.total);
            } catch (error) {
                console.error('Error searching rooms:', error);
                setRooms([]);
                setTotal(0);
            } finally {
                setIsLoading(false);
            }
        };

        searchRooms();
    }, [checkIn, checkOut, maxGuests, selectedRoomTypes, priceRange, selectedAmenities, currentPage, pageSize]);

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            if (priceDebounceRef.current) {
                clearTimeout(priceDebounceRef.current);
            }
        };
    }, []);

    // Handle filter changes with debounce for price
    const handlePriceRangeChange = useCallback(
        (newPriceRange: [number, number]) => {
            // Clear existing timeout
            if (priceDebounceRef.current) {
                clearTimeout(priceDebounceRef.current);
            }

            priceDebounceRef.current = setTimeout(() => {
                setPriceRange(newPriceRange);
                setCurrentPage(1);
            }, 500);
        },
        []
    );

    const handleRoomTypesChange = useCallback(
        (newRoomTypes: string[]) => {
            setSelectedRoomTypes(newRoomTypes);
            setCurrentPage(1);
        },
        []
    );

    const handleAmenitiesChange = useCallback(
        (newAmenities: string[]) => {
            setSelectedAmenities(newAmenities);
            setCurrentPage(1);
        },
        []
    );

    const handleSortChange = useCallback((newSortBy: string) => {
        setSortBy(newSortBy as SortOption);
    }, []);

    const handleClearFilters = useCallback(() => {
        setPriceRange([0, 10000000]);
        setSelectedRoomTypes([]);
        setSelectedAmenities([]);
    }, []);

    return (
        <div className="search-results-page min-h-screen bg-gray-50 pt-20">
            <SearchHeader
                totalRooms={total}
                onToggleMobileFilter={() =>
                    setShowMobileFilter(!showMobileFilter)
                }
                searchInfo={{
                    checkIn: checkIn || undefined,
                    checkOut: checkOut || undefined,
                    adults,
                    children,
                }}
            />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex gap-8">
                    <SearchFilters
                        showMobileFilter={showMobileFilter}
                        priceRange={priceRange}
                        selectedRoomTypes={selectedRoomTypes}
                        selectedAmenities={selectedAmenities}
                        sortBy={sortBy}
                        availableAmenities={amenities}
                        onPriceRangeChange={handlePriceRangeChange}
                        onRoomTypesChange={handleRoomTypesChange}
                        onAmenitiesChange={handleAmenitiesChange}
                        onSortChange={handleSortChange}
                        onClearFilters={handleClearFilters}
                    />

                    <SearchResultsList
                        rooms={rooms}
                        allRooms={rooms}
                        currentPage={currentPage}
                        pageSize={pageSize}
                        isLoading={isLoading}
                        onPageChange={setCurrentPage}
                        total={total}
                    />
                </div>
            </div>
        </div>
    );
};

export default SearchResults;
