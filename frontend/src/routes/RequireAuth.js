import useAuth from "../auth/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function RequireAuth({ children }) {
  const { isLogged, getUser } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    getUser();
  }, []);

  if (!isLogged()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
