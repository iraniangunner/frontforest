import axios, { InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    requiresAuth?: boolean;
    _retry?: boolean;
  }
}

const api = axios.create({
  baseURL: API_URL,
});

// ----------------------
// Request Interceptor
// ----------------------
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (config.requiresAuth) {
    try {
      const res = await fetch("/api/token");
      const data = await res.json();

      if (data.token) {
        config.headers.set("Authorization", `Bearer ${data.token}`);
      }
    } catch (err) {
      console.error("Error fetching token:", err);
    }
  }
  return config;
});

// ----------------------
// Response Interceptor (Token Refresh)
// ----------------------
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh for non-401 errors or already retried requests
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/verify-otp") ||
      originalRequest.url?.includes("/auth/send-otp")
    ) {
      return Promise.reject(error);
    }

    // If already refreshing, queue the request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Call Next.js API route to refresh token
      const res = await fetch("/api/refresh-token", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error("Refresh failed");
      }

      const newToken = data.access_token;

      processQueue(null, newToken);
      isRefreshing = false;

      // Retry original request with new token
      originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);
      isRefreshing = false;

      // Redirect to login on refresh failure
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return Promise.reject(err);
    }
  }
);

export default api;