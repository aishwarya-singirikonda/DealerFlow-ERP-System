import { Navigate } from "react-router-dom";

function DealerProtectedRoute({ children }) {

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/dealer/login" replace />;
  }

  if (user.role !== "dealer") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default DealerProtectedRoute;