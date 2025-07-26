import React from 'react';
import Sidebar from '@/components/SidebarAdmin';
import Header from '@/components/HeaderAdmin';
import { Outlet } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  return (
    <div>
      <Header />
        <div className="flex h-screen bg-white-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white-200 p-4">
            <div className="container mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;