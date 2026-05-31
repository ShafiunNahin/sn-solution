import { useEffect, useState } from "react";
import { getSettings, updateSettings } from "../../api/settings.api";
import { toast } from "react-toastify";
import FileUploadZone from "../../components/FileUploadZone";

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: 10,
  border: "1px solid #ccc",
  borderRadius: 4,
  fontSize: 14,
  fontFamily: "Arial, sans-serif",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  fontWeight: "bold",
  marginBottom: 5,
  color: "#333",
};

const containerStyle = {
  padding: 20,
  maxWidth: 800,
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 20,
  marginBottom: 20,
};

const fullWidthStyle = {
  gridColumn: "1 / -1",
};

const buttonStyle = {
  padding: "10px 20px",
  marginRight: 10,
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 14,
  fontWeight: "bold",
};

const primaryButtonStyle = {
  ...buttonStyle,
  background: "#007bff",
  color: "#fff",
};

const dangerButtonStyle = {
  ...buttonStyle,
  background: "#dc3545",
  color: "#fff",
};

export default function SystemSettings() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [changePassword, setChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    load();
  }, []);

  // Update favicon when form changes
  useEffect(() => {
    if (form?.favicon) {
      const link = document.querySelector("link[rel='icon']");
      const baseURL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
      const backendURL = baseURL.replace("/api", "");
      const fullUrl = form.favicon.startsWith("http") ? form.favicon : backendURL + form.favicon;
      if (link) link.href = fullUrl;
    }
  }, [form?.favicon]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getSettings();
      setForm(res.data?.data ?? res.data ?? {});
    } catch (err) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    let err = {};

    if (!form.app_name) err.app_name = "App name is required";
    if (!form.sms_brand_name) err.sms_brand_name = "SMS brand is required";
    if (!form.support_phone) err.support_phone = "Phone is required";
    if (!form.support_email) err.support_email = "Email is required";
    if (changePassword && !newPassword)
      err.password = "New password is required";
    if (changePassword && newPassword.length < 6)
      err.password = "Password must be at least 6 characters";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix validation errors");
      return;
    }

    try {
      setSaving(true);
      const data = { ...form };

      if (changePassword) {
        data.password = newPassword;
      } else {
        delete data.password;
      }

      await updateSettings(form.id, data);
      toast.success("Settings updated successfully");
      setChangePassword(false);
      setNewPassword("");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <h3>Loading settings...</h3>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1>System Settings</h1>
      <p style={{ color: "#666", marginBottom: 20 }}>
        Configure your application's core settings and system information
      </p>

      <form onSubmit={handleSubmit}>
        {/* Basic Information Section */}
        <div
          style={{
            background: "#f8f9fa",
            padding: 20,
            borderRadius: 8,
            marginBottom: 20,
            border: "1px solid #dee2e6",
          }}
        >
          <h2 style={{ marginTop: 0, color: "#333" }}>Basic Information</h2>

          <div style={gridStyle}>
            <div>
              <label style={labelStyle}>App Name</label>
              <input
                type="text"
                name="app_name"
                value={form.app_name || ""}
                onChange={handleChange}
                placeholder="e.g., SN Solution"
                style={inputStyle}
              />
              {errors.app_name && (
                <p style={{ color: "#dc3545", fontSize: 12, margin: "5px 0" }}>
                  {errors.app_name}
                </p>
              )}
            </div>

            <div>
              <label style={labelStyle}>SMS Brand Name</label>
              <input
                type="text"
                name="sms_brand_name"
                value={form.sms_brand_name || ""}
                onChange={handleChange}
                placeholder="e.g., SN SMS"
                style={inputStyle}
              />
              {errors.sms_brand_name && (
                <p style={{ color: "#dc3545", fontSize: 12, margin: "5px 0" }}>
                  {errors.sms_brand_name}
                </p>
              )}
            </div>

            <div>
              <label style={labelStyle}>Support Email</label>
              <input
                type="email"
                name="support_email"
                value={form.support_email || ""}
                onChange={handleChange}
                placeholder="admin@example.com"
                style={inputStyle}
              />
              {errors.support_email && (
                <p style={{ color: "#dc3545", fontSize: 12, margin: "5px 0" }}>
                  {errors.support_email}
                </p>
              )}
            </div>

            <div>
              <label style={labelStyle}>Support Phone</label>
              <input
                type="text"
                name="support_phone"
                value={form.support_phone || ""}
                onChange={handleChange}
                placeholder="+880123456789"
                style={inputStyle}
              />
              {errors.support_phone && (
                <p style={{ color: "#dc3545", fontSize: 12, margin: "5px 0" }}>
                  {errors.support_phone}
                </p>
              )}
            </div>

            <div>
              <label style={labelStyle}>Currency</label>
              <input
                type="text"
                name="currency"
                value={form.currency || ""}
                onChange={handleChange}
                placeholder="e.g., BDT, USD"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Timezone</label>
              <input
                type="text"
                name="timezone"
                value={form.timezone || ""}
                onChange={handleChange}
                placeholder="e.g., Asia/Dhaka"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={fullWidthStyle}>
            <label style={labelStyle}>Address</label>
            <textarea
              name="address"
              value={form.address || ""}
              onChange={handleChange}
              placeholder="Enter complete address"
              style={{
                ...inputStyle,
                minHeight: 100,
                resize: "vertical",
              }}
            />
          </div>
        </div>

        {/* Branding Section */}
        <div
          style={{
            background: "#f8f9fa",
            padding: 20,
            borderRadius: 8,
            marginBottom: 20,
            border: "1px solid #dee2e6",
          }}
        >
          <h2 style={{ marginTop: 0, color: "#333" }}>Branding</h2>

          <FileUploadZone
            type="logo"
            label="Logo"
            onUpload={(url) => setForm({ ...form, logo: url })}
            currentImageUrl={form.logo}
          />

          <FileUploadZone
            type="favicon"
            label="Favicon"
            onUpload={(url) => setForm({ ...form, favicon: url })}
            currentImageUrl={form.favicon}
          />
        </div>

        {/* Security Section */}
        <div
          style={{
            background: "#f8f9fa",
            padding: 20,
            borderRadius: 8,
            marginBottom: 20,
            border: "1px solid #dee2e6",
          }}
        >
          <h2 style={{ marginTop: 0, color: "#333" }}>Security</h2>

          <div style={{ marginBottom: 15 }}>
            <label style={{ ...labelStyle, marginBottom: 10 }}>
              <input
                type="checkbox"
                checked={changePassword}
                onChange={(e) => setChangePassword(e.target.checked)}
                style={{ marginRight: 8 }}
              />
              Change Password
            </label>
          </div>

          {changePassword && (
            <div>
              <label style={labelStyle}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 characters)"
                style={inputStyle}
              />
              {errors.password && (
                <p style={{ color: "#dc3545", fontSize: 12, margin: "5px 0" }}>
                  {errors.password}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: 30, paddingTop: 20, borderTop: "1px solid #dee2e6" }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              ...primaryButtonStyle,
              opacity: saving ? 0.6 : 1,
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={load}
            disabled={saving}
            style={{
              ...buttonStyle,
              background: "#6c757d",
              color: "#fff",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            Reset
          </button>
        </div>

        {/* Info Message */}
        <div
          style={{
            marginTop: 20,
            padding: 15,
            background: "#e7f3ff",
            border: "1px solid #b3d9ff",
            borderRadius: 4,
            color: "#004085",
            fontSize: 13,
          }}
        >
          <strong>Note:</strong> Changes are saved immediately. Keep your
          settings secure and up to date.
        </div>
      </form>
    </div>
  );
}
