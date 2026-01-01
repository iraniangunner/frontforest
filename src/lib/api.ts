import axios, {
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Extend both config types
declare module "axios" {
  export interface AxiosRequestConfig {
    requiresAuth?: boolean;
  }
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
  reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
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

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/verify-otp") ||
      originalRequest.url?.includes("/auth/send-otp")
    ) {
      return Promise.reject(error);
    }

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

      originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);
      isRefreshing = false;

      // if (typeof window !== "undefined") {
      //   window.location.href = "/login";
      // }

      return Promise.reject(err);
    }
  }
);

export default api;

/*
|--------------------------------------------------------------------------
| Admin API Functions
|--------------------------------------------------------------------------
*/

// Categories API
export const categoriesAPI = {
  getMenu: () => api.get("/categories/menu"),

  getAll: (params?: Record<string, unknown>) =>
    api.get("/admin/categories", { params, requiresAuth: true }),

  getOne: (id: number) =>
    api.get(`/admin/categories/${id}`, { requiresAuth: true }),

  create: (data: FormData) =>
    api.post("/admin/categories", data, {
      headers: { "Content-Type": "multipart/form-data" },
      requiresAuth: true,
    }),

  update: (id: number, data: FormData) =>
    api.post(`/admin/categories/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
      requiresAuth: true,
    }),

  delete: (id: number) =>
    api.delete(`/admin/categories/${id}`, { requiresAuth: true }),

  toggle: (id: number) =>
    api.patch(`/admin/categories/${id}/toggle`, {}, { requiresAuth: true }),
};

// Tags API
export const tagsAPI = {
  getAll: () => api.get("/tags"),
  getGrouped: () => api.get("/tags?grouped=1"),

  adminGetAll: (params?: Record<string, unknown>) =>
    api.get("/admin/tags", { params, requiresAuth: true }),

  getOne: (id: number) =>
    api.get(`/admin/tags/${id}`, { requiresAuth: true }),

  create: (data: Record<string, unknown>) =>
    api.post("/admin/tags", data, { requiresAuth: true }),

  update: (id: number, data: Record<string, unknown>) =>
    api.put(`/admin/tags/${id}`, data, { requiresAuth: true }),

  delete: (id: number) =>
    api.delete(`/admin/tags/${id}`, { requiresAuth: true }),

  toggle: (id: number) =>
    api.patch(`/admin/tags/${id}/toggle`, {}, { requiresAuth: true }),
};

// Components API
export const componentsAPI = {
  getAll: (params?: Record<string, unknown>) =>
    api.get("/admin/components", { params, requiresAuth: true }),

  getOne: (id: number) =>
    api.get(`/admin/components/${id}`, { requiresAuth: true }),

  getStatistics: () =>
    api.get("/admin/components/statistics", { requiresAuth: true }),

  create: (data: FormData) =>
    api.post("/admin/components", data, {
      headers: { "Content-Type": "multipart/form-data" },
      requiresAuth: true,
    }),

  update: (id: number, data: FormData) =>
    api.post(`/admin/components/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
      requiresAuth: true,
    }),

  delete: (id: number) =>
    api.delete(`/admin/components/${id}`, { requiresAuth: true }),

  toggle: (id: number) =>
    api.patch(`/admin/components/${id}/toggle`, {}, { requiresAuth: true }),

  toggleFeatured: (id: number) =>
    api.patch(`/admin/components/${id}/toggle-featured`, {}, { requiresAuth: true }),
};

// Reviews API
export const reviewsAPI = {
  getAll: (params?: Record<string, unknown>) =>
    api.get("/admin/reviews", { params, requiresAuth: true }),

  getOne: (id: number) =>
    api.get(`/admin/reviews/${id}`, { requiresAuth: true }),

  approve: (id: number) =>
    api.patch(`/admin/reviews/${id}/approve`, {}, { requiresAuth: true }),

  reject: (id: number) =>
    api.patch(`/admin/reviews/${id}/reject`, {}, { requiresAuth: true }),

  delete: (id: number) =>
    api.delete(`/admin/reviews/${id}`, { requiresAuth: true }),
};




