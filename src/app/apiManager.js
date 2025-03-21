import axios from "axios";
import store from "../app/store"; 
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
    if (error.response?.status === 401) {
      // If it's a 401 error, clear the tokens and redirect to login
      store.dispatch(clearTokens());
      // window.location.href = "/login";
    } else if (error.response?.status === 401 && !originalRequest._retry) {
      // Attempt to refresh token if it's not already in the retry process
      originalRequest._retry = true;
      const newToken = await refreshToken();
      if (newToken) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

// API methods
export const get = (url, params) => api.get(url, { params });
export const post = (url, data) => api.post(url, data);
export const put = (url, data) => api.put(url, data);
export const patch = (url, data) => api.patch(url, data);
export const remove = (url) => api.delete(url);
