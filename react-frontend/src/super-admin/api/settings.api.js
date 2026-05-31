import api from "../../shared/api/axios";

// GET system settings
export const getSettings = () => api.get("/settings");

// UPDATE system settings
export const updateSettings = (id, data) =>
  api.put(`/settings/${id}`, data);

// CREATE system settings (optional)
export const createSettings = (data) =>
  api.post("/settings", data);

// DELETE system settings
export const deleteSettings = (id) =>
  api.delete(`/settings/${id}`);

// UPLOAD file
export const uploadFile = (file, type) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
