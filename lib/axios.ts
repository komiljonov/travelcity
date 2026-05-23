import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// // Request interceptor (attach token, etc.)
// api.interceptors.request.use((config) => {
//   // const token = localStorage.getItem("token");
//   // if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // Response interceptor (handle errors globally)
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // handle unauthorized
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
