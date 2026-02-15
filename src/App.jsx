import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MarkAttendance from "./pages/MarkAttendance";
import AcceptInvite from "./pages/AcceptInvite";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardRedirect from "./pages/DashboardRedirect";
import TeacherDashboard from "./pages/TeacherDashboard";
import ClassDetails from "./pages/ClassDetails";
import AppLayout from "./components/layout/AppLayout";

function App() {
  return (
    <div>
      <Routes>
        <Route element={<AppLayout />}>
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
          <Route
            path="/teacher/class/:classId"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <ClassDetails />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
