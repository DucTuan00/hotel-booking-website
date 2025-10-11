import { Routes, Route } from 'react-router-dom';
import * as Admin from '@/pages/admin';
import * as User from '@/pages/user';
import Login from '@/pages/Login';
import AdminLayout from '@/layouts/AdminLayout';
import AdminRoute from '@/routes/AdminRoute';
import UserLayout from '@/layouts/UserLayout';

const AppRoutes: React.FC = () => (
    <Routes>
        <Route element={<UserLayout />}>
            <Route path="/" element={<User.Home />} />
            <Route path="/search" element={<User.SearchResults />} />
            <Route path="/rooms" element={<User.Rooms />} />
            <Route path="/restaurant" element={<User.Restaurant />} />
            <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<AdminRoute />}>
            <Route path="/dashboard" element={<AdminLayout />}>
                <Route index element={<Admin.DashboardPage />} />
                <Route path="users" element={<Admin.UserList />} />
                <Route path="rooms" element={<Admin.RoomList />} />
                <Route path="rooms/pricing" element={<Admin.RoomPricing />} />
                <Route path="bookings" element={<Admin.BookingList />} />
                <Route path="amenities" element={<Admin.AmenityList />} />
                <Route path="restaurant" element={<Admin.RestaurantEdit />} />
                <Route path="restaurant/services" element={<Admin.RestaurantServices />} />
                <Route path="restaurant/images" element={<Admin.RestaurantImages />} />
                <Route path="spa" element={<Admin.SpaEdit />} />
                <Route path="spa/services" element={<Admin.SpaServices />} />
                <Route path="spa/images" element={<Admin.SpaImages />} />
            </Route>
        </Route>
    </Routes>
);

export default AppRoutes;
