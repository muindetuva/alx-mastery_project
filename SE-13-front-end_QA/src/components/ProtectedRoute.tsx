import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute() {
  const { tokens } = useAuth();
  const location = useLocation();
  return tokens?.accessToken
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: location }} />;
}
