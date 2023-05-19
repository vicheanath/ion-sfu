import axios from "axios";
import { apiBaseUrl } from "./constants";
const accessTokenKey = "access_token";
const refreshTokenKey = "refresh_token";

const accessToken = localStorage.getItem(accessTokenKey);
const refreshToken = localStorage.getItem(refreshTokenKey);

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    Authorization: `Bearer ${accessToken}` || "",
  },
});
api.defaults.headers.common["Content-Type"] = "application/json";

export const refreshAccessTokenFn = async () => {
  const response = await api.post("token/refresh/", {
    refresh: refreshToken,
  });
  if (response.status === 200) {
    const { access } = response.data;
    localStorage.setItem(accessTokenKey, access);
  }
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const errMessage = error.response.data.message;
    if (errMessage?.includes("not logged in") && !originalRequest._retry) {
      originalRequest._retry = true;
      await refreshAccessTokenFn();
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);
