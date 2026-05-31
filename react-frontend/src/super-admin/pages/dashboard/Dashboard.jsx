import { useEffect, useState } from "react";

export default function Dashboard() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const adminData = localStorage.getItem("admin");
    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <div style={{ marginTop: 30 }}>
        <h2>Welcome, Admin!</h2>
        {admin && (
          <div
            style={{
              background: "#f0f0f0",
              padding: 20,
              borderRadius: 8,
              maxWidth: 500,
            }}
          >
            <p>
              <strong>App Name:</strong> {admin.app_name || "N/A"}
            </p>
            <p>
              <strong>SMS Brand:</strong> {admin.sms_brand_name || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {admin.support_email || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {admin.support_phone || "N/A"}
            </p>
            <p>
              <strong>Currency:</strong> {admin.currency || "N/A"}
            </p>
            <p>
              <strong>Timezone:</strong> {admin.timezone || "N/A"}
            </p>
          </div>
        )}
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>Quick Links</h3>
        <ul>
          <li>
            <a href="/super-admin/settings">Edit System Settings</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
