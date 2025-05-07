import { Card } from "primereact/card";
import { InputSwitch } from "primereact/inputswitch";
import { Fieldset } from "primereact/fieldset";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { useNavigate } from "react-router-dom";

const maximumProductVariant = 3;
const FormProductVariant = ({
  productId,
  isVariant,
  productVariants,
  changeStatusVariant,
  isView = true,
}) => {
  const [statusVariant, setStatusVariant] = useState(false);
  const [visibleButtonAdd, setVisibleButtonAdd] = useState(false);
  const [newProductVariants, setNewProductVariants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setStatusVariant(isVariant);
  }, [isVariant]);

  const handleAddVariantType = () => {
    if (newProductVariants.length < maximumProductVariant) {
      setNewProductVariants([
        ...newProductVariants,
        {
          name: "",
          variants: [{ value: "", code: "" }],
        },
      ]);
    }
  };

  const handleVariantTypeChange = (index, value) => {
    const newVariants = [...newProductVariants];

    newVariants[index].name = value;
    setNewProductVariants(newVariants);
  };

  const handleVariantValueChange = (typeIndex, valueIndex, value) => {
    const newVariants = [...newProductVariants];

    newVariants[typeIndex].variants[valueIndex].value = value;
    setNewProductVariants(newVariants);
  };

  const handleVariantCodeChange = (typeIndex, valueIndex, code) => {
    const newVariants = [...newProductVariants];

    newVariants[typeIndex].variants[valueIndex].code = code;
    setNewProductVariants(newVariants);
  };

  const handleRemoveVariantType = (typeIndex) => {
    const updatedVariants = [...newProductVariants];
    if (updatedVariants.length > 1) {
      updatedVariants.splice(typeIndex, 1);
      setNewProductVariants(updatedVariants);
    }
  };

  const handleRemoveVariantValue = (typeIndex, valueIndex) => {
    const updatedVariants = [...newProductVariants];
    if (updatedVariants[typeIndex].variants.length > 1) {
      updatedVariants[typeIndex].variants.splice(valueIndex, 1);
      setNewProductVariants(updatedVariants);
    }
  };

  const handleAddVariantValue = (typeIndex) => {
    const newVariants = [...newProductVariants];

    newVariants[typeIndex].variants.push({ value: "", code: "" });
    setNewProductVariants(newVariants);
  };

  const productVariantBlock = (productVariant, index) => (
    <Fieldset key={index} legend={productVariant.name}>
      <div className="flex flex-row gap-2">
        {productVariant.variants.map((element, idx) => (
          <Button
            outlined
            key={idx}
            tooltip={element.code}
            tooltipOptions={{ position: "top" }}
          >
            {element.value}
          </Button>
        ))}
      </div>
    </Fieldset>
  );

  const handleChangeStatus = (status) => {
    if (!status) {
      Swal.fire({
        title: "Bạn chắc chắn",
        text: "Nếu bạn tắt Biến thể thì sẽ không thể hoàn lại được nữa",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Tắt",
        cancelButtonText: "Huỷ",
      }).then((result) => {
        if (result.isConfirmed) {
          if (isVariant) {
            changeStatusVariant(false, null);
          } else {
            setStatusVariant(false);
            setNewProductVariants([]);
          }
          Swal.fire({
            title: "Hoàn tất",
            text: "Đã tắt biến thể",
            icon: "success",
          });

          setVisibleButtonAdd(false);
        }
      });
    } else {
      setVisibleButtonAdd(true);
      setStatusVariant(true);
    }
  };

  const addNewVariant = () => {
    let isValidProductVariant = true;

    newProductVariants.forEach((productVariant) => {
      if (!productVariant.name) {
        isValidProductVariant = false;
        return;
      }

      if (productVariant.variants.length > 0) {
        productVariant.variants.forEach((variant) => {
          if (!variant.code || !variant.value) {
            isValidProductVariant = false;
            return;
          }
        });
      } else {
        isValidProductVariant = false;
        return;
      }
    });

    if (!isValidProductVariant) {
      Swal.fire({
        title: "Lỗi",
        icon: "error",
        text: "Loại biến thể hoặc biến thể đang bị trống, vui lòng kiểm tra lại",
        showConfirmButton: true,
      });

      return;
    }
    changeStatusVariant(statusVariant, newProductVariants);
  };

  return (
    <div>
      <Card title="Chế độ biến thể" className="flex flex-column gap-2">
        <div className="flex flex-row justify-content-between py-3">
          <div className="flex flex-row align-items-center gap-2">
            <span id="is_variant">Trạng thái</span>
            <InputSwitch
              id="is_variant"
              disabled={isView}
              checked={statusVariant}
              onChange={(e) => handleChangeStatus(e.target.value)}
            />
          </div>
          <div>
            {isVariant ? (
              <Button
                severity="secondary"
                onClick={() => navigate(`/products/item/${productId}`)}
              >
                Chi tiết biến thể
              </Button>
            ) : null}
          </div>
        </div>

        <div className="flex flex-column gap-2">
          {productVariants && isVariant
            ? productVariants.map((element, index) =>
                productVariantBlock(element, index)
              )
            : null}

          {newProductVariants.map((variantType, typeIndex) => (
            <Fieldset
              key={typeIndex}
              legend={
                <FloatLabel className="my-2">
                  <label htmlFor={`product_variant_name_${typeIndex}`}>
                    Tên loại biến thể
                  </label>
                  <InputText
                    id={`product_variant_name_${typeIndex}`}
                    placeholder="VD: Màu sắc"
                    maxLength={10}
                    value={variantType.name}
                    onChange={(e) =>
                      handleVariantTypeChange(typeIndex, e.target.value)
                    }
                    className="w-full"
                  />
                </FloatLabel>
              }
            >
              {variantType.variants.map((variant, valueIndex) => (
                <div
                  key={valueIndex}
                  className="flex flex-column md:flex-row mb-2 gap-2"
                >
                  <InputText
                    placeholder={`Biến thể #${valueIndex + 1}`}
                    value={variant.value}
                    onChange={(e) =>
                      handleVariantValueChange(
                        typeIndex,
                        valueIndex,
                        e.target.value
                      )
                    }
                    className="w-full"
                  />
                  <InputText
                    placeholder={`Mã biến thể #${valueIndex + 1}`}
                    value={variant.code}
                    onChange={(e) =>
                      handleVariantCodeChange(
                        typeIndex,
                        valueIndex,
                        e.target.value
                      )
                    }
                    className="w-full"
                  />
                  <Button
                    icon="pi pi-times"
                    className="px-2"
                    severity="danger"
                    onClick={() =>
                      handleRemoveVariantValue(typeIndex, valueIndex)
                    }
                  ></Button>
                </div>
              ))}
              <div className="flex flex-row gap-2">
                <Button
                  icon="pi pi-plus"
                  label="Thêm giá trị"
                  onClick={() => handleAddVariantValue(typeIndex)}
                  className="mt-2"
                  severity="secondary"
                />
                <Button
                  icon="pi pi-trash"
                  label="Xoá loại biến thể"
                  className="mt-2"
                  severity="danger"
                  onClick={() => handleRemoveVariantType(typeIndex)}
                />
              </div>
            </Fieldset>
          ))}
          {visibleButtonAdd ? (
            <div>
              <Button
                icon="pi pi-plus"
                disabled={newProductVariants.length === 3}
                tooltip={`Bạn chỉ có thể thêm tối đa ${maximumProductVariant}`}
                onClick={handleAddVariantType}
              >
                Thêm biến thể
              </Button>
            </div>
          ) : null}
        </div>
        {statusVariant && newProductVariants.length > 0 ? (
          <div className="text-end mt-4">
            <button className="p-button p-component" onClick={addNewVariant}>
              Lưu
            </button>
          </div>
        ) : null}
      </Card>
    </div>
  );
};

export default FormProductVariant;
