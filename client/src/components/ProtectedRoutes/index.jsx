import { Navigate } from "react-router-dom";
import { LOGIN_PATH } from "../../constant/appPaths";

const ProtectedRoute = ({ user = null, Component,  }) => {
  if (!user) return <Navigate to={LOGIN_PATH} />;

  return Component;
};

export default ProtectedRoute;
