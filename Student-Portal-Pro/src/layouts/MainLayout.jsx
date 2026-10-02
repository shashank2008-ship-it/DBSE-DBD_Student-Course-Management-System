import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ToastContainer from '../components/ToastContainer';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="app-layout">
      {/* Collapsible Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <div className="app-main-wrapper">
        <Header onToggleSidebar={toggleSidebar} />
        
        <main className="app-content">
          <div className="main-container">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Toast Alerts */}

    </div>
  );
};

export default MainLayout;
