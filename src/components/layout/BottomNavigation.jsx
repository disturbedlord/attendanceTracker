import { NavLink } from "react-router-dom";

export default function BottomNav() {
  const baseClass =
    "flex flex-col items-center justify-center text-xs font-medium";

  return (
    <div className=" fixed bottom-0 left-0 right-0 h-16 border-t border-gray-200 flex justify-around items-center z-50">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? "text-red-600" : "text-gray-500"}`
        }
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/classes"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? "text-blue-600" : "text-gray-500"}`
        }
      >
        Classes
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? "text-blue-600" : "text-gray-500"}`
        }
      >
        Profile
      </NavLink>
    </div>
  );
}
