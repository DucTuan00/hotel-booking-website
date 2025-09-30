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
import { LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import LoadingSpinner from '@/components/LoadingSpinner';
import userService from '@/services/users/userService';
import roomService from '@/services/rooms/roomService';
import bookingService from '@/services/bookings/bookingService';
import { Booking as ApiBooking, BookingStatus } from '@/types/booking';

const { Title } = Typography;

// Type definitions
// (No need for DashboardUser, DashboardRoom, DashboardBooking)
interface RevenueChartData {
  name: string;
  revenue: number;
}
interface StatusChartData {
  name: string;
  value: number;
}

// Helper to get name from id or populated object
function getName(val: string | { name?: string } | null | undefined): string {
  if (val && typeof val === 'object' && 'name' in val) {
    return val.name ?? '';
  }
  return '';
}

const DashboardPage: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalRooms, setTotalRooms] = useState<number>(0);
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [actualRevenue, setActualRevenue] = useState<number>(0);
  const [recentBookings, setRecentBookings] = useState<ApiBooking[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueChartData[]>([]);
  const [statusData, setStatusData] = useState<StatusChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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

      // Calculate revenue from confirmed bookings
      const confirmedBookings: ApiBooking[] = bookingsData.bookings.filter(
        (booking: ApiBooking) => booking.status === BookingStatus.COMPLETED
      );
      const totalRevenue = confirmedBookings.reduce(
        (sum, booking) => sum + booking.totalPrice,
        0
      );
      setActualRevenue(totalRevenue);

      // Create data for revenue chart
      const revenueByMonth: { [key: string]: number } = {};
      confirmedBookings.forEach((booking) => {
        const month = new Date(booking.checkIn).toLocaleString('default', { month: 'short' });
        revenueByMonth[month] = (revenueByMonth[month] || 0) + booking.totalPrice;
      });
      const revenueChartData: RevenueChartData[] = Object.entries(revenueByMonth).map(([name, revenue]) => ({
        name,
        revenue: Number(revenue),
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
      render: (userId: string | { name?: string }) => getName(userId),
    },
    {
      title: 'Phòng',
      dataIndex: 'roomId',
      key: 'roomId',
      render: (roomId: string | { name?: string }) => getName(roomId),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'checkIn',
      key: 'checkIn',
      render: (checkIn: string) => new Date(checkIn).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: BookingStatus) => {
        const color = status === BookingStatus.COMPLETED ? 'green' : 
                     status === BookingStatus.CONFIRMED ? 'blue' : 
                     status === BookingStatus.REJECTED ? 'gray' : 
                     status === BookingStatus.PENDING ? 'orange' : 'red';
        return <Tag color={color}>{status}</Tag>;
      },
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
          <Card title="Doanh thu theo tháng" style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${Number(value).toLocaleString('vi-VN')} đ`, 'Doanh thu']} />
                <Line type="monotone" dataKey="revenue" stroke="#1890ff" strokeWidth={2} />
              </LineChart>
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
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
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