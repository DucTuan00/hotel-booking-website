import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  CalendarIcon,
  TagIcon,
  ChartBarIcon,
  PowerIcon,
} from '@heroicons/react/24/outline';
import authService from '../../../services/authService';
import { ClipLoader } from "react-spinners";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
    { name: 'Người dùng', href: '/dashboard/users', icon: UsersIcon },
    { name: 'Phòng', href: '/dashboard/rooms', icon: HomeIcon },
    { name: 'Đơn đặt phòng', href: '/dashboard/bookings', icon: CalendarIcon },
    { name: 'Tiện nghi', href: '/dashboard/amenities', icon: TagIcon },
  ];

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      localStorage.removeItem('isAuthenticated');
      navigate('/login');
    } catch (error) {
      console.error('Lỗi khi logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 text-white w-64 flex-shrink-0 flex flex-col h-screen">
      <div className="h-16 flex items-center justify-center">
        <span className="text-lg font-semibold">Admin Panel</span>
      </div>
      <div className="px-3 flex-grow">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${location.pathname === item.href
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              <item.icon className="h-6 w-6 mr-2" aria-hidden="true" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="px-3 py-2 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white w-full justify-start"
          disabled={isLoading}
        >
          {isLoading ? (
            <ClipLoader color="#fff" size={20} /> // Display loader
          ) : (
            <>
              <PowerIcon className="h-6 w-6 mr-2" aria-hidden="true" />
              Đăng xuất
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
