import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { JSX } from "react";

const ProtectedRoutes = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? children : <Navigate to="/" replace />;
};

export default ProtectedRoutes;
