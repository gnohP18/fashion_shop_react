import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { OFFSET, PAGE, PER_PAGE_OPTIONS } from "../../constants/pagination";
import { getListOrder } from "../../services/order";
import { Card } from "primereact/card";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { formatVnd } from "../../utils/common";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";

const screenName = "Danh sách đơn hàng";

const Order = () => {
  const toast = useRef();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultParams = {
    Offset: parseInt(searchParams.get("Offset") || OFFSET.toString()),
    Page: parseInt(searchParams.get("Page") || PAGE.toString()),
    SortBy: searchParams.get("SortBy") || "createdAt",
    Direction: "DESC",
    KeySearch: searchParams.get("KeySearch") || null,
  };
  const [keySearch, setKeySearch] = useState("");
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [params, setParams] = useState(defaultParams);
  const [metaData, setMetaData] = useState({});
  const [orders, setOrders] = useState([]);
  const [rowClick, setRowClick] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState(null);

  const updateParams = (newParams) => {
    const merged = { ...params, ...newParams };
    setParams(merged);

    const filteredParams = Object.fromEntries(
      Object.entries(merged).filter(([_, v]) => v !== null && v !== undefined)
    );

    setSearchParams(filteredParams);
  };

  const searchByCondition = () => {
    const merged = {
      ...defaultParams,
      ...{
        keySearch,
        minDate,
        maxDate,
        maxPrice,
        minPrice,
      },
    };

    updateParams(merged);
  };

  const resetSearch = () => {
    setParams(defaultParams);
    setKeySearch("");
    navigate({
      pathname: window.location.pathname,
      search: "",
    });
  };

  const priceTemplate = (order) => {
    return <div>{formatVnd(order.totalAmount)}</div>;
  };

  const actionTemplate = (item) => {
    return (
      <div>
        <div className="flex flex-row gap-4">
          <i className="pi pi-arrow-right"></i>
        </div>
      </div>
    );
  };

  const fetchOrders = async () => {
    await getListOrder(params).then((res) => {
      setOrders(res.data);
      const newMeta = {
        ...metaData,
        currentPage: res.currentPage,
        pageSize: res.pageSize,
        total: res.total,
        lastPage: res.lastPage,
      };
      setMetaData(newMeta);
    });
  };

  useEffect(() => {
    fetchOrders({});

    return () => {};
  }, [params]);

  return (
    <div className="gap-2 w-full flex flex-column">
      <Toast ref={toast} />
      <div className="flex flex-row align-items-center">
        <h2 className="flex-1">{screenName}</h2>
      </div>

      <Card className="flex flex-column gap-2">
        <div className="flex flex-column md:flex-row md:items-end gap-3 pb-4 flex-wrap">
          <FloatLabel>
            <label htmlFor="key_search">Tìm kiếm theo tên</label>
            <InputText
              id="key_search"
              value={keySearch}
              onChange={(e) => setKeySearch(e.target.value)}
              className="w-full md:w-18rem"
            />
          </FloatLabel>

          <FloatLabel>
            <label htmlFor="min_price">Giá thấp nhất</label>
            <InputNumber
              id="min_price"
              value={minPrice}
              onValueChange={(e) => setMinPrice(e.value)}
              className="w-full md:w-18rem"
            />
          </FloatLabel>
          <FloatLabel>
            <label htmlFor="max_price">Giá cao nhất</label>
            <InputNumber
              id="max_price"
              value={maxPrice}
              onValueChange={(e) => setMaxPrice(e.value)}
              className="w-full md:w-18rem"
            />
          </FloatLabel>
          <Calendar
            id="min_date"
            placeholder="Bắt đầu từ ngày"
            value={minDate}
            onChange={(e) => setMinDate(e.value)}
            showIcon
            dateFormat="yy/mm/dd"
          />
          <Calendar
            id="min_date"
            placeholder="Cho đến ngày"
            value={maxDate}
            minDate={minDate}
            onChange={(e) => setMaxDate(e.value)}
            showIcon
            dateFormat="yy/mm/dd"
          />
        </div>
        <div className="flex flex-column md:flex-row md:items-end gap-3 pb-3 flex-wrap">
          <Button onClick={searchByCondition}>Tìm kiếm</Button>
          <Button onClick={resetSearch}>Làm mới điều kiện</Button>
        </div>
        <DataTable
          selectionMode={rowClick ? null : "checkbox"}
          selection={selectedOrders}
          onSelectionChange={(e) => setSelectedOrders(e.value)}
          dataKey="id"
          value={orders}
          tableStyle={{ minWidth: "50rem", width: "100%" }}
          rows={params.Offset}
          totalRecords={metaData.total}
          first={(params.Page - 1) * params.Offset}
          pageLinkSize={3}
          paginator
          onSort={(e) => {
            updateParams({
              SortBy: e.sortField,
            });
          }}
          rowsPerPageOptions={PER_PAGE_OPTIONS}
          onPage={(e) => {
            updateParams({
              Page: Math.floor(e.first / e.rows) + 1,
              Offset: e.rows,
            });
          }}
          lazy
        >
          {/* <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column> */}
          <Column field="id" header="ID"></Column>
          <Column field="userId" header="ID Khách hàng"></Column>
          <Column field="username" header="Khách hàng"></Column>
          <Column
            field="totalAmount"
            body={priceTemplate}
            header="Tổng tiền"
          ></Column>
          <Column field="totalItem" header="Số sản phẩm"></Column>
          <Column field="createdAt" header="Tạo lúc"></Column>
          <Column header="Hành động" body={actionTemplate}></Column>
        </DataTable>
      </Card>
    </div>
  );
};

export default Order;
