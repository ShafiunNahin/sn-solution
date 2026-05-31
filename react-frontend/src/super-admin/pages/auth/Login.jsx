import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi, getAppInfo } from "../../api/auth.api";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [appInfo, setAppInfo] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Load app info on component mount
    loadAppInfo();
  }, []);

  const loadAppInfo = async () => {
    try {
      const res = await getAppInfo();
      setAppInfo(res.data);
    } catch (err) {
      console.error("Failed to load app info:", err);
      setAppInfo({ app_name: "Super Admin" });
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const res = await loginApi(form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data.admin));

      // Set favicon from admin data
      if (res.data.admin?.favicon) {
        const baseURL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
        const backendURL = baseURL.replace("/api", "");
        const fullUrl = res.data.admin.favicon.startsWith("http") ? res.data.admin.favicon : backendURL + res.data.admin.favicon;
        const link = document.querySelector("link[rel='icon']");
        if (link) link.href = fullUrl;
      }

      toast.success("Login Successful!");
      navigate("/super-admin/settings");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const getLogoUrl = (logoUrl) => {
    if (!logoUrl) return null;
    if (logoUrl.startsWith("http")) return logoUrl;
    const baseURL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
    const backendURL = baseURL.replace("/api", "");
    return backendURL + logoUrl;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 450,
          padding: 40,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Header with Logo */}
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          {appInfo?.logo && (
            <img
              src={getLogoUrl(appInfo.logo)}
              alt="Logo"
              style={{
                maxHeight: 60,
                marginBottom: 15,
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              color: "#1f2937",
              marginBottom: 5,
            }}
          >
            {appInfo?.app_name || "Super Admin"}
          </h1>
          <p
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: 14,
            }}
          >
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 600,
                color: "#374151",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="admin@example.com"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1px solid #d1d5db",
                borderRadius: 6,
                fontSize: 14,
                boxSizing: "border-box",
                transition: "border-color 0.3s, box-shadow 0.3s",
                outline: "none",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#667eea";
                e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 600,
                color: "#374151",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  paddingRight: 45,
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  fontSize: 14,
                  boxSizing: "border-box",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#667eea";
                  e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#d1d5db";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: 18,
                  opacity: loading ? 0.5 : 1,
                }}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px 14px",
              background: loading ? "#9ca3af" : "#667eea",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.3s",
              marginBottom: 15,
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.background = "#5568d3";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.background = "#667eea";
            }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            paddingTop: 15,
            borderTop: "1px solid #e5e7eb",
            fontSize: 13,
            color: "#6b7280",
          }}
        >
          <p style={{ margin: 0 }}>
            Default: admin@admin.com / password
          </p>
        </div>
      </div>
    </div>
  );
}
