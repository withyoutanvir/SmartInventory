import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UploadCloud,
  LineChart,
  BarChart,
  Package,
  LogOut
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard /> },
    { name: "Upload", path: "/upload", icon: <UploadCloud /> },
    { name: "Forecast", path: "/forecast", icon: <LineChart /> },
    { name: "Analytics", path: "/analytics", icon: <BarChart /> },
    { name: "Reorder", path: "/reorder", icon: <Package /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="w-64 h-screen bg-[#111827] text-white fixed top-0 left-0 flex flex-col justify-between shadow-lg">
      <div>
        <div className="text-2xl font-bold text-center py-6 border-b border-gray-700">Smart Inventory</div>
        <nav className="mt-6 space-y-2 px-4">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all hover:bg-gray-700 ${
                location.pathname === link.path ? "bg-gray-800" : ""
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 w-full text-left border-t border-gray-700"
      >
        <LogOut className="text-red-400" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;