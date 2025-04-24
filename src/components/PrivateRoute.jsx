import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../utils/auth";
import { STORAGE_AUTH_ACCESS_KEY } from "../constants/authentication";

const PrivateRoute = () => {
  const isAuthenticated = !!getAccessToken(STORAGE_AUTH_ACCESS_KEY);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
