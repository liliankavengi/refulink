import axios from "axios";
import storage from "../utils/storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT access token to every request
api.interceptors.request.use(async (config) => {
  const token = await storage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, attempt token refresh once
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = await storage.getItem("refresh_token");
        const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
          refresh,
        });
        await storage.setItem("access_token", data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch {
        await storage.multiRemove(["access_token", "refresh_token"]);
      }
    }
    throw error;
  }
);

export default api;
