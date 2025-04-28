import { useEffect, useRef, useState } from "react";
import { createBasicProductAsync } from "../../services/product";
import FormProduct from "../../components/FormProduct";
import { ActionMode } from "../../constants/common";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { showErrorToasts } from "../../utils/toast";
import { Toast } from "primereact/toast";
import { getListCategory } from "../../services/category";

const screenName = "Tạo mới sản phẩm";

const CreateProduct = () => {
  document.title = screenName;

  const navigate = useNavigate();
  const toast = useRef();
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      await getListCategory({}).then((res) => {
        setCategories(res.data);
      });
    };

    fetchCategory();
  }, []);

  const onCreateProduct = async (data) => {
    data = { ...data, ...{ isVariant: false, imageUrl: "" } };
    await createBasicProductAsync(data)
      .then(() => {
        Swal.fire({
          title: "Thông báo",
          text: "Tạo sản phẩm thành công",
          timer: 3000,
        }).then(() => {
          navigate("/products");
        });
      })
      .catch((err) => {
        showErrorToasts(toast, [err.message]);
      });
  };

  return (
    <div className="gap-2 w-full flex flex-column">
      <div className="w-full flex flex-row align-items-center justify-content-start gap-2">
        <a href={"/products"}>
          <i className="pi pi-arrow-left"></i>
        </a>
        <h2>{screenName}</h2>
      </div>
      <Toast ref={toast} />
      <FormProduct
        mode={ActionMode.Create}
        categories={categories}
        onSubmit={onCreateProduct}
      />
    </div>
  );
};

export default CreateProduct;
