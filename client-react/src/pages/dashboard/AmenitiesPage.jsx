import React from 'react';
import AdminLayout from '../../components/admin/Layout/AdminLayout';
import AmenityList from '../../components/admin/Amenity/AmenityList';

const AmenitiesPage = () => {
    return (
        <AdminLayout>
            <h2>Quản lý Tiện nghi</h2>
            <AmenityList />
        </AdminLayout>
    );
};

export default AmenitiesPage;