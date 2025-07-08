import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/UploadPage";
import ForecastPage from "./pages/ForecastPage";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

// Utils
import { isTokenExpired, getToken } from "./utils/utils";

// Components
import Sidebar from "./components/sidebar";
import ReorderTable from "./components/ReorderTable";
import SalesTrendChart from "./components/SalesTrendChart";
import TopSKUsBarChart from "./components/TopSKUsBarChart";
import ForecastChart from "./components/ForecastChart";

// Auth check
const isAuthenticated = () => {
  const token = getToken();
  return token && !isTokenExpired(token);
};

// Private Route wrapper
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

// Layout Wrapper with toggle sidebar
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className={`transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0"} bg-gray-800 text-white`}> 
        {sidebarOpen && <Sidebar />}
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow p-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            {sidebarOpen ? "Close Menu" : "Open Menu"}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes with Layout */}
      <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
      <Route path="/upload" element={<PrivateRoute><Layout><UploadPage /></Layout></PrivateRoute>} />
      <Route path="/forecast" element={<PrivateRoute><Layout><ForecastPage /></Layout></PrivateRoute>} />
      <Route path="/analytics" element={<PrivateRoute><Layout><Analytics /></Layout></PrivateRoute>} />
      <Route path="/charts/sales-trend" element={<PrivateRoute><Layout><SalesTrendChart /></Layout></PrivateRoute>} />
      <Route path="/charts/top-skus" element={<PrivateRoute><Layout><TopSKUsBarChart /></Layout></PrivateRoute>} />
      <Route path="/charts/forecast" element={<PrivateRoute><Layout><ForecastChart /></Layout></PrivateRoute>} />
      <Route path="/reorder" element={<PrivateRoute><Layout><ReorderTable /></Layout></PrivateRoute>} />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
