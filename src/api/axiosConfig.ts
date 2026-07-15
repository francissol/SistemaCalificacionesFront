import axios from "axios";

const api = axios.create({
  //baseURL: "https://sistemacalificaciones-production.up.railway.app/api",
   baseURL: "https://franluv-001-site1.ltempurl.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
