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
        <Route path="/dashboard" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="rooms" element={<RoomsPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="amenities" element={<AmenitiesPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;