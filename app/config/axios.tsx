import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Optional: Add request interceptor (helps debugging)
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add response interceptor (better error handling)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;