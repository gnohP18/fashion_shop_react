import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getProductDetail,
  updateBasicProductAsync,
  updateProductVariantAsync,
} from "../../services/product";
import FormProduct from "../../components/FormProduct";
import { Toast } from "primereact/toast";
import { showErrorToasts, showSuccessToast } from "../../utils/toast";
import FormProductVariant from "../../components/FormProductVariant";
import UploadImageWithPreview from "../../components/UploadImageWithPreview";
import { ActionMode, RoleNames } from "../../constants/common";
import { getListCategory } from "../../services/category";
import { useSelector } from "react-redux";
import { isNotAllowRole } from "../../utils/common";

const screenName = "Chi tiết sản phẩm";
const ProductDetail = () => {
  document.title = screenName;
  const { id } = useParams();
  const role = useSelector((state) => state.personalProfile.role);
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState(null);
  const toast = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      await getProductDetail(id).then((res) => {
        setProduct(res.data);
      });
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchCategory = async () => {
      await getListCategory({}).then((res) => {
        setCategories(res.data);
      });
    };

    fetchCategory();
  }, [id]);

  const onUpdateBasicProduct = async (data) => {
    await updateBasicProductAsync(id, data)
      .then(() => {
        showSuccessToast(toast, "Cập nhật sản phẩm thành công");
      })
      .catch((err) => {
        if (err) {
          showErrorToasts(toast, Object.values(err));
        }
      });
  };

  const changeStatusVariant = async (status, data) => {
    if (status === false) {
      await updateProductVariantAsync(id, { isVariant: false });
      setProduct((prev) => ({
        ...prev,
        isVariant: false,
      }));
    } else {
      if (data.length > 0) {
        const productVariants = data.map((productVariant, index) => {
          return {
            name: productVariant.name,
            priority: index + 1,
          };
        });

        let variants = [];

        data.forEach((productVariant, index) => {
          const tempVariants = productVariant.variants.map((variant) => {
            return {
              value: variant.value,
              priority: index + 1,
              code: variant.code,
            };
          });

          variants = [...variants, ...tempVariants];
        });

        await updateProductVariantAsync(id, {
          isVariant: true,
          productVariants: productVariants,
          variants: variants,
        })
          .then(() => {
            showSuccessToast(toast, "Cập nhật sản phẩm thành công");
            window.location.reload();
          })
          .catch((err) => {
            if (err) {
              showErrorToasts(toast, Object.values(err));
            }
          });
      }
    }
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
      {product ? (
        <FormProduct
          mode={ActionMode.Update}
          productInfo={product}
          categories={categories}
          onSubmit={onUpdateBasicProduct}
          isView={RoleNames.Manager === role}
        />
      ) : null}

      {product && (
        <UploadImageWithPreview
          objectId={id}
          objectType="product"
          productImage={product.imageUrl}
          isView={RoleNames.Manager === role}
        />
      )}

      {product ? (
        <FormProductVariant
          productId={id}
          isVariant={product.isVariant}
          productVariants={product.productVariants}
          changeStatusVariant={changeStatusVariant}
          isView={isNotAllowRole(role)}
        />
      ) : null}
    </div>
  );
};

export default ProductDetail;
