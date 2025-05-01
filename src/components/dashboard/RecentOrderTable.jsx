import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import { getListOrder } from "../../services/order";
import { formatVnd } from "../../utils/common";

const RecentOrderTable = ({ numberOfProduct = 3 }) => {
  const [orders, setOrders] = useState([]);
  const [metaData, setMetaData] = useState({});

  useEffect(() => {
    const params = {
      offset: numberOfProduct,
    };

    getListOrder(params).then((res) => {
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
  }, [numberOfProduct]);

  const priceTemplate = (order) => {
    return <div>{formatVnd(order.totalAmount)}</div>;
  };

  return (
    <Card className="h-full shadow-2 overflow-auto">
      <DataTable
        size="small"
        value={orders}
        rows={numberOfProduct}
        totalRecords={metaData.total}
        header="Đơn hàng vừa mua"
      >
        <Column field="id" header="ID"></Column>
        <Column field="username" header="Khách hàng"></Column>
        <Column
          field="totalAmount"
          body={priceTemplate}
          header="Số sản phẩm"
        ></Column>
        <Column field="createdAt" header="Tạo lúc"></Column>
      </DataTable>
    </Card>
  );
};

export default RecentOrderTable;
