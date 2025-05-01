import { Card } from "primereact/card";
import { useEffect, useRef, useState } from "react";
import {
  getStatisticSetting,
  updateStatisticSetting,
} from "../../services/setting";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import Swal from "sweetalert2";
import { showErrorToasts } from "../../utils/toast";
import { handleFormatError } from "../../utils/errorHandler";
import { Toast } from "primereact/toast";
import { displayChartMode } from "../../constants/common";

const screenName = "Hiển thị báo cáo";

const StatisticSetting = () => {
  document.title = screenName;
  const toast = useRef(null);

  const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [topSeller, setTopSeller] = useState();
  const [recentOrder, setRecentOrder] = useState();
  const [saleRevenue, setSaleRevenue] = useState();

  useEffect(() => {
    getStatisticSetting().then((res) => {
      setTopSeller(res.data.topSeller);
      setRecentOrder(res.data.recentOrder);
      setSaleRevenue(res.data.saleRevenue);
    });
  }, []);

  const onSubmit = () => {
    const data = {
      recentOrder,
      topSeller,
      saleRevenue,
    };

    updateStatisticSetting(data)
      .then(() => {
        Swal.fire({
          title: "Thông báo",
          text: "Cập nhật hiển thị báo cáo thành công",
          timer: 2000,
          icon: "success",
        }).then(() => {
          window.location.reload();
        });
      })
      .catch((err) => {
        showErrorToasts(toast, handleFormatError(err));
      });
  };

  return (
    <div className="gap-2 w-full flex flex-column">
      <div className="w-full flex flex-row align-items-center justify-content-start gap-2">
        <h2>{screenName}</h2>
      </div>
      <Toast ref={toast} />

      <Card>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
          <div className="col-12 md:col-6">
            <FloatLabel className="flex flex-column gap-1">
              <span htmlFor="top_seller" className="pb-3">
                Số sản phẩm hiển thị trên biểu đồ{" "}
                <strong>Top sản phẩm bán chạy</strong>
              </span>
              <Dropdown
                id="top_seller"
                value={topSeller}
                onChange={(e) => setTopSeller(e.target.value)}
                options={options}
                placeholder="Số sản phẩm muốn hiển thị"
                className="w-full"
                aria-describedby="top_seller_helper"
              />
              <small id="top_seller_helper">
                Tuỳ chỉnh số sản phẩm sẽ cập nhật ở mục Trang chủ
              </small>
            </FloatLabel>
          </div>

          <div className="col-12 md:col-6">
            <FloatLabel className="flex flex-column gap-1">
              <span htmlFor="recent_order" className="pb-3">
                Số Đơn hàng hiển thị trên bảng <strong>Đơn hàng vừa mua</strong>
              </span>
              <Dropdown
                id="recent_order"
                value={recentOrder}
                onChange={(e) => setRecentOrder(e.target.value)}
                options={options}
                placeholder="Số sản phẩm muốn hiển thị"
                className="w-full"
              />
              <small id="recent_order_helper">
                Tuỳ chỉnh số sản phẩm sẽ cập nhật ở mục Trang chủ
              </small>
            </FloatLabel>
          </div>

          <div className="col-12 md:col-6">
            <FloatLabel className="flex flex-column gap-1">
              <span htmlFor="sale_revenue_mode" className="pb-3">
                Chế độ hiển thị doanh thu
              </span>
              <Dropdown
                id="sale_revenue_mode"
                value={saleRevenue}
                onChange={(e) => setSaleRevenue(e.target.value)}
                options={displayChartMode}
                optionLabel="name"
                optionValue="id"
                placeholder="Chế độ hiển thị biểu đồ"
                className="w-full"
              />
              <small id="sale_revenue_mode_helper">
                Tuỳ chỉnh số sản phẩm sẽ cập nhật ở mục Trang chủ
              </small>
            </FloatLabel>
          </div>
        </div>
        <div className="text-end mt-4">
          <Button onClick={onSubmit}>Cập nhật</Button>
        </div>
      </Card>
    </div>
  );
};

export default StatisticSetting;
