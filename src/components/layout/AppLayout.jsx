import { Outlet } from "react-router-dom";
import Navbar from "./TopNavbar";
import BottomNav from "./BottomNavigation";

export default function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1 px-4">
        <Outlet />
      </main>

      {/* <BottomNav /> */}
    </div>
  );
}
