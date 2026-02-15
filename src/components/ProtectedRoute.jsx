import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, userData, login } = useAuth();
  console.warn("CurrentUser : ", currentUser, "userData : ", userData);
  if (!currentUser) {
    return <Navigate to="/" />;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  if (allowedRoles && !allowedRoles.includes(userData?.role)) {
    return <Navigate to="/" />;
  }
  // Set Context as Logged In
  login();
  return children;
}

export default ProtectedRoute;
