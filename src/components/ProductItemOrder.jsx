import { Chip } from "primereact/chip";
import { EmptyUrl } from "../constants/common";
import { formatVnd } from "../utils/common";
import { InputNumber } from "primereact/inputnumber";
import { useState } from "react";
import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";

const ProductItemOrder = ({ productItem, addProductItem }) => {
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(productItem.price);

  const add = () => {
    const data = {
      ...productItem,
      quantity,
    };

    if (addProductItem) {
      addProductItem(data);
    }
  };

  return (
    <div
      key={productItem.id}
      className="p-1 shadow-2"
      style={{ borderRadius: "5px" }}
    >
      <div className="flex flex-row justify-content-center w-full gap-2">
        <div
          style={{
            width: "120px",
            height: "120px",
          }}
        >
          <img
            className="w-full h-full border-round"
            src={productItem.ImageUrl ?? EmptyUrl}
            alt={productItem.name}
          />
        </div>
        <div className="flex-1 flex flex-column gap-2 justify-content-between">
          <div className="flex flex-row gap-2">
            {productItem.variantObjects.map((variantObject) => {
              return (
                <Chip key={variantObject.code} label={variantObject.value} />
              );
            })}
          </div>

          <div className="flex flex-row align-items-center gap-2">
            <FloatLabel>
              <label htmlFor="quantity">Số lượng</label>
              <InputNumber
                id="quantity"
                value={quantity}
                onValueChange={(e) => {
                  setQuantity(e.value);
                  setTotal(e.value * productItem.price);
                }}
                min={1}
              />
            </FloatLabel>
            <i className="pi pi-times" />
            <span className="text-lg">Giá: {formatVnd(productItem.price)}</span>
          </div>
        </div>
        <div className="flex flex-column gap-2 justify-content-between align-items-end">
          <div className="text-end">
            <Button icon="pi pi-cart-plus px-2" onClick={add}>
              Thêm
            </Button>
          </div>
          <span style={{ fontWeight: "bold" }}>
            Thành tiền: {formatVnd(total)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductItemOrder;