// Public Components API
export const publicComponentsAPI = {
  getAll: (params?: Record<string, unknown>) =>
    api.get("/components", { params }),

  getBySlug: (slug: string) =>
    api.get(`/components/${slug}`),

  getFeatured: () =>
    api.get("/components/featured"),

  getFree: () =>
    api.get("/components/free"),

  getNewest: () =>
    api.get("/components/newest"),

  getRelated: (slug: string) =>
    api.get(`/components/${slug}/related`),

  getReviews: (slug: string, params?: Record<string, unknown>) =>
    api.get(`/components/${slug}/reviews`, { params }),

  download: (slug: string) =>
    api.get(`/components/${slug}/download`, {
      responseType: "blob",
      requiresAuth: true,
    }),

  // ✅ ADD THIS - Submit review
  addReview: (slug: string, data: { rating: number; comment?: string }) =>
    api.post(`/components/${slug}/reviews`, data, { requiresAuth: true }),

  // ✅ ADD THIS - Update review
  updateReview: (slug: string, data: { rating: number; comment?: string }) =>
    api.put(`/components/${slug}/reviews`, data, { requiresAuth: true }),

  // ✅ ADD THIS - Delete review
  deleteReview: (slug: string) =>
    api.delete(`/components/${slug}/reviews`, { requiresAuth: true }),
};
// Public Categories API
export const publicCategoriesAPI = {
  getMenu: () => api.get("/categories/menu"),
  getAll: () => api.get("/categories"),
  getBySlug: (slug: string) => api.get(`/categories/${slug}`),
};

// Public Tags API
export const publicTagsAPI = {
  getAll: () => api.get("/tags"),
  getGrouped: () => api.get("/tags?grouped=1"),
};



export const cartAPI = {
  get: () =>
    api.get("/cart", { requiresAuth: true }),

  count: () =>
    api.get("/cart/count", { requiresAuth: true }),

  add: (componentId: number) =>
    api.post(`/cart/${componentId}`, {}, { requiresAuth: true }),

  remove: (componentId: number) =>
    api.delete(`/cart/${componentId}`, { requiresAuth: true }),

  clear: () =>
    api.delete("/cart", { requiresAuth: true }),
};



export const authAPI = {
  sendOtp: (mobile: string) =>
    api.post("/auth/send-otp", { mobile }),

  verifyOtp: (mobile: string, otp: string) =>
    api.post("/auth/verify-otp", { mobile, otp }),

  me: () =>
    api.get("/auth/me", { requiresAuth: true }),

  logout: () =>
    api.post("/auth/logout", {}, { requiresAuth: true }),
};


// // Checkout API
// export const checkoutAPI = {
//   checkout: () =>
//     api.post("/checkout", {}, { requiresAuth: true }),

//   verify: (authority: string, status: string) =>
//     api.get("/payment/verify", { params: { Authority: authority, Status: status } }),
// };

// // Orders API
// export const ordersAPI = {
//   getAll: (params?: Record<string, unknown>) =>
//     api.get("/orders", { params, requiresAuth: true }),

//   getOne: (id: number) =>
//     api.get(`/orders/${id}`, { requiresAuth: true }),

//   getPurchases: (params?: Record<string, unknown>) =>
//     api.get("/purchases", { params, requiresAuth: true }),
// };

export const checkoutAPI = {
  // Create order from cart
  checkout: (data?: { coupon_code?: string }) =>
    api.post("/checkout", data || {}, { requiresAuth: true } as any),

  // Verify payment callback
  verify: (authority: string, status: string) =>
    api.get("/payment/verify", {
      params: { Authority: authority, Status: status },
    }),
};

// Orders API
export const ordersAPI = {
  // Get all orders
  getAll: (params?: Record<string, unknown>) =>
    api.get("/orders", { params, requiresAuth: true } as any),

  // Get single order
  getOne: (id: number | string) =>
    api.get(`/orders/${id}`, { requiresAuth: true } as any),

  // Pay for pending order
  pay: (id: number | string) =>
    api.post(`/orders/${id}/pay`, {}, { requiresAuth: true } as any),

  // Cancel pending order
  cancel: (id: number | string) =>
    api.post(`/orders/${id}/cancel`, {}, { requiresAuth: true } as any),

  // Get purchases
  getPurchases: (params?: Record<string, unknown>) =>
    api.get("/purchases", { params, requiresAuth: true } as any),
};

// Favorites API
export const favoritesAPI = {
  getAll: (params?: Record<string, unknown>) =>
    api.get("/favorites", { params, requiresAuth: true }),

  add: (componentId: number) =>
    api.post(`/favorites/${componentId}`, {}, { requiresAuth: true }),

  remove: (componentId: number) =>
    api.delete(`/favorites/${componentId}`, { requiresAuth: true }),

  toggle: (componentId: number) =>
    api.post(`/favorites/${componentId}/toggle`, {}, { requiresAuth: true }),
};


