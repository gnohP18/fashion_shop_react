import apiAdmin from "./apiAdmin";

export const loginAsync = ({ username, password }) => {
  return apiAdmin.post("api/admin/auth/login", { username, password });
};
