import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DashboardRedirect() {
  const { userData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) return;

    if (userData.role === "superadmin") {
      navigate("/superadmin");
    } else if (userData.role === "admin") {
      navigate("/admin");
    } else if (userData.role === "teacher") {
      navigate("/teacher");
    }
  }, [userData, navigate]);

  return <div>Loading dashboard...</div>;
}

export default DashboardRedirect;
