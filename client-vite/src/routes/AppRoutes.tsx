import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/user';
import * as Admin from '@/pages/admin';
import Login from '@/pages/Login';
import AdminLayout from '@/layouts/AdminLayout';
import AdminRoute from '@/routes/AdminRoute';

const AppRoutes: React.FC = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/room/:id" element={<RoomDetail />} /> */}

        {/* Protected by AdminRoute */}
        <Route element={<AdminRoute />}>
            <Route path="/dashboard" element={<AdminLayout />}>
                <Route index element={<Admin.DashboardPage />} />
                <Route path="users" element={<Admin.UserList />} />
                <Route path="rooms" element={<Admin.RoomList />} />
                <Route path="bookings" element={<Admin.BookingList />} />
                <Route path="amenities" element={<Admin.AmenityList />} />
            </Route>
        </Route>
    </Routes>
);

export default AppRoutes;
