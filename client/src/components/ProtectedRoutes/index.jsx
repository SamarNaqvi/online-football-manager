import { Navigate } from "react-router-dom";
import { LOGIN_PATH } from "../../constant/appPaths";

const ProtectedRoute = ({ user = null, component,  }) => {
  if (!user) return <Navigate to={LOGIN_PATH} />;

  return component;
};

export default ProtectedRoute;
