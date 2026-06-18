import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  if (
    user.role !== "admin" &&
    user.role !== "staff"
  ) {
    return <Navigate to="/dealer/login" replace />;
  }

  return children;
}

export default ProtectedRoute;