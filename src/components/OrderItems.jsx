import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { formatVnd } from "../utils/common";
import { EmptyUrl } from "../constants/common";
import { Button } from "primereact/button";

const OrderItems = ({ orderItems, removeOrderItem }) => {
  const imageBodyTemplate = (orderItem) => {
    return (
      <img
        src={orderItem.imageUrl ?? EmptyUrl}
        alt={orderItem.image}
        className="w-3rem shadow-2 border-round"
      />
    );
  };

  const priceBodyTemplate = (orderItem) => {
    return <p>{formatVnd(orderItem.price)}</p>;
  };

  const totalBodyTemplate = (orderItem) => {
    return (
      <p className="text-end w-full">
        {formatVnd(orderItem.price * orderItem.quantity)}
      </p>
    );
  };

  const actionTemplate = (orderItem) => {
    return (
      <Button
        icon="pi pi-times"
        rounded
        text
        severity="danger"
        aria-label="Cancel"
        onClick={() => {
          if (removeOrderItem) {
            removeOrderItem(orderItem);
          }
        }}
      />
    );
  };

  const totalOrder = orderItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const footer = () => {
    return (
      <div className="w-full text-right">{`Tổng cộng: ${formatVnd(
        totalOrder
      )}`}</div>
    );
  };

  return (
    <Card>
      <h3>Các sản phẩm đã thêm</h3>
      <DataTable
        value={orderItems}
        footer={footer}
        emptyMessage="Chưa có sản phẩm nào!"
      >
        <Column body={imageBodyTemplate}></Column>
        <Column field="productName" header="Tên"></Column>
        <Column field="quantity" header="Số lượng"></Column>
        <Column field="price" body={priceBodyTemplate} header="Giá"></Column>
        <Column body={totalBodyTemplate} header="Thành tiền"></Column>
        <Column body={actionTemplate} header="Xoá"></Column>
      </DataTable>
    </Card>
  );
};

export default OrderItems;
