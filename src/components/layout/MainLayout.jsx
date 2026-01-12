import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import TopBar from '@/components/layout/TopBar';

const MainLayout = () => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <LeftSidebar isOpen={leftSidebarOpen} setIsOpen={setLeftSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          toggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
          toggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      <RightSidebar isOpen={rightSidebarOpen} setIsOpen={setRightSidebarOpen} />
    </div>
  );
};

export default MainLayout;