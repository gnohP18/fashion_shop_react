import React from "react";
import Validate from "./Validate";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Card } from "primereact/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { basicProductSchema } from "../schemas/product.shema";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { extractSuffixSlug } from "../utils/common";

const FormProduct = ({ mode, categories, productInfo = {}, onSubmit }) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(basicProductSchema),
    defaultValues: {
      name: productInfo.name ?? "",
      price: productInfo.price ?? 0,
      description: productInfo.description ?? "",
      slug: extractSuffixSlug(productInfo.slug).prefix ?? "",
      categoryId: productInfo.categoryId ?? null,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <Card title="Thông tin cơ bản" className="flex flex-column gap-4">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
          <Validate error={errors.name?.message} className="col">
            <FloatLabel className="w-full">
              <label htmlFor="name">Tên sản phẩm</label>
              <InputText
                id="name"
                placeholder="Vui lòng nhập tên sản phẩm"
                {...register("name")}
                className={`w-full ${errors.name?.message ? "p-invalid" : ""}`}
              />
            </FloatLabel>
          </Validate>

          <Validate error={errors.price?.message} className="col">
            <FloatLabel className="w-full">
              <label htmlFor="price">Giá sản phẩm</label>
              <InputNumber
                id="price"
                mode="currency"
                currency="VND"
                value={getValues("price")}
                onValueChange={(e) => setValue("price", e.value)}
                placeholder="Vui lòng nhập giá sản phẩm"
                locale="vi-VN"
                className={`w-full ${errors.price?.message ? "p-invalid" : ""}`}
              />
            </FloatLabel>
          </Validate>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
          {categories && categories.length > 0 ? (
            <Validate error={errors.categoryId?.message} className="col">
              <FloatLabel className="w-full">
                <label htmlFor="category">Danh mục sản phẩm</label>
                <Dropdown
                  id="category"
                  value={getValues("categoryId")}
                  options={categories}
                  optionValue="id"
                  optionLabel="name"
                  placeholder="Tìm kiếm theo danh mục"
                  className="w-full"
                  onChange={(e) => setValue("categoryId", e.target.value)}
                />
              </FloatLabel>
            </Validate>
          ) : null}

          <Validate error={errors.slug?.message} className="col">
            <FloatLabel className="w-full">
              <label htmlFor="slug">Tên sản phẩm</label>
              <InputText
                id="slug"
                placeholder="Vui lòng nhập đường dẫn sản phẩm"
                {...register("slug")}
                className={`w-full ${errors.slug?.message ? "p-invalid" : ""}`}
              />
            </FloatLabel>
          </Validate>
        </div>

        <div className="grid grid-cols-1 gap-2 pl-2 pr-4">
          <InputTextarea
            id="description"
            className="w-full"
            value={getValues("description")}
            onChange={(e) => setValue("description", e.target.value)}
            rows={5}
          />
        </div>

        <div className="text-end mt-4">
          <button type="submit" className="p-button p-component">
            {mode === "update" ? "Cập nhật" : "Tạo mới"}
          </button>
        </div>
      </Card>
    </form>
  );
};

export default FormProduct;
