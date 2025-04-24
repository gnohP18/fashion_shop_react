import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-column min-h-screen min-w-screen">
      {/* Header */}
      <Header onToggleSidebar={() => setCollapsed(!collapsed)} />

      {/* Body section */}
      <div className="flex flex-row flex-1">
        {/* Sidebar */}
        <aside
          className={`transition-all transition-duration-300 bg-primary text-white shadow-2 ${
            collapsed ? "w-4rem" : "w-16rem"
          }`}
        >
          <SideBar collapsed={collapsed} />
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-surface-0 p-5 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
