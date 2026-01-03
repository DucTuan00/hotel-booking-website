import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Typography,
  Tag,
} from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  CalendarOutlined,
  DollarCircleOutlined,
} from '@ant-design/icons';
import { AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { useLocation } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';
import userService from '@/services/users/userService';
import roomService from '@/services/rooms/roomService';
import bookingService from '@/services/bookings/bookingService';
import { Booking as ApiBooking, BookingStatus } from '@/types/booking';
import { getStatusText, getStatusColor } from '@/utils/status'; 

const { Title } = Typography;

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
};

// Get hex color for a booking status
const getStatusHexColor = (status: BookingStatus): string => {
  const colorName = getStatusColor(status);
  return STATUS_COLOR_MAP[colorName] || STATUS_COLOR_MAP.default;
};

// Helper to get user display name from userId field
function getUserName(userId: ApiBooking['userId']): string {
  if (!userId) return 'N/A';
  if (typeof userId === 'string') return userId;
  return userId.name || userId.email || 'N/A';
}

// Helper to get room display name from roomId field
function getRoomName(roomId: ApiBooking['roomId']): string {
  if (!roomId) return 'N/A';
  if (typeof roomId === 'string') return roomId;
  return roomId.name || 'N/A';
}

const DashboardPage: React.FC = () => {
  const location = useLocation();
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalRooms, setTotalRooms] = useState<number>(0);
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [actualRevenue, setActualRevenue] = useState<number>(0);
  const [recentBookings, setRecentBookings] = useState<ApiBooking[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueChartData[]>([]);
  const [statusData, setStatusData] = useState<StatusChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

      // Get total bookings
      const bookingsData = await bookingService.getAllBookings({ pageSize: 0 });
      setTotalBookings(bookingsData.total ?? 0);

      // Get 5 first booking data (simple slice)
      setRecentBookings(bookingsData.bookings.slice(0, 5));

      // Calculate revenue from checked-out bookings (CHECKED_OUT status = completed bookings)
      const completedBookings: ApiBooking[] = bookingsData.bookings.filter(
        (booking: ApiBooking) => booking.status === BookingStatus.CHECKED_OUT
      );
      const totalRevenue = completedBookings.reduce(
        (sum, booking) => sum + booking.totalPrice,
        0
      );
      setActualRevenue(totalRevenue);

      // Create data for revenue chart (group by month from checkOut date - current year only)
      const currentYear = new Date().getFullYear();
      const currentYearBookings = completedBookings.filter((booking) => {
        const checkOutDate = new Date(booking.checkOut);
        return checkOutDate.getFullYear() === currentYear;
      });
      
      // Initialize all 12 months with 0 revenue
      const monthNames = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];
      const revenueByMonth: { [key: number]: number } = {};
      for (let i = 0; i < 12; i++) {
        revenueByMonth[i] = 0;
      }
      
      // Sum revenue by month
      currentYearBookings.forEach((booking) => {
        const checkOutDate = new Date(booking.checkOut);
        const month = checkOutDate.getMonth();
        revenueByMonth[month] += booking.totalPrice;
      });
      
      // Convert to array for chart
      const revenueChartData: RevenueChartData[] = monthNames.map((name, index) => ({
        name,
        revenue: revenueByMonth[index],
      }));
      
      setRevenueData(revenueChartData);

      // Create data for status chart
      const statusCount: { [key: string]: number } = bookingsData.bookings.reduce((acc: { [key: string]: number }, booking: ApiBooking) => {
        acc[booking.status] = (acc[booking.status] || 0) + 1;
        return acc;
      }, {});
      const statusChartData: StatusChartData[] = Object.entries(statusCount).map(([name, value]) => ({
        name,
        value: Number(value),
      }));
      setStatusData(statusChartData);
    } catch (error) {
      console.error('Failed getting data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      title: 'Tổng số Đơn đặt phòng', 
      value: totalBookings, 
      icon: <CalendarOutlined style={{ fontSize: '24px', color: '#faad14' }} />,
      color: '#faad14'
    },
    { 
      title: 'Doanh thu thực tế', 
      value: actualRevenue, 
      icon: <DollarCircleOutlined style={{ fontSize: '24px', color: '#f5222d' }} />,
      suffix: 'đ',
      color: '#f5222d'
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  // Define columns for the table
  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: 'userId',
      key: 'userId',
      render: (_: unknown, record: ApiBooking) => getUserName(record.userId),
    },
    {
      title: 'Phòng',
      dataIndex: 'roomId',
      key: 'roomId',
      render: (_: unknown, record: ApiBooking) => getRoomName(record.roomId),
    },
    {
      title: 'Check-in',
      dataIndex: 'checkIn',
      key: 'checkIn',
      render: (checkIn: string) => new Date(checkIn).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Check-out',
      dataIndex: 'checkOut',
      key: 'checkOut',
      render: (checkOut: string) => new Date(checkOut).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number) => `${quantity} phòng`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: BookingStatus) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Tổng giá',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price: number) => `${price.toLocaleString('vi-VN')} đ`,
    },
  ];

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>Dashboard</Title>
      
      {/* Main stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
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
            title={`Doanh thu năm ${new Date().getFullYear()}`} 
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
                <Tooltip 
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
          <Card title="Trạng thái đặt phòng" style={{ height: '400px' }}>
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
                <Tooltip 
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
      <Card title="Đơn đặt phòng gần đây">
        <Table
          dataSource={recentBookings}
          columns={columns}
          rowKey="id"
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
};

export default DashboardPage;