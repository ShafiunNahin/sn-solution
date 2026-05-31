import api from "../../shared/api/axios";

export const loginApi = (data) =>
  api.post("/login", data);

export const getAppInfo = () =>
  api.get("/settings/info");
