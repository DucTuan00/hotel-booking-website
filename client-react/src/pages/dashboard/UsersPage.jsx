import React from 'react';
import AdminLayout from '../../components/admin/Layout/AdminLayout';
import UserList from '../../components/admin/User/UserList';

const UsersPage = () => {
  return (
    <AdminLayout>
      <h2>Quản lý Users</h2>
      <UserList />
    </AdminLayout>
  );
};

export default UsersPage;