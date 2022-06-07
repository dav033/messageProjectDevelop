import useAuth from "../auth/useAuth";
import { Navigate, useLocation } from "react-router-dom";

export default function LoggedRoutes({ children }) {
  const { isLogged } = useAuth();
  const location = useLocation();
  console.log(isLogged());
  if (isLogged()) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
}
