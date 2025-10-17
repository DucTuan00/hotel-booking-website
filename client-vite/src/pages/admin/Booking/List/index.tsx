import React, { useState, useEffect, useCallback } from 'react';
import { Tag, Button, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import BookingForm from '@/pages/admin/Booking/Form';
import Notification from '@/components/Notification';
import AdminTable from '@/components/AdminTable';
import SearchTableAdmin, { SearchFilters } from '@/components/SearchTableAdmin';
import bookingService from '@/services/bookings/bookingService';
import moment from 'moment';
import { Booking, BookingStatus } from '@/types/booking';
import type { TableColumnsType } from 'antd';
import { Message } from '@/types/message';

// Helper to get name or id from user/room, always returns string  
const getName = (val: string | { name?: string } | null | undefined): string => {
  if (val && typeof val === 'object' && 'name' in val) {
    return val.name ?? '';
  }
  if (typeof val === 'string') {
    return val;
  }
  return '';
};

const BookingList: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
    const [message, setMessage] = useState<Message | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalBookings, setTotalBookings] = useState<number>(0);
    const [currentSearchParams, setCurrentSearchParams] = useState<any>({});

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = { 
                page: currentPage, 
                pageSize: pageSize,
                ...currentSearchParams
            };

            const data = await bookingService.getAllBookings(params);
            setBookings(data.bookings as Booking[]);
            setTotalBookings(data.total ?? 0);
            setPageSize(data.pageSize ?? 5);
        } catch (error) {
            console.error("Error when fetch bookings:", error);
            setMessage({ type: 'error', text: 'Tải danh sách đặt phòng thất bại.' });
            setBookings([]);
            setTotalBookings(0);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, currentSearchParams]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleSearch = (filters: SearchFilters) => {
        setCurrentPage(1); 
        
        if (!filters.searchText || !filters.searchText.trim()) {
            setCurrentSearchParams({});
            return;
        }
        
        const searchText = filters.searchText.trim();
        const searchParams: any = {
            search: searchText  
        };
        
        setCurrentSearchParams(searchParams);
    };

    const handleEdit = (booking: Booking) => {
        setIsModalVisible(true);
        setEditingBooking(booking);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingBooking(null);
    };

    const handleFormSubmit = async (
        isLoadingFromChild: boolean,
        data: Booking | null,
        error?: unknown
    ) => {
        setLoading(isLoadingFromChild);
        if (error) {
            setMessage({ type: 'error', text: editingBooking ? 'Cập nhật đặt phòng thất bại.' : 'Thêm đặt phòng thất bại.' });
            return;
        }
        if (!isLoadingFromChild && data) {
            setMessage({ type: 'success', text: editingBooking ? 'Cập nhật đơn đặt phòng thành công!' : 'Đặt phòng đã được thêm thành công!' });
            setEditingBooking(null);
            setIsModalVisible(false);
            fetchBookings();
        }
    };

    const getStatusColor = (status: BookingStatus) => {
        switch (status) {
            case BookingStatus.CONFIRMED:
                return 'success';
            case BookingStatus.PENDING:
                return 'warning';
            case BookingStatus.REJECTED:
                return 'error';
            case BookingStatus.CANCELLED:
                return 'default';
            case BookingStatus.COMPLETED:
                return 'processing';
            default:
                return 'default';
        }
    };

    const getStatusText = (status: BookingStatus) => {
        switch (status) {
            case BookingStatus.CONFIRMED:
                return 'Đã xác nhận';
            case BookingStatus.PENDING:
                return 'Chờ xác nhận';
            case BookingStatus.REJECTED:
                return 'Đã từ chối';
            case BookingStatus.CANCELLED:
                return 'Đã hủy';
            case BookingStatus.COMPLETED:
                return 'Hoàn thành';
            default:
                return status;
        }
    };

    const columns: TableColumnsType<Booking> = [
        {
            title: 'Mã đơn',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Tên người đặt',
            dataIndex: 'userId',
            key: 'userId',
            render: (userId) => getName(userId),
        },
        {
            title: 'Tên phòng',
            dataIndex: 'roomId',
            key: 'roomId',
            render: (roomId) => getName(roomId),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
            width: 100,
        },
        {
            title: 'Check-in',
            dataIndex: 'checkIn',
            key: 'checkIn',
            render: (date) => moment(date).format('DD/MM/YYYY'),
            width: 120,
        },
        {
            title: 'Check-out',
            dataIndex: 'checkOut',
            key: 'checkOut',
            render: (date) => moment(date).format('DD/MM/YYYY'),
            width: 120,
        },
        {
            title: 'Người lớn',
            dataIndex: ['guests', 'adults'],
            key: 'adults',
            align: 'center',
            width: 100,
        },
        {
            title: 'Trẻ em',
            dataIndex: ['guests', 'children'],
            key: 'children',
            align: 'center',
            width: 100,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (price) => `${price.toLocaleString('vi-VN')}đ`,
            width: 120,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {getStatusText(status)}
                </Tag>
            ),
            width: 120,
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, booking) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(booking)}
                    >
                        Sửa
                    </Button>
                </Space>
            ),
            width: 100,
        },
    ];

    return (
        <>
            <Notification
                message={message}
                onClose={() => setMessage(null)}
            />
            
            <SearchTableAdmin
                onSearch={handleSearch}
                placeholder="Tìm kiếm theo mã đơn..."
            />

            <AdminTable<Booking>
                title="Quản lý đặt phòng"
                showAddButton={false}
                columns={columns}
                dataSource={bookings}
                loading={loading}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalBookings,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} booking`,
                    onChange: (page, size) => {
                        setCurrentPage(page);
                        if (size && size !== pageSize) {
                            setPageSize(size);
                            setCurrentPage(1);
                        }
                    },
                }}
                rowKey="id"
                scroll={{ x: 1200 }}
            />

            <BookingForm
                visible={isModalVisible}
                onCancel={handleCancel}
                onSubmit={handleFormSubmit}
                initialValues={editingBooking ?? undefined}
                loading={loading}
            />
        </>
    );
};

export default BookingList;