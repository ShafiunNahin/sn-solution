import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";

import AdminLayout from "./super-admin/layout/AdminLayout";

import Dashboard from "./super-admin/pages/dashboard/Dashboard";
import SystemSettings from "./super-admin/pages/settings/SystemSettings";
import Login from "./super-admin/pages/auth/Login";

export default function App() {
  useEffect(() => {
    // Set favicon from localStorage on app load
    try {
      const adminData = localStorage.getItem("admin");
      if (adminData) {
        const admin = JSON.parse(adminData);
        if (admin.favicon) {
          const baseURL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
          const backendURL = baseURL.replace("/api", "");
          const fullUrl = admin.favicon.startsWith("http") ? admin.favicon : backendURL + admin.favicon;
          const link = document.querySelector("link[rel='icon']");
          if (link) link.href = fullUrl;
        }
      }
    } catch (e) {
      console.error("Error setting favicon:", e);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* Default Redirect */}
        <Route
          path="/"
          element={<Navigate to="/super-admin/login" />}
        />

        {/* Login */}
        <Route
          path="/super-admin/login"
          element={<Login />}
        />

        {/* Super Admin */}
        <Route
          path="/super-admin"
          element={<AdminLayout />}
        >
          <Route
            path="dashboard"
            element={<Dashboard />}
          />
          <Route
            path="settings"
            element={<SystemSettings />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
