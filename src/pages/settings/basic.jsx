import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { basicInfoSettingSchema } from "../../schemas/setting.schema";
import { useEffect, useRef } from "react";
import {
  getBasicInfoSetting,
  updateBasicInfoSetting,
} from "../../services/setting";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import Validate from "../../components/Validate";
import { InputText } from "primereact/inputtext";
import Swal from "sweetalert2";
import { showErrorToasts } from "../../utils/toast";
import { handleFormatError } from "../../utils/errorHandler";
import { useSelector } from "react-redux";
import { isNotAllowRole } from "../../utils/common";
import { Button } from "primereact/button";

const screenName = "Thông tin hệ thống";

const BasicSetting = () => {
  document.title = screenName;
  const toast = useRef(null);
  const role = useSelector((state) => state.personalProfile.role);

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(basicInfoSettingSchema),
  });

  useEffect(() => {
    getBasicInfoSetting().then((res) => {
      setValue("shopName", res.data.shopName);
      setValue("shopEmail", res.data.shopEmail);
      setValue("shopPhone", res.data.shopPhone);
      setValue("shopAddress", res.data.shopAddress);
    });
  }, []);

  const onSubmit = async (data) => {
    await updateBasicInfoSetting(data)
      .then(() => {
        Swal.fire({
          title: "Thông báo",
          text: "Cập nhật thông tin cài đặt cơ bản thành công",
          timer: 2000,
          icon: "success",
        });
      })
      .catch((err) => {
        showErrorToasts(toast, handleFormatError(err));
      });
  };

  return (
    <div className="gap-2 w-full flex flex-column">
      <div className="w-full flex flex-row align-items-center justify-content-start gap-2">
        <h2>{screenName}</h2>
      </div>
      <Toast ref={toast} />
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column">
          <Validate error={errors.shopName?.message} label="Tên danh mục">
            <InputText
              id="shop_name"
              readOnly={isNotAllowRole(role)}
              {...register("shopName")}
              className={`w-full ${
                errors.shopName?.message ? "p-invalid" : ""
              }`}
            />
          </Validate>
          <Validate error={errors.shopEmail?.message} label="Tên danh mục">
            <InputText
              id="shop_email"
              readOnly={isNotAllowRole(role)}
              {...register("shopEmail")}
              className={`w-full ${
                errors.shopEmail?.message ? "p-invalid" : ""
              }`}
            />
          </Validate>
          <Validate error={errors.shopPhone?.message} label="Tên danh mục">
            <InputText
              id="shop_phone"
              readOnly={isNotAllowRole(role)}
              {...register("shopPhone")}
              className={`w-full ${
                errors.shopPhone?.message ? "p-invalid" : ""
              }`}
            />
          </Validate>
          <Validate error={errors.shopAddress?.message} label="Tên danh mục">
            <InputText
              id="shop_address"
              readOnly={isNotAllowRole(role)}
              {...register("shopAddress")}
              className={`w-full ${
                errors.shopAddress?.message ? "p-invalid" : ""
              }`}
            />
          </Validate>

          <div className="text-end mt-4">
            <Button
              type="submit"
              className={`${isNotAllowRole(role) ? "hidden" : ""}`}
            >
              Cập nhật
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default BasicSetting;
