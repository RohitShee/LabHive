import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, LogOut, LayoutDashboard } from "lucide-react";
import useAuthStore from "../stores/useAuthStore";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between bg-gray-800 p-4">
      {/* Left: Logo */}
      <div className="flex items-center">
        <Link to="/" className="text-blue-400 text-xl font-bold">
          LabHive
        </Link>
      </div>
      {/* Right: Icons */}
      <div className="flex items-center space-x-8">
        {user && (
          <>
            {/* Dashboard Icon for Admin */}
            {user.role === "Admin" && (
              <Link to="/admin" title="Dashboard">
                <LayoutDashboard className="text-white w-6 h-6 hover:text-blue-400" />
              </Link>
            )}
            {/* User Profile Icon */}
            <Link to="/profile" title="Profile">
              <User className="text-white w-6 h-6 hover:text-blue-400" />
            </Link>
            {/* Logout Icon */}
            <button onClick={handleLogout} title="Logout">
              <LogOut className="text-white w-6 h-6 hover:text-blue-400" />
            </button>
          </>
        )}
        {!user && (
          <Link to="/login" className="text-white hover:text-blue-400">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
