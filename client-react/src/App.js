import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import DashboardPage from './pages/dashboard/DashboardPage';
import UsersPage from './pages/dashboard/UsersPage';
import RoomsPage from './pages/dashboard/RoomsPage';
import BookingsPage from './pages/dashboard/BookingsPage';
import AmenitiesPage from './pages/dashboard/AmenitiesPage';
import Login from './pages/Login';
import AdminLayout from './components/admin/Layout/AdminLayout';
import AdminRoute from './components/admin/AdminRoute';
// import RoomDetail from './pages/RoomDetail';  // Ví dụ: trang chi tiết phòng

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/room/:id" element={<RoomDetail />} /> */}

        {/* Protected by AdminRoute */}
        <Route element={<AdminRoute />}>
          {/* Đặt AdminLayout bên ngoài và áp dụng cho từng route con */}
          <Route path="/dashboard">
            <Route index element={<AdminLayout><DashboardPage /></AdminLayout>} />
            <Route path="users" element={<AdminLayout><UsersPage /></AdminLayout>} />
            <Route path="rooms" element={<AdminLayout><RoomsPage /></AdminLayout>} />
            <Route path="bookings" element={<AdminLayout><BookingsPage /></AdminLayout>} />
            <Route path="amenities" element={<AdminLayout><AmenitiesPage /></AdminLayout>} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;