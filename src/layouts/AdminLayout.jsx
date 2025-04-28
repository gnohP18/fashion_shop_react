import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import { useDispatch } from "react-redux";
import { fetchStatisticSetting } from "../store/slices/settingSlice";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStatisticSetting());
  }, [dispatch]);

  return (
    <div className="flex flex-column h-full w-full">
      {/* Header */}
      <Header onToggleSidebar={() => setCollapsed(!collapsed)} />

      {/* Body section */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`transition-all transition-duration-300 bg-primary text-white shadow-2 ${
            collapsed ? "w-4rem" : "w-16rem"
          }`}
        >
          <SideBar collapsed={collapsed} />
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-surface-0 px-3 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
