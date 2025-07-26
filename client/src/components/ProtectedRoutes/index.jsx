import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user = null, component,  }) => {
  if (!user) return <Navigate to={LOGIN_PATH} />;

  return component;
};

export default ProtectedRoute;
