import React from "react";
import { useSelector } from "react-redux";
import SalesRevenueChart from "../../components/dashboard/SalesRevenueChart";
import TopSellerChart from "../../components/dashboard/TopSellerChart";
import RecentOrderTable from "../../components/dashboard/RecentOrderTable";

const screenName = "Tổng quan";

const Admin = () => {
  document.title = screenName;

  const settings = useSelector((state) => state.statisticSettings.data);

  return (
    <div className="w-full h-full flex flex-column gap-3 p-3">
      <div className="w-full">
        <h2 className="text-2xl m-0">{screenName}</h2>
      </div>

      <div className="grid flex-1">
        <div className="col-6">
          <SalesRevenueChart mode={settings?.saleRevenue} />
        </div>

        <div className="col-6">
          <TopSellerChart numberOfProduct={settings?.topSeller} />
        </div>

        <div className="col-6">
          <RecentOrderTable numberOfProduct={settings?.recentOrder} />
        </div>

        <div className="col-6"></div>
      </div>
    </div>
  );
};

export default Admin;
