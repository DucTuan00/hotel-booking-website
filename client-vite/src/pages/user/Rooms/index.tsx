import React, { useState, useCallback, useEffect } from "react";
import { Pagination } from "antd";
import RoomFilters from "@/pages/user/Rooms/components/RoomFilters";
import RoomGrid from "@/pages/user/Rooms/components/RoomGrid";
import Notification from "@/components/Notification";
import roomService from "@/services/rooms/roomService";
import { Message } from "@/types/message";
import "@/pages/user/Rooms/Rooms.css";
import { Room, RoomType, RoomSortField, SortOrder } from "@/types/room";

export type RoomTypeFilter = 'ALL' | RoomType;
export type SortOption = "newest" | "price-asc" | "price-desc" | "name";

const PAGE_SIZE = 6;

export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
};

// Custom hook to fetch and manage rooms from API
const useRooms = (onError: (message: Message) => void) => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterType, setFilterType] = useState<RoomTypeFilter>("ALL");
    const [sortBy, setSortBy] = useState<SortOption>("newest");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadRooms = async () => {
            setIsLoading(true);
            try {
                let sortByField: RoomSortField | undefined;
                let sortOrderValue: SortOrder | undefined;

                switch (sortBy) {
                    case "newest":
                        sortByField = 'createdAt';
                        sortOrderValue = 'desc';
                        break;
                    case "price-asc":
                        sortByField = 'price';
                        sortOrderValue = 'asc';
                        break;
                    case "price-desc":
                        sortByField = 'price';
                        sortOrderValue = 'desc';
                        break;
                    case "name":
                        sortByField = 'name';
                        sortOrderValue = 'asc';
                        break;
                }

                const response = await roomService.getActiveRooms({
                    roomType: filterType !== 'ALL' ? filterType : undefined,
                    sortBy: sortByField,
                    sortOrder: sortOrderValue,
                    page: currentPage,
                    pageSize: PAGE_SIZE,
                });
                
                setRooms(response.rooms);
                setTotal(response.total);
            } catch (error) {
                console.error("Error loading rooms:", error);
                onError({
                    type: "error",
                    text: "Không thể tải danh sách phòng. Vui lòng thử lại sau.",
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadRooms();
    }, [currentPage, filterType, sortBy, onError]);

    // Handle filter/sort changes
    const handleFilterChange = useCallback((newFilterType: RoomTypeFilter) => {
        setFilterType(newFilterType);
        setCurrentPage(1); // Reset to first page when filter changes
    }, []);

    const handleSortChange = useCallback((newSortBy: SortOption) => {
        setSortBy(newSortBy);
        setCurrentPage(1); // Reset to first page when sort changes
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return {
        rooms,
        filterType,
        sortBy,
        isLoading,
        total,
        currentPage,
        pageSize: PAGE_SIZE,
        setFilterType: handleFilterChange,
        setSortBy: handleSortChange,
        onPageChange: handlePageChange,
    };
};

const Rooms: React.FC = () => {
    const [message, setMessage] = useState<Message | null>(null);

    const {
        rooms,
        filterType,
        sortBy,
        isLoading,
        total,
        currentPage,
        pageSize,
        setFilterType,
        setSortBy,
        onPageChange,
    } = useRooms(setMessage);

    return (
        <div className="rooms-page min-h-screen bg-gray-50">
            <Notification 
                message={message} 
                onClose={() => setMessage(null)} 
            />
            
            <RoomFilters
                filterType={filterType}
                sortBy={sortBy}
                totalRooms={total}
                onFilterChange={setFilterType}
                onSortChange={setSortBy}
            />

            <RoomGrid
                rooms={rooms}
                isLoading={isLoading}
            />

            {/* Pagination */}
            {!isLoading && total > 0 && (
                <div className="flex justify-center py-8 pb-12">
                    <Pagination
                        current={currentPage}
                        total={total}
                        pageSize={pageSize}
                        onChange={onPageChange}
                        showSizeChanger={false}
                        showTotal={(total, range) => 
                            `${range[0]}-${range[1]} của ${total} phòng`
                        }
                    />
                </div>
            )}
        </div>
    );
};

export default Rooms;
