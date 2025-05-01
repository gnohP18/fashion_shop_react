import { debounce } from "lodash";
import { Card } from "primereact/card";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { useEffect, useRef, useState } from "react";
import {
  checkExistPhone,
  createOrderByAdmin,
  getProductOptions,
  loadUserByPhone,
} from "../../services/order";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrderSchema } from "../../schemas/order.schema";
import { getListProductItem } from "../../services/product";
import { showErrorToasts, showSuccessToast } from "../../utils/toast";
import { handleFormatError } from "../../utils/errorHandler";
import ProductItemOrder from "../../components/ProductItemOrder";
import OrderItems from "../../components/OrderItems";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Toast } from "primereact/toast";

const screenName = "Tạo đơn hàng mới";

const CreateOrder = () => {
  document.title = screenName;
  const toast = useRef();
  const {
    register,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      phone: "",
    },
    mode: "onBlur",
  });
  const navigate = useNavigate();

  const [isLoadingProductOptions, setIsLoadingProductOptions] = useState(false);
  const [checking, setChecking] = useState(false);
  const [exists, setExists] = useState(null);
  const [existMessage, setExistMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [productOptions, setProductOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productName, setProductName] = useState("");
  const [visibleProductItemsDialog, setVisibleProductItemsDialog] =
    useState(false);
  const [productItems, setProductItems] = useState([]);
  const [selectedProductItems, setSelectedProductItems] = useState([]);

  const phone = watch("phone");

  const checkPhoneExist = debounce(async (value) => {
    setChecking(true);
    setExistMessage("Đang kiểm tra...");
    if (value) {
      const res = await checkExistPhone({ phone: value });
      setExists(res);
      setExistMessage(
        res
          ? "Số điện thoại đã tồn tại vui lòng bấm tải thông tin khách hàng."
          : "Số điện thoại chưa tồn tại"
      );
    }

    setChecking(false);
  }, 1000);

  const loadUser = async () => {
    if (!phone) {
      return;
    }

    await loadUserByPhone({ phone }).then((res) => {
      setUsername(res.data.username);
      setEmail(res.data.email);
    });
  };

  const loadProduct = async () => {
    if (!selectedProduct) {
      return;
    }

    setProductName(
      productOptions.filter((p) => p.id === selectedProduct)?.[0].name
    );

    getListProductItem(selectedProduct)
      .then((res) => {
        if (res.data) {
          setProductItems(res.data);
        }

        setVisibleProductItemsDialog(true);
      })
      .catch((err) => {
        showErrorToasts(toast, handleFormatError(err));
      });
  };

  const addProductItem = (data) => {
    console.log(data);

    if (selectedProductItems.filter((pi) => pi.id === data.id).length > 0) {
      return;
    }

    if (productName) {
      data = { ...data, ...{ productName } };
    }
    const updateSelectedProductItems = [...selectedProductItems];
    updateSelectedProductItems.push(data);
    setSelectedProductItems(updateSelectedProductItems);

    showSuccessToast(toast, "Thêm sản phẩm thành công");
  };

  const onSubmit = async () => {
    const orderDetails = selectedProductItems.map((item) => {
      return { productItemId: item.id, quantity: item.quantity };
    });

    const data = {
      isGuest: !exists,
      phone,
      orderDetails,
    };

    await createOrderByAdmin(data).then(() => {
      Swal.fire({
        title: "Thông báo",
        text: "Tạo đơn thành công",
        icon: "success",
        timer: 2000,
      }).then(() => {
        navigate("/orders");
      });
    });
  };

  useEffect(() => {
    if (!phone) {
      setExistMessage("");
      return;
    }

    if (errors.phone) {
      setExistMessage("");
      return;
    }

    checkPhoneExist(phone);

    return () => {
      checkPhoneExist.cancel();
    };
  }, [phone, errors.phone]);

  useEffect(() => {
    const fetchProductOptions = async () => {
      setIsLoadingProductOptions(true);
      await getProductOptions()
        .then((res) => {
          setProductOptions(res);
        })
        .finally(() => {
          setIsLoadingProductOptions(false);
        });
    };

    fetchProductOptions();
  }, []);

  return (
    <div className="gap-2 w-full flex flex-column">
      <div className="flex flex-row align-items-center">
        <h2 className="flex-1">{screenName}</h2>
      </div>
      <Toast ref={toast} />
      <Card className="w-full">
        <h3 className="mt-0">Thông tin khách hàng</h3>
        <div className="grid w-full">
          <div className="flex flex-column gap-2 col-6">
            <label htmlFor="phone">Số điện thoại</label>
            <IconField iconPosition="left" className="w-full">
              {checking ? (
                <InputIcon className="pi pi-spin pi-spinner"> </InputIcon>
              ) : !exists ? (
                <InputIcon
                  className="pi pi-check"
                  style={{ color: "green" }}
                ></InputIcon>
              ) : (
                <InputIcon
                  className="pi pi-user"
                  style={{ color: "blue" }}
                ></InputIcon>
              )}

              <InputText
                id="phone"
                {...register("phone")}
                placeholder="Nhập số điện thoại để kiểm tra thông tin"
                className="w-full"
                aria-describedby="phone_helper"
              />
            </IconField>
            <small id="phone_helper">
              {errors.phone?.message || existMessage}
            </small>
          </div>
          <div className="col-6"></div>
          <div className="col-6">
            <div className="py-2">
              <Button disabled={!exists} onClick={loadUser}>
                Tải thông tin khách hàng
              </Button>
            </div>
          </div>
          <div className="col-6"></div>

          <div className="col-12 md:col-6">
            <FloatLabel className="w-full">
              <label htmlFor="username">Tên đăng nhập (Chỉ đọc)</label>
              <InputText
                readOnly
                id="username"
                value={username}
                className="w-full"
              />
            </FloatLabel>
          </div>

          <div className="col-12 md:col-6">
            <FloatLabel className="w-full">
              <label htmlFor="email">Email (Chỉ đọc)</label>
              <InputText readOnly id="email" value={email} className="w-full" />
            </FloatLabel>
          </div>
          {productOptions.length > 0 ? (
            <div className="col-12 md:col-6 py-4">
              <FloatLabel className="w-full">
                <label htmlFor="product_search">Tìm kiếm sản phẩm</label>
                <Dropdown
                  loading={isLoadingProductOptions}
                  options={productOptions}
                  value={selectedProduct || ""}
                  onChange={(e) => setSelectedProduct(e.value)}
                  optionLabel="name"
                  optionValue="id"
                  filter
                  placeholder="Chọn sản phẩm"
                  className="w-full"
                />
              </FloatLabel>
            </div>
          ) : null}
          <div className="col-6"></div>
          <div className="col-6">
            <Button disabled={!selectedProduct} onClick={loadProduct}>
              Tải thông tin sản phẩm
            </Button>
          </div>
        </div>
      </Card>

      <OrderItems orderItems={selectedProductItems} />

      <div className="w-full text-right py-3">
        <Button
          disabled={!phone || selectedProductItems.length === 0}
          onClick={onSubmit}
          className="btn btn-primary"
        >
          Xác nhận
        </Button>
      </div>
      <Dialog
        visible={visibleProductItemsDialog}
        onHide={() => {
          if (!visibleProductItemsDialog) return;
          setVisibleProductItemsDialog(false);
          setSelectedProduct("");
        }}
        header={productName ?? ""}
        style={{ width: "70vw" }}
      >
        <div className="flex flex-column gap-2 w-full">
          {productItems.map((productItem) => (
            <ProductItemOrder
              productItem={productItem}
              addProductItem={addProductItem}
            />
          ))}
        </div>
      </Dialog>
    </div>
  );
};

export default CreateOrder;
