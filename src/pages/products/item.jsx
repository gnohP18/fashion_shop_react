import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getListProductItem,
  updateProductVariantAsync,
} from "../../services/product";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Card } from "primereact/card";
import { Image } from "primereact/image";
import { EmptyUrl } from "../../constants/common";
import UploadImageWithPreview from "../../components/UploadImageWithPreview";
import { Dialog } from "primereact/dialog";

import { Chip } from "primereact/chip";
import Swal from "sweetalert2";
import { showErrorToasts } from "../../utils/toast";
import { handleFormatError } from "../../utils/errorHandler";

const screenName = "Chỉnh sửa từng biến thể";

const ProductItem = () => {
  document.title = screenName;

  const { id } = useParams();
  const [visible, setVisible] = useState(false);
  const [productItems, setProductItems] = useState([]);
  const [currentProductItem, setCurrentProductItem] = useState();

  const toast = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      await getListProductItem(id).then((res) => {
        if (res.data) {
          setProductItems(res.data);
        }
      });
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (currentProductItem) {
      setVisible(true);
    }
  }, [currentProductItem]);

  const handleVisibleProductItemImage = (productItem) => {
    setCurrentProductItem(productItem);
  };

  const updateNewImageUrlProductItem = (productItemId, url) => {
    setProductItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productItemId ? { ...item, imageUrl: url } : item
      )
    );
  };

  const handleChangePrice = (productItemId, price) => {
    const updatedItems = productItems.map((item) =>
      item.id === productItemId ? { ...item, price } : item
    );
    setProductItems(updatedItems);
  };

  const updateProductItem = async () => {
    const data = {
      isVariant: true,
      productItems,
    };

    await updateProductVariantAsync(id, data)
      .then(() => {
        Swal.fire({
          title: "Auto close alert!",
          text: "I will close in 2 seconds.",
          timer: 2000,
        });
      })
      .catch((err) => {
        showErrorToasts(toast, handleFormatError(err));
      });
  };

  return (
    <div className="gap-2 w-full flex flex-column">
      <div className="w-full flex flex-row align-items-center justify-content-start gap-2">
        <a href={`/products/${id}`}>
          <i className="pi pi-arrow-left"></i>
        </a>
        <h2>{screenName}</h2>
      </div>
      <Toast ref={toast} />
      <Card>
        <div className="flex flex-column md:flex-row flex-wrap">
          <div className="flex align-items-center px-2 font-bold w-4rem">
            ID
          </div>
          <div className="col my-0 font-bold">Mã</div>
          <div className="col my-0 font-bold w-4rem">Ảnh</div>
          <div className="col my-0 font-bold">Giá tiền</div>
          <div className="col my-0 font-bold">Số lượng</div>
        </div>
        <div className="flex flex-column gap-2">
          {productItems.map((productItem) => {
            return (
              <div
                key={productItem.id}
                className="flex flex-column md:flex-row flex-wrap w-full"
              >
                <div className="flex align-items-center px-2 w-4rem">
                  <p>{productItem.id}</p>
                </div>
                <div className="col flex align-items-center gap-2">
                  {productItem.variantObjects.map((variantObject) => {
                    return (
                      <Chip
                        key={variantObject.code}
                        label={variantObject.value}
                      />
                    );
                  })}
                </div>
                <div className="col flex align-items-center gap-2">
                  <Image
                    width="64"
                    height="64"
                    src={productItem.imageUrl || EmptyUrl}
                  />
                  <Button
                    key={productItem.id}
                    className="w-full text-center mx-2"
                    icon="pi pi-upload"
                    onClick={() => handleVisibleProductItemImage(productItem)}
                  >
                    Tải ảnh
                  </Button>
                </div>
                <div className="col flex align-items-center">
                  <InputNumber
                    value={productItem.price}
                    className="w-full"
                    mode="currency"
                    currency="VND"
                    placeholder="Vui lòng nhập giá sản phẩm"
                    onValueChange={(e) =>
                      handleChangePrice(productItem.id, e.value)
                    }
                    locale="vi-VN"
                  />
                </div>
                <div className="col flex align-items-center">
                  <InputNumber
                    value={productItem.quantity}
                    className="w-full"
                    placeholder="Vui lòng nhập số lượng"
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-content-end mt-4">
          <Button className="p-button p-component" onClick={updateProductItem}>
            Lưu
          </Button>
        </div>
      </Card>
      <Dialog
        header="Tải ảnh cho biến thể"
        visible={visible}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
          setCurrentProductItem(null);
        }}
        style={{ width: "50vw" }}
      >
        {currentProductItem ? (
          <UploadImageWithPreview
            objectId={currentProductItem.id}
            objectType="productItem"
            productImage={currentProductItem.imageUrl}
            showSweetAlert={false}
            onUploaded={updateNewImageUrlProductItem}
          />
        ) : null}
      </Dialog>
    </div>
  );
};

export default ProductItem;
