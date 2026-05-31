import { useState } from "react";
import { uploadFile } from "../api/settings.api";
import { toast } from "react-toastify";

const dragOverStyle = {
  borderColor: "#007bff",
  backgroundColor: "#e7f3ff",
};

export default function FileUploadZone({ type, label, onUpload, currentImageUrl }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const baseURL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
  const backendURL = baseURL.replace("/api", "");

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return backendURL + url;
  };

  const [style, setStyle] = useState({
    border: "2px dashed #ccc",
    borderRadius: "8px",
    padding: "40px 20px",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: "#f9f9f9",
    transition: "all 0.3s",
  });

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setStyle((prev) => ({ ...prev, ...dragOverStyle }));
  };

  const handleDragLeave = () => {
    setIsDragging(false);
    setStyle((prev) => ({
      ...prev,
      borderColor: "#ccc",
      backgroundColor: "#f9f9f9",
    }));
  };

  const handleFileSelect = async (file) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload file
    try {
      setUploading(true);
      const res = await uploadFile(file, type);
      if (res.data.url) {
        onUpload(res.data.url);
        toast.success("File uploaded successfully");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setStyle((prev) => ({
      ...prev,
      borderColor: "#ccc",
      backgroundColor: "#f9f9f9",
    }));

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontWeight: "bold", marginBottom: 10 }}>
        {label}
      </label>

      {/* Upload Zone */}
      <div
        style={style}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          style={{ display: "none" }}
          id={`file-input-${type}`}
          disabled={uploading}
        />
        <label
          htmlFor={`file-input-${type}`}
          style={{ cursor: uploading ? "not-allowed" : "pointer" }}
        >
          <div style={{ pointerEvents: "none" }}>
            <p style={{ margin: "0 0 10px 0", fontSize: 16, fontWeight: "bold" }}>
              📁 Drag and drop your image here
            </p>
            <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
              or click to select a file
            </p>
            <p style={{ margin: "10px 0 0 0", color: "#999", fontSize: 12 }}>
              Max size: 5MB | Formats: JPG, PNG, GIF, WebP
            </p>
            {uploading && (
              <p style={{ margin: "10px 0 0 0", color: "#007bff", fontSize: 14 }}>
                ⏳ Uploading...
              </p>
            )}
          </div>
        </label>
      </div>

      {/* Preview Section */}
      <div style={{ marginTop: 20, display: "flex", gap: 20 }}>
        {/* Current Image */}
        {currentImageUrl && (
          <div style={{ textAlign: "center", flex: 1 }}>
            <p style={{ fontSize: 12, color: "#666", marginBottom: 10 }}>
              Current Image
            </p>
            <img
              src={getImageUrl(currentImageUrl)}
              alt="current"
              style={{
                maxWidth: "100%",
                maxHeight: 200,
                border: "1px solid #ddd",
                borderRadius: 4,
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        {/* New Preview */}
        {preview && (
          <div style={{ textAlign: "center", flex: 1 }}>
            <p style={{ fontSize: 12, color: "#28a745", marginBottom: 10 }}>
              New Preview
            </p>
            <img
              src={preview}
              alt="preview"
              style={{
                maxWidth: "100%",
                maxHeight: 200,
                border: "2px solid #28a745",
                borderRadius: 4,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
