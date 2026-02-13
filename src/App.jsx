import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ClassDetails from "./pages/ClassDetails";
import MarkAttendance from "./pages/MarkAttendance";
import AcceptInvite from "./pages/AcceptInvite";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardRedirect from "./pages/DashboardRedirect";
import TeacherDashboard from "./pages/TeacherDashboard";

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["teacher", "admin", "superadmin"]}>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />
        <Route path="/class/:id" element={<ClassDetails />} />
        <Route path="/class/:id/attendance" element={<MarkAttendance />} />
        <Route path="/accept-invite" element={<AcceptInvite />} />
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
