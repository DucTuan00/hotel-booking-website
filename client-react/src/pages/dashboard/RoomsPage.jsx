import React from 'react';
import AdminLayout from '../../components/admin/Layout/AdminLayout';
import RoomList from '../../components/admin/Room/RoomList';

const RoomsPage = () => {
    return (
        <AdminLayout>
            <h2>Quản lý Phòng</h2>
            <RoomList />
        </AdminLayout>
    );
};

export default RoomsPage;