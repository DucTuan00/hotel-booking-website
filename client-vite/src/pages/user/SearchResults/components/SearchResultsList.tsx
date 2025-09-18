import React from 'react';
import { Pagination } from 'antd';
import SearchResultCard from './SearchResultCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Room } from '@/pages/user/SearchResults';

interface SearchResultsListProps {
  rooms: Room[];
  allRooms: Room[];
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onToggleFavorite: (roomId: number) => void;
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({
  rooms,
  allRooms,
  currentPage,
  pageSize,
  isLoading,
  onPageChange,
  onToggleFavorite,
}) => {
  if (isLoading) {
    return (
      <div className="flex-1">
        <LoadingSpinner message="Đang tìm kiếm phòng..." />
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="grid gap-6">
        {rooms.map((room: Room) => (
          <SearchResultCard
            key={room.id}
            room={room}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>

      {/* Pagination */}
      {allRooms.length > 0 && (
        <div className="mt-12 flex justify-center">
          <Pagination
            current={currentPage}
            total={allRooms.length}
            pageSize={pageSize}
            onChange={onPageChange}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} trong ${total} kết quả`
            }
          />
        </div>
      )}
    </div>
  );
};

export default SearchResultsList;