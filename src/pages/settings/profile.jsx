import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import UploadImageWithPreview from "../../components/UploadImageWithPreview";
import Validate from "../../components/Validate";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "../../schemas/login.schema";
import { Button } from "primereact/button";
import { changePassword } from "../../services/auth";
import { Toast } from "primereact/toast";
import { showErrorToasts } from "../../utils/toast";
import { handleFormatError } from "../../utils/errorHandler";
import { logout } from "../../store/slices/authSlice";
import {
  STORAGE_AUTH_ACCESS_KEY,
  STORAGE_AUTH_REFRESH_KEY,
} from "../../constants/authentication";
import { setAccessToken, setRefreshToken } from "../../utils/auth";

const screenName = "Thông tin tài khoản";

const ProfileSetting = () => {
  document.title = screenName;
  const toast = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    mode: "onBlur",
  });

  const profile = useSelector((state) => state.personalProfile.data);
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
    if (profile) {
      setImageUrl(profile?.imageUrl);
    }
  }, [profile]);

  const onUploaded = (id, url) => {
    setImageUrl(url);
  };

  const onSubmit = async (data) => {
    await changePassword({
      password: data.password,
      newPassword: data.newPassword,
    })
      .then(() => {
        Swal.fire({
          title: "Thông báo",
          text: "Thay đổi mật khẩu thành công, tự động đăng xuất sau 2 giây",
          timer: 2000,
        }).then(() => {
          dispatch(logout());
          setAccessToken("", STORAGE_AUTH_ACCESS_KEY);
          setRefreshToken("", STORAGE_AUTH_REFRESH_KEY);
          navigate("/login");
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
      <Card title="Hiển thị tài khoản">
        <div className="grid">
          <div className="col-3">Tên tài khoản</div>
          <div className="col-9">
            <span className="text-bold">{profile?.username}</span>
          </div>
          <div className="col-3">Số điện thoại</div>
          <div className="col-9">
            <span className="text-bold">{profile?.phoneNumber}</span>
          </div>
          <div className="col-3">Email</div>
          <div className="col-9">
            <span className="text-bold">{profile?.email}</span>
          </div>
        </div>
      </Card>

      <UploadImageWithPreview
        objectId={profile?.id}
        objectType={"user"}
        productImage={imageUrl}
        showSweetAlert={false}
        onUploaded={onUploaded}
        isView={false}
      />

      <Card title="Đổi mật khẩu">
        <form onSubmit={handleSubmit(onSubmit)} className="grid">
          <Validate
            className="col-12 md:col-6"
            error={errors.password?.message}
          >
            <label htmlFor="password">Mật khẩu</label>
            <InputText
              id="password"
              type="password"
              {...register("password")}
              className={`w-full ${
                errors.password?.message ? "p-invalid" : ""
              }`}
            />
          </Validate>
          <div className="col-12 md:col-6"></div>
          <Validate
            className="col-12 md:col-6"
            error={errors.newPassword?.message}
          >
            <label htmlFor="newPassword">Mật khẩu mới</label>
            <InputText
              id="newPassword"
              type="password"
              {...register("newPassword")}
              className={`w-full ${
                errors.newPassword?.message ? "p-invalid" : ""
              }`}
            />
          </Validate>
          <Validate
            className="col-12 md:col-6"
            error={errors.confirmPassword?.message}
          >
            <label htmlFor="confirmPassword">Xác nhận Mật khẩu mới</label>
            <InputText
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              className={`w-full ${
                errors.confirmPassword?.message ? "p-invalid" : ""
              }`}
            />
          </Validate>
          <div className="col-12">
            <Button type="submit">Lưu</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProfileSetting;
