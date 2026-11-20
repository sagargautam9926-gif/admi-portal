
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#F1F6FD] flex flex-col md:flex-row">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 bg-[#F1F6FD]">

        <Topbar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;
