import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Tooltip } from 'antd';
import Notification from '@/components/Notification';
import AdminTable from '@/components/AdminTable';
import SearchTableAdmin, { SearchFilters } from '@/components/SearchTableAdmin';
import bookingService from '@/services/bookings/bookingService';
import moment from 'moment';
import { Booking, PaymentMethod } from '@/types/booking';
import type { TableColumnsType } from 'antd';
import { Message } from '@/types/message';
import { getStatusText, getStatusColor, getPaymentStatusText, getPaymentStatusColor } from '@/utils/status';

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
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<Message | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
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
        navigate(`/dashboard/bookings/${booking.id}`);
    };

    const getPaymentMethodText = (method: PaymentMethod) => {
        switch (method) {
            case PaymentMethod.ONLINE:
                return 'Online';
            case PaymentMethod.ONSITE:
                return 'Tại quầy';
            default:
                return method;
        }
    };

    const columns: TableColumnsType<Booking> = [
        {
            title: 'Mã đơn',
            dataIndex: 'id',
            key: 'id',
            width: 150,
            fixed: 'left',
            render: (id, booking) => (
                <Tooltip title={id}>
                    <span 
                        onClick={() => handleEdit(booking)}
                        className="text-blue-600 cursor-pointer hover:underline"
                    >
                        {id}
                    </span>
                </Tooltip>
            ),
        },
        {
            title: 'Khách hàng',
            key: 'customer',
            width: 150,
            render: (_, booking) => (
                <div>
                    <div style={{ fontWeight: 500 }}>
                        {booking.firstName} {booking.lastName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                        {booking.email}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                        {booking.phoneNumber}
                    </div>
                </div>
            ),
        },
        {
            title: 'Tên phòng',
            dataIndex: 'roomId',
            key: 'roomId',
            width: 150,
            render: (roomId) => getName(roomId),
        },
        {
            title: 'Check-in',
            dataIndex: 'checkIn',
            key: 'checkIn',
            render: (date) => moment(date).format('DD/MM/YYYY'),
            width: 80,
        },
        {
            title: 'Check-out',
            dataIndex: 'checkOut',
            key: 'checkOut',
            render: (date) => moment(date).format('DD/MM/YYYY'),
            width: 80,
        },
        {
            title: 'Thanh toán',
            key: 'payment',
            width: 120,
            render: (_, booking) => (
                <div>
                    <Tag color={getPaymentStatusColor(booking.paymentStatus)}>
                        {getPaymentStatusText(booking.paymentStatus)}
                    </Tag>
                    <div style={{ fontSize: '12px', color: '#888', marginTop: 4 }}>
                        {getPaymentMethodText(booking.paymentMethod)}
                    </div>
                </div>
            ),
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
            width: 100,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => date ? moment(date).format('DD/MM/YYYY HH:mm') : '-',
            width: 120,
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
                    showQuickJumper: false,
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
                scroll={{ x: 1600 }}
            />
        </>
    );
};

export default BookingList;