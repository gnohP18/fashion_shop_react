import { STORAGE_AUTH_FCM_TOKEN } from "../constants/authentication";
import apiAdmin from "./apiAdmin";

export const loginAsync = ({ username, password }) => {
  const fcmToken = localStorage.getItem(STORAGE_AUTH_FCM_TOKEN);

  return apiAdmin.post("api/admin/auth/login", { username, password, fcmToken });
};

export const logoutAsync = () => {
  return apiAdmin.post("api/admin/auth/logout");
};

export const changePassword = (data) => {
  return apiAdmin.put("api/me/change-password", data);
}
