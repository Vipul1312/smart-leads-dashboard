import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ||
  "https://smart-leads-dashboard-e9xi.onrender.com";

const api = axios.create({
  baseURL,
  withCredentials: true, // agar backend cookies set karta hai to zaroori
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
