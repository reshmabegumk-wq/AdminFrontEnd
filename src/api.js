// api.js
import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
    baseURL: 'http://localhost:8077/abcbank/api/', // Make sure this matches your backend URL
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add request interceptor for debugging
API.interceptors.request.use(
    config => {
        console.log('API Request:', config.method.toUpperCase(), config.url);
        console.log('Request data:', config.data);
        console.log('Request headers:', config.headers);
        return config;
    },
    error => {
        console.log('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
API.interceptors.response.use(
    response => {
        console.log('API Response:', response.status, response.config.url);
        console.log('Response data:', response.data);
        return response;
    },
    error => {
        if (error.code === 'ECONNABORTED') {
            console.log('Request timeout for:', error.config.url);
        } else if (error.response) {
            console.log('Error response:', error.response.status, error.response.data);
        } else if (error.request) {
            console.log('No response received:', error.request);
        } else {
            console.log('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

// Add CancelToken support
API.CancelToken = axios.CancelToken;
API.isCancel = axios.isCancel;

export default API;


// import axios from "axios";

// // ================================
// // 🔥 Base URL (Your Backend)
// // ================================
// const BASE_URL = "http://localhost:8077/abcbank/api/";

// // ================================
// // 🚀 Axios Instance
// // ================================
// const api = axios.create({
//   baseURL: BASE_URL,
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json"
//   }
// });


// // ================================
// // 🔐 Request Interceptor
// // ================================
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     console.log("API Request:", config.method?.toUpperCase(), config.url);
//     return config;
//   },
//   (error) => Promise.reject(error)
// );


// // ================================
// // 📦 Response Interceptor
// // ================================
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {

//     if (error.response) {

//       // Auto logout if unauthorized
//       if (error.response.status === 401) {
//         localStorage.removeItem("token");
//         window.location.href = "/login";
//       }

//       console.error("API Error:", error.response.data);
//     }

//     return Promise.reject(error);
//   }
// );


// // ================================
// // 🎯 Common API Methods
// // ================================
// const API = {
//   get: (url, config = {}) => api.get(url, config),
//   post: (url, data = {}, config = {}) => api.post(url, data, config),
//   put: (url, data = {}, config = {}) => api.put(url, data, config),
//   delete: (url, config = {}) => api.delete(url, config),
// };

// // ================================
// // 👥 User Management APIs
// // ================================
// export const createUser = async (userData) => {
//   console.log("Hi");
  
//   try {
//     const response = await API.post('users/save', userData);
//     return response.data;
//   } catch (error) {
//     console.error('Error creating user:', error);
//     throw error;
//   }
// };

// export default API;
