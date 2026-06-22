import axios from "axios";

const api = axios.create({
  baseURL: "http://franluv-001-site1.ltempurl.com",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;