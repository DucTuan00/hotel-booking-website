import React from 'react';
import { Pagination } from 'antd';
import SearchResultCard from './SearchResultCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Room } from '@/types/room';

interface SearchResultsListProps {
  rooms: Room[];
  allRooms: Room[];
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  total?: number; 
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({
  rooms,
  allRooms,
  currentPage,
  pageSize,
  isLoading,
  onPageChange,
  total,
}) => {
  if (isLoading) {
    return (
      <div className="flex-1">
        <LoadingSpinner message="Đang tìm kiếm phòng..." />
      </div>
    );
  }

  // Use total from props if available, otherwise fallback to allRooms length
  const totalRooms = total !== undefined ? total : allRooms.length;

  return (
    <div className="flex-1">
      <div className="grid gap-6">
        {rooms.map((room: Room) => (
          <SearchResultCard
            key={room.id}
            room={room}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalRooms > 0 && (
        <div className="mt-12 flex justify-center">
          <Pagination
            current={currentPage}
            total={totalRooms}
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