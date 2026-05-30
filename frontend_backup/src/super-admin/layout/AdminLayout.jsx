import { Outlet, Link, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    
    // Reset favicon to default
    const link = document.querySelector("link[rel='icon']");
    if (link) {
      link.href = "/favicon.ico";
    }
    
    navigate("/super-admin/login");
  };

  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: "column" }}>
      <header
        style={{
          background: "#111827",
          color: "#fff",
          padding: "15px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0 }}>Super Admin Panel</h1>
        <button
          onClick={handleLogout}
          style={{
            background: "#dc2626",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        <aside
          style={{
            width: 250,
            background: "#111827",
            color: "#fff",
            padding: 20,
            overflowY: "auto",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Menu</h2>

          <nav style={{ marginTop: 20 }}>
            <Link
              to="/super-admin/dashboard"
              style={{
                color: "#fff",
                display: "block",
                marginBottom: 15,
                textDecoration: "none",
                padding: "8px 12px",
                borderRadius: 4,
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#1f2937")}
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              📊 Dashboard
            </Link>

            <Link
              to="/super-admin/settings"
              style={{
                color: "#fff",
                display: "block",
                marginBottom: 15,
                textDecoration: "none",
                padding: "8px 12px",
                borderRadius: 4,
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#1f2937")}
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              ⚙️ App Settings
            </Link>
          </nav>
        </aside>

        <main style={{ flex: 1, padding: 20, overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
