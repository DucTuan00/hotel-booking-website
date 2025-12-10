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
            <Route path="/rooms/:roomId" element={<User.RoomDetail />} />
            <Route path="/booking" element={<User.Booking />} />
            <Route path="/booking/complete" element={<User.BookingComplete />} />
            <Route path="/restaurant" element={<User.Restaurant />} />
            <Route path="/spa" element={<User.Spa />} />
            <Route path="/user/profile" element={<User.UserProfile />} />
            <Route path="/user/bookings" element={<User.UserBookings />} />
            <Route path="/user/bookings/:bookingId" element={<User.UserBookingDetail />} />
            <Route path="/ai-planner" element={<User.AIPlanner />} />
            <Route path="/mobile/category" element={<User.MobileCategory />} />
            <Route path="/mobile/account" element={<User.MobileAccount />} />
            <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<AdminRoute />}>
            <Route path="/dashboard" element={<AdminLayout />}>
                <Route index element={<Admin.DashboardPage />} />
                <Route path="users" element={<Admin.UserList />} />
                <Route path="rooms" element={<Admin.RoomList />} />
                <Route path="rooms/pricing" element={<Admin.RoomPricing />} />
                <Route path="bookings" element={<Admin.BookingList />} />
                <Route path="bookings/:bookingId" element={<Admin.BookingDetail />} />
                <Route path="reviews" element={<Admin.ReviewList />} />
                <Route path="amenities" element={<Admin.AmenityList />} />
                <Route path="restaurant" element={<Admin.RestaurantEdit />} />
                <Route path="restaurant/services" element={<Admin.RestaurantServices />} />
                <Route path="restaurant/images" element={<Admin.RestaurantImages />} />
                <Route path="restaurant/bookings" element={<Admin.RestaurantBookingList />} />
                <Route path="spa" element={<Admin.SpaEdit />} />
                <Route path="spa/services" element={<Admin.SpaServices />} />
                <Route path="spa/images" element={<Admin.SpaImages />} />
                <Route path="spa/bookings" element={<Admin.SpaBookingList />} />
                <Route path="celebration-items" element={<Admin.CelebrationItemList />} />
            </Route>
        </Route>
    </Routes>
);

export default AppRoutes;
