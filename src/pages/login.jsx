import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { loginSchema } from "../schemas/login.schema";
import Validate from "../components/Validate";
import { loginAsync } from "../services/auth";
import { showErrorToasts } from "../utils/toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthData } from "../store/slices/authSlice";
import { setAccessToken, setRefreshToken } from "../utils/auth";

const Login = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const toast = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const { username, password } = data;
    await loginAsync({ username, password })
      .then((res) => {
        if (res) {
          dispatch(
            setAuthData({
              accessToken: res?.data.access_token,
              refreshToken: res?.data.refresh_token,
              user: null,
            })
          );
          setAccessToken(res?.data.access_token);
          setRefreshToken(res?.data.refresh_token);
          navigate("/");
        }
      })
      .catch((err) => {
        if (err) {
          showErrorToasts(toast, Object.values(err));
        }
      });
  };

  return (
    <div className="p-fluid max-w-30rem mx-auto mt-8">
      <Toast ref={toast} />
      <h2 className="text-center mb-4">Đăng nhập</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Validate label="Tên đăng nhập" error={errors.username?.message}>
          <InputText
            id="username"
            {...register("username")}
            className={errors.username?.message ? "p-invalid" : ""}
          />
        </Validate>

        <Validate label="Mật khẩu" error={errors.password?.message}>
          <InputText
            id="password"
            type="password"
            {...register("password")}
            className={errors.password?.message ? "p-invalid" : ""}
          />
        </Validate>

        <Button
          label="Đăng nhập"
          icon="pi pi-sign-in"
          type="submit"
          className="w-full"
        />
      </form>
    </div>
  );
};

export default Login;
