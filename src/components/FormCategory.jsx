import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { debounce } from "lodash";
import { checkExistSlug } from "../services/category";
import { Button } from "primereact/button";
import Validate from "../components/Validate";
import { useForm } from "react-hook-form";
import { ActionMode } from "../constants/common";
import { basicCategorySchema } from "../schemas/category.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "primereact/card";

const FormCategory = ({ mode, defaultValue = {}, onSubmit }) => {
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(basicCategorySchema),
    defaultValues: {
      name: mode === ActionMode.Update ? defaultValue.name : "",
      slug: mode === ActionMode.Update ? defaultValue.slug : "",
    },
  });

  const slug = watch("slug");

  const [checking, setChecking] = useState(false);
  const [exists, setExists] = useState(null);

  const checkSlugExists = debounce(async (value) => {
    setChecking(true);
    if (value) {
      const res = await checkExistSlug(value);
      setExists(res);

      if (res === true) {
        setError("slug", { type: "custom", message: "Đường dẫn đã tồn tại" });
      } else {
        clearErrors("slug");
      }
    } else {
      clearErrors("slug");
    }

    setChecking(false);
  }, 500);

  useEffect(() => {
    if (slug.trim().length > 2 && slug.trim() !== defaultValue?.slug) {
      checkSlugExists(slug);
    } else {
      if (errors?.slug?.type === "custom") {
        clearErrors("slug");
      }
      setExists(null);
    }
  }, [slug]);

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column">
        <Validate error={errors.name?.message} label="Tên danh mục">
          <InputText id="name" {...register("name")} className="w-full" />
        </Validate>
        <Validate error={errors.slug?.message} label="Đường dẫn (slug)">
          <div className="p-inputgroup flex-1">
            <InputText
              id="slug"
              {...register("slug")}
              className={classNames({
                "p-invalid": exists === true,
                "p-valid": exists === false,
              })}
              aria-describedby="slug-help"
              placeholder='Đường dẫn chỉ bao gồm chữ thường và "-"'
            />
            <Button
              loading={checking}
              icon={exists ? "pi pi-times" : "pi pi-check"}
              severity={exists ? "danger" : "success"}
            />
          </div>
        </Validate>
        <div className="flex flex-row justify-content-end">
          <Button loading={checking} disabled={exists} type="submit">
            Lưu
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default FormCategory;
