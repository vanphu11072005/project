import axios from "axios";

const adminApi = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 10000,
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default adminApi;
