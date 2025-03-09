import React from 'react';
import {
  UserIcon,
  HomeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

const DashboardPage = () => {
  // Dữ liệu thống kê mẫu (thay bằng API call sau)
  const totalUsers = 150;
  const totalRooms = 50;
  const totalBookings = 320;
  const expectedRevenue = 55000;

  const stats = [
    {
      title: 'Tổng số Users',
      value: totalUsers,
      icon: UserIcon,
    },
    {
      title: 'Tổng số Rooms',
      value: totalRooms,
      icon: HomeIcon,
    },
    {
      title: 'Tổng số Bookings',
      value: totalBookings,
      icon: CalendarIcon,
    },
    {
      title: 'Doanh thu dự kiến',
      value: expectedRevenue,
      icon: CurrencyDollarIcon,
      suffix: '$',
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white shadow overflow-hidden rounded-md">
            <div className="p-5">
              <div className="flex items-center">
                <div className="w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.title}
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {stat.value} {stat.suffix}
                  </dd>
                </div>
                <div className="ml-5 flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Thêm các biểu đồ, danh sách bookings mới nhất, ... ở đây */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900">Bookings gần đây</h3>
        {/* Hiển thị danh sách bookings gần đây ở đây (sử dụng Table hoặc List của Ant Design) */}
        <p className="text-gray-500">Sẽ được thêm vào sau...</p>
      </div>
    </div>
  );
};

export default DashboardPage;
