// src/components/PublicRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../utils/auth";

const PublicRoute = () => {
  const isAuthenticated = !!getAccessToken();

  return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
