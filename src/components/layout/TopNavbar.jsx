import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase";
import { useAuth } from "../../context/AuthContext";
import { useContext } from "react";
import { NavbarProvider, useNavbarContext } from "../../context/NavbarContext";

export default function Navbar() {
  const { title } = useNavbarContext();
  const { loggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await signOut(auth);
    // Set Context as Logged Out
    logout();
    navigate("/");
  };
  return (
    <div className="sticky top-0 z-50 shadow-sm bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
      <div className="text-xl font-semibold">{title}</div>
      {loggedIn ? (
        <div>
          <button
            onClick={handleSignOut}
            type="button"
            class="text-white  bg-red-700 box-border border border-transparent  rounded-base text-sm  py-2"
          >
            logout
          </button>
        </div>
      ) : null}
    </div>
  );
}
