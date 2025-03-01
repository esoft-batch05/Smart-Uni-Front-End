import axios from "axios";
import store from "../app/store"; // Import store
import { setTokens, clearTokens } from "../Reducers/authSlice";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Function to get the token from Redux store
const getAccessToken = () => store.getState().auth.accessToken;

// Function to refresh token
const refreshToken = async () => {
  try {
    const currentState = store.getState().auth;
    const refreshToken = currentState.refreshToken;
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await axios.post(`${API_BASE_URL}/admin/refreshToken`, {
      refreshToken: refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;


    // Update Redux store
    store.dispatch(setTokens({ accessToken, refreshToken: newRefreshToken }));

    return accessToken;
  } catch (error) {
    console.error("Token refresh failed", error);
    store.dispatch(clearTokens());
    return null;
  }
};

// Request interceptor to attach token
api.interceptors.request.use(
  async (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshToken();
      if (newToken) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    }
    store.dispatch(clearTokens());
    window.location.href = "/login";
    return Promise.reject(error);
  }
);

// API methods
const apiMethods = {
  get: (url, params) => api.get(url, { params }),
  post: (url, data) => api.post(url, data),
  put: (url, data) => api.put(url, data),
  patch: (url, data) => api.patch(url, data),
  delete: (url) => api.delete(url),
};

export { api, apiMethods };
