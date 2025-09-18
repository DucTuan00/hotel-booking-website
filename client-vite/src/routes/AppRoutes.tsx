import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/user/Home';
import SearchResults from '@/pages/user/SearchResults';
import Rooms from '@/pages/user/Rooms';
import * as Admin from '@/pages/admin';
import Login from '@/pages/Login';
import AdminLayout from '@/layouts/AdminLayout';
import AdminRoute from '@/routes/AdminRoute';
import RoomPricing from '@/pages/admin/Room/Pricing';

const AppRoutes: React.FC = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/room/:id" element={<RoomDetail />} /> */}

        {/* Protected by AdminRoute */}
        <Route element={<AdminRoute />}>
            <Route path="/dashboard" element={<AdminLayout />}>
                <Route index element={<Admin.DashboardPage />} />
                <Route path="users" element={<Admin.UserList />} />
                <Route path="rooms" element={<Admin.RoomList />} />
                <Route path="rooms/pricing" element={<RoomPricing />} />
                <Route path="bookings" element={<Admin.BookingList />} />
                <Route path="amenities" element={<Admin.AmenityList />} />
            </Route>
        </Route>
    </Routes>
);

export default AppRoutes;
