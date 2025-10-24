import axios from "axios";
import { getLocalStorage } from "./localStorage";

const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`[Request] ${config.method?.toUpperCase()} ${config.url}`);
    const userInfoFromStorage = getLocalStorage("userInfo");
    if (userInfoFromStorage) {
      config.headers.Authorization = `Bearer ${userInfoFromStorage.access_token}`;
    }
    return config;
  },
  (error) => {
    console.error("[Request Error]", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    // console.error('[Response Error]', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
