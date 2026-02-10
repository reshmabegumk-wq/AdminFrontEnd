import axios from "axios";

// ================================
// 🔥 Base URL (Your Backend)
// ================================
const BASE_URL = "http://localhost:8088/abcbank/";

// ================================
// 🚀 Axios Instance
// ================================
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});


// ================================
// 🔐 Request Interceptor
// ================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);


// ================================
// 📦 Response Interceptor
// ================================
api.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response) {

      // Auto logout if unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      console.error("API Error:", error.response.data);
    }

    return Promise.reject(error);
  }
);


// ================================
// 🎯 Common API Methods
// ================================
const API = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
};

export default API;
