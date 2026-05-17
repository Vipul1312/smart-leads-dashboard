import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Button from "./Button";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        Smart Leads
      </Link>
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="px-3 py-1 rounded border dark:border-gray-600"
        >
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
        {user && (
          <>
            <span className="text-sm hidden sm:block">
              {user.name} ({user.role})
            </span>
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
