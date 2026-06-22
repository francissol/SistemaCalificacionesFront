import axios from "axios";

const api = axios.create({
  baseURL: "http://franluv-001-site1.ltempurl.com",

  headers: {
    // Esto le manda al servidor la llave maestra '11313619:60-dayfreetrial' de forma transparente
    'Authorization': 'Basic ' + btoa('11313619:60-dayfreetrial')
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
