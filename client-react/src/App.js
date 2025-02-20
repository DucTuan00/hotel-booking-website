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
// import RoomDetail from './pages/RoomDetail';  // Ví dụ: trang chi tiết phòng

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/room/:id" element={<RoomDetail />} /> */}

        <Route path="/dashboard" element={<DashboardPage />} /> {/* admin */}
        <Route path="/dashboard/users" element={<UsersPage />} />
        <Route path="/dashboard/rooms" element={<RoomsPage />} />
        <Route path="/dashboard/bookings" element={<BookingsPage />} />
        <Route path="/dashboard/amenities" element={<AmenitiesPage />} />
      </Routes>
    </Router>
  );
}

export default App;