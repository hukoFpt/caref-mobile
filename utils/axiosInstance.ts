import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:8080/https://swd-392-api.vercel.app/api/", //For web
  baseURL: "https://swd-392-api.vercel.app/api/", //For mobile
  timeout: 10000, 
  headers: {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authorization token to headers
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle 401 error (e.g., redirect to login)
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;