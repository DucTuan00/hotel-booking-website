import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Typography,
  Tag,
  Segmented,
  Tooltip,
} from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  CalendarOutlined,
  DollarCircleOutlined,
} from '@ant-design/icons';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';
import userService from '@/services/users/userService';
import roomService from '@/services/rooms/roomService';
import bookingService from '@/services/bookings/bookingService';
import { Booking as ApiBooking, BookingStatus, PaymentMethod } from '@/types/booking';
import { getStatusText, getStatusColor, getPaymentStatusText, getPaymentStatusColor } from '@/utils/status'; 

const { Title } = Typography;

// Filter period type
type FilterPeriod = 'week' | 'month' | 'year' | 'all';

// Filter options for Segmented component
const FILTER_OPTIONS = [
  { label: 'Tuần này', value: 'week' },
  { label: 'Tháng này', value: 'month' },
  { label: 'Năm nay', value: 'year' },
  { label: 'Tất cả', value: 'all' },
];

// Helper to get date range based on filter period
const getDateRange = (period: FilterPeriod): { start: Date; end: Date } | null => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (period) {
    case 'week': {
      // Get start of current week (Monday)
      const dayOfWeek = today.getDay();
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Monday start
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - diff);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      return { start: startOfWeek, end: endOfWeek };
    }
    case 'month': {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      return { start: startOfMonth, end: endOfMonth };
    }
    case 'year': {
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      const endOfYear = new Date(today.getFullYear(), 11, 31);
      endOfYear.setHours(23, 59, 59, 999);
      return { start: startOfYear, end: endOfYear };
    }
    case 'all':
    default:
      return null;
  }
};

// Helper to check if a booking falls within the date range (based on checkOut date for revenue)
const isBookingInRange = (booking: ApiBooking, dateRange: { start: Date; end: Date } | null): boolean => {
  if (!dateRange) return true;
  const checkOutDate = new Date(booking.checkOut);
  return checkOutDate >= dateRange.start && checkOutDate <= dateRange.end;
};

// Helper to check if a booking was created within the date range
const isBookingCreatedInRange = (booking: ApiBooking, dateRange: { start: Date; end: Date } | null): boolean => {
  if (!dateRange) return true;
  // Use createdAt if available, otherwise fallback to checkIn date
  const dateToCheck = booking.createdAt ? new Date(booking.createdAt) : new Date(booking.checkIn);
  return dateToCheck >= dateRange.start && dateToCheck <= dateRange.end;
};

// Type definitions
interface RevenueChartData {
  name: string;
  revenue: number;
}
interface StatusChartData {
  name: string;
  value: number;
}

// Map Ant Design color names to hex colors for Pie chart
const STATUS_COLOR_MAP: { [key: string]: string } = {
  green: '#52c41a',
  orange: '#faad14',
  red: '#f5222d',
  blue: '#1890ff',
  default: '#d9d9d9',
  magenta: '#eb2f96',
};

// Get hex color for a booking status
const getStatusHexColor = (status: BookingStatus): string => {
  const colorName = getStatusColor(status);
  return STATUS_COLOR_MAP[colorName] || STATUS_COLOR_MAP.default;
};

// Helper to get room display name from roomId field
function getRoomName(roomId: ApiBooking['roomId']): string {
  if (!roomId) return 'N/A';
  if (typeof roomId === 'string') return roomId;
  return roomId.name || 'N/A';
}

const DashboardPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalRooms, setTotalRooms] = useState<number>(0);
  const [allBookings, setAllBookings] = useState<ApiBooking[]>([]);
  const [recentBookings, setRecentBookings] = useState<ApiBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('week');

  // Clean up URL after successful login
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const authParam = searchParams.get('auth');

    if (authParam === 'success') {
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location.search, location.pathname]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get total users
      const users = await userService.getAllUsers({ pageSize: 0 });
      setTotalUsers(users.total ?? 0);

      // Get total rooms
      const rooms = await roomService.getAllRooms({ pageSize: 0 });
      setTotalRooms(rooms.total ?? 0);

      // Get all bookings
      const bookingsData = await bookingService.getAllBookings({ pageSize: 0 });
      setAllBookings(bookingsData.bookings);

      // Get 5 first booking data (simple slice)
      setRecentBookings(bookingsData.bookings.slice(0, 5));
    } catch (error) {
      console.error('Failed getting data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Memoized calculations based on filter period
  const { totalBookings, actualRevenue, revenueData, statusData } = useMemo(() => {
    const dateRange = getDateRange(filterPeriod);
    
    // Filter bookings by creation date for total count
    const bookingsInRange = allBookings.filter((booking) => 
      isBookingCreatedInRange(booking, dateRange)
    );
    
    // Filter completed bookings by checkout date for revenue
    const completedBookings = allBookings.filter(
      (booking) => booking.status === BookingStatus.CHECKED_OUT && isBookingInRange(booking, dateRange)
    );
    
    // Calculate total revenue
    const totalRevenue = completedBookings.reduce(
      (sum, booking) => sum + booking.totalPrice,
      0
    );

    // Generate revenue chart data based on filter period
    let chartData: RevenueChartData[] = [];
    
    if (filterPeriod === 'week') {
      // Show 7 days of the week
      const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
      const revenueByDay: { [key: number]: number } = {};
      for (let i = 0; i < 7; i++) {
        revenueByDay[i] = 0;
      }
      
      completedBookings.forEach((booking) => {
        const checkOutDate = new Date(booking.checkOut);
        const dayOfWeek = checkOutDate.getDay();
        // Convert Sunday (0) to 6, Monday (1) to 0, etc.
        const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        revenueByDay[adjustedDay] += booking.totalPrice;
      });
      
      chartData = dayNames.map((name, index) => ({
        name,
        revenue: revenueByDay[index],
      }));
    } else if (filterPeriod === 'month') {
      // Show days of the current month
      const now = new Date();
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const revenueByDay: { [key: number]: number } = {};
      for (let i = 1; i <= daysInMonth; i++) {
        revenueByDay[i] = 0;
      }
      
      completedBookings.forEach((booking) => {
        const checkOutDate = new Date(booking.checkOut);
        const day = checkOutDate.getDate();
        revenueByDay[day] += booking.totalPrice;
      });
      
      // Show every 5th day or so to avoid crowding
      chartData = Object.entries(revenueByDay).map(([day, revenue]) => ({
        name: `${day}`,
        revenue,
      }));
    } else if (filterPeriod === 'year') {
      // Year: show 12 months of current year
      const monthNames = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];
      const revenueByMonth: { [key: number]: number } = {};
      for (let i = 0; i < 12; i++) {
        revenueByMonth[i] = 0;
      }
      
      completedBookings.forEach((booking) => {
        const checkOutDate = new Date(booking.checkOut);
        const month = checkOutDate.getMonth();
        revenueByMonth[month] += booking.totalPrice;
      });
      
      chartData = monthNames.map((name, index) => ({
        name,
        revenue: revenueByMonth[index],
      }));
    } else {
      // All: show by year
      const revenueByYear: { [key: number]: number } = {};
      
      completedBookings.forEach((booking) => {
        const checkOutDate = new Date(booking.checkOut);
        const year = checkOutDate.getFullYear();
        revenueByYear[year] = (revenueByYear[year] || 0) + booking.totalPrice;
      });
      
      // Sort years and create chart data
      const sortedYears = Object.keys(revenueByYear).map(Number).sort((a, b) => a - b);
      chartData = sortedYears.map((year) => ({
        name: `${year}`,
        revenue: revenueByYear[year],
      }));
      
      // If no data, show current year with 0
      if (chartData.length === 0) {
        chartData = [{ name: `${new Date().getFullYear()}`, revenue: 0 }];
      }
    }

    // Create status chart data from filtered bookings
    const statusCount: { [key: string]: number } = bookingsInRange.reduce(
      (acc: { [key: string]: number }, booking: ApiBooking) => {
        acc[booking.status] = (acc[booking.status] || 0) + 1;
        return acc;
      }, 
      {}
    );
    const statusChartData: StatusChartData[] = Object.entries(statusCount).map(([name, value]) => ({
      name,
      value: Number(value),
    }));

    return {
      totalBookings: bookingsInRange.length,
      actualRevenue: totalRevenue,
      revenueData: chartData,
      statusData: statusChartData,
    };
  }, [allBookings, filterPeriod]);

  // Get chart title based on filter period
  const getChartTitle = (): string => {
    const now = new Date();
    switch (filterPeriod) {
      case 'week':
        return 'Doanh thu tuần này';
      case 'month':
        return `Doanh thu tháng ${now.getMonth() + 1}/${now.getFullYear()}`;
      case 'year':
        return `Doanh thu năm ${now.getFullYear()}`;
      case 'all':
        return 'Tổng doanh thu';
      default:
        return 'Doanh thu';
    }
  };

  // Get filter period label for stats
  const getFilterLabel = (): string => {
    switch (filterPeriod) {
      case 'week':
        return ' (Tuần này)';
      case 'month':
        return ' (Tháng này)';
      case 'year':
        return ' (Năm nay)';
      case 'all':
      default:
        return '';
    }
  };

  const stats = [
    { 
      title: 'Tổng số Người dùng', 
      value: totalUsers, 
      icon: <UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      color: '#1890ff'
    },
    { 
      title: 'Tổng số Phòng', 
      value: totalRooms, 
      icon: <HomeOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      color: '#52c41a'
    },
    { 
      title: `Đơn đặt phòng${getFilterLabel()}`, 
      value: totalBookings, 
      icon: <CalendarOutlined style={{ fontSize: '24px', color: '#faad14' }} />,
      color: '#faad14'
    },
    { 
      title: `Doanh thu${getFilterLabel()}`, 
      value: actualRevenue, 
      icon: <DollarCircleOutlined style={{ fontSize: '24px', color: '#f5222d' }} />,
      suffix: 'đ',
      color: '#f5222d'
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  // Helper for payment method text
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

  // Define columns for the table (matching Booking List style) (matching Booking List style)
  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: string) => (
        <Tooltip title={id}>
          <span 
            onClick={() => navigate(`/dashboard/bookings/${id}`)}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            {id.slice(0, 8)}...
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      width: 180,
      render: (_: unknown, record: ApiBooking) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {record.firstName} {record.lastName}
          </div>
          <div style={{ fontSize: '12px', color: '#888' }}>
            {record.email}
          </div>
        </div>
      ),
    },
    {
      title: 'Phòng',
      dataIndex: 'roomId',
      key: 'roomId',
      width: 150,
      render: (_: unknown, record: ApiBooking) => getRoomName(record.roomId),
    },
    {
      title: 'Check-in',
      dataIndex: 'checkIn',
      key: 'checkIn',
      width: 100,
      render: (checkIn: string) => new Date(checkIn).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Check-out',
      dataIndex: 'checkOut',
      key: 'checkOut',
      width: 100,
      render: (checkOut: string) => new Date(checkOut).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thanh toán',
      key: 'payment',
      width: 130,
      render: (_: unknown, record: ApiBooking) => (
        <div>
          <Tag 
            color={getPaymentStatusColor(record.paymentStatus)}
            className="!text-sm"
          >
            {getPaymentStatusText(record.paymentStatus)}
          </Tag>
          <div style={{ fontSize: '12px', color: '#888', marginTop: 4 }}>
            {getPaymentMethodText(record.paymentMethod)}
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: BookingStatus) => (
        <Tag 
          color={getStatusColor(status)}
          className="!text-sm"
        >
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : '-',
    },
  ];

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <Title level={2} style={{ margin: 0 }}>Dashboard</Title>
        <Segmented
          options={FILTER_OPTIONS}
          value={filterPeriod}
          onChange={(value) => setFilterPeriod(value as FilterPeriod)}
        />
      </div>
      
      {/* Main stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={<span style={{ fontWeight: 600, color: 'black' }}>{stat.title}</span>}
                value={stat.value}
                prefix={stat.icon}
                suffix={stat.suffix}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Chart and Recent Bookings */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {/* Revenue Chart */}
        <Col xs={24} lg={12}>
          <Card 
            title={getChartTitle()} 
            style={{ height: '400px' }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1890ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1890ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#8c8c8c', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#8c8c8c', fontSize: 12 }}
                  tickFormatter={(value) => value >= 1000000 ? `${(value / 1000000).toFixed(0)}M` : value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value}
                />
                <RechartsTooltip 
                  formatter={(value) => [`${Number(value).toLocaleString('vi-VN')} đ`, 'Doanh thu']}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e8e8e8',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#1890ff" 
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                  dot={{ fill: '#1890ff', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#1890ff', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Status bookings chart */}
        <Col xs={24} lg={12}>
          <Card title={`Trạng thái đặt phòng${getFilterLabel()}`} style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent, cx, cy, midAngle, outerRadius }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = outerRadius * 1.35;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    const statusText = getStatusText(name as BookingStatus);
                    // Use black text for CHECKED_OUT (gray fill), otherwise use the status color
                    const textColor = name === BookingStatus.CHECKED_OUT 
                      ? '#000000' 
                      : getStatusHexColor(name as BookingStatus);
                    
                    return (
                      <text
                        x={x}
                        y={y}
                        fill={textColor}
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                        fontSize={12}
                      >
                        {`${statusText} ${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry) => (
                    <Cell 
                      key={`cell-${entry.name}`} 
                      fill={getStatusHexColor(entry.name as BookingStatus)} 
                    />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value, name) => [value, getStatusText(name as BookingStatus)]}
                />
                <Legend 
                  formatter={(value) => (
                    <span style={{ color: '#000000' }}>
                      {getStatusText(value as BookingStatus)}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Recent bookings list */}
      <div style={{ marginTop: '8px' }}>
        <Title level={4} style={{ marginBottom: '16px' }}>Đơn đặt phòng gần đây</Title>
        <Table
          dataSource={recentBookings}
          columns={columns}
          rowKey="id"
          pagination={false}
          scroll={{ x: 1000 }}
          style={{ 
            border: '1px solid #f0f0f0', 
            borderRadius: '8px',
          }}
        />
      </div>
    </div>
  );
};

export default DashboardPage;