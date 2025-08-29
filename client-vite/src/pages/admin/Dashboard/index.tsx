import React, { useState, useEffect } from 'react';
import {
  UserIcon,
  HomeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import userService from '@/services/userService';
import roomService from '@/services/roomService';
import bookingService from '@/services/bookingService';
import { ClipLoader } from 'react-spinners';
import { Booking as ApiBooking } from '@/types/booking';

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
        (booking: ApiBooking) => booking.status === 'Completed'
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
    { title: 'Tổng số Người dùng', value: totalUsers, icon: UserIcon },
    { title: 'Tổng số Phòng', value: totalRooms, icon: HomeIcon },
    { title: 'Tổng số Đơn đặt phòng', value: totalBookings, icon: CalendarIcon },
    { title: 'Doanh thu thực tế', value: actualRevenue.toLocaleString('vi-VN'), icon: CurrencyDollarIcon, suffix: 'đ' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <ClipLoader color="#3498db" size={50} />
        <p className="mt-4 text-gray-600 text-lg font-semibold">
          Đang tải dữ liệu...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Main stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white border border-gray-300 shadow-md overflow-hidden rounded-md">
            <div className="p-5">
              <div className="flex items-center">
                <div className="w-0 flex-1">
                  <dt className="text-md font-medium text-black-900 truncate">{stat.title}</dt>
                  <dd className="mt-1 text-3xl font-semibold text-black">
                    {stat.value} {stat.suffix}
                  </dd>
                </div>
                <div className="ml-5 flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-black-400" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart and Recent Bookings */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-4 border border-gray-300 shadow-md rounded-md">
          <h3 className="text-lg font-medium text-gray-900">Doanh thu theo tháng</h3>
          <LineChart width={500} height={300} data={revenueData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
          </LineChart>
        </div>

        {/* Status bookings chart */}
        <div className="bg-white p-4 border border-gray-300 shadow-md rounded-md">
          <h3 className="text-lg font-medium text-gray-900">Trạng thái đặt phòng</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={statusData}
              cx={200}
              cy={150}
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>

      {/* Recent bookings list */}
      <div className="mt-6 bg-white p-4 border border-gray-300 shadow-md rounded-md">
        <h3 className="text-lg font-medium text-gray-900">Đơn đặt phòng gần đây</h3>
        <table className="min-w-full divide-y divide-gray-300 mt-4">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Khách hàng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Phòng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Ngày đặt</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase">Tổng giá</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {recentBookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{getName(booking.userId)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{getName(booking.roomId)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{new Date(booking.checkIn).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{booking.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{booking.totalPrice.toLocaleString('vi-VN')} đ</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;