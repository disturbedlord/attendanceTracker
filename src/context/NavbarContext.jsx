import { createContext, useContext, useEffect, useState } from "react";
import { matchRoutes, useLocation } from "react-router-dom";

const NavbarContext = createContext();

const routeTitles = [
  {
    path: "/",
    title: "Attendance Tracker",
  },
  {
    path: "/teacher",
    title: "Teacher Dashboard",
  },
  { path: "/teacher/class/:classId", title: "Class Details" },
  { path: "/accept-invite/", title: "Invitation" },
  { path: "/admin/", title: "Admin Dashboard" },
];

export function NavbarProvider({ children }) {
  const [title, setTitle] = useState("");
  const location = useLocation();

  useEffect(() => {
    const matches = matchRoutes(routeTitles, location);
    if (matches) {
      const matchedRoutes = matches[matches.length - 1].route;
      setTitle(matchedRoutes.title);
    }
  }, [location]);

  return (
    <NavbarContext.Provider value={{ title, setTitle }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbarContext() {
  return useContext(NavbarContext);
}
