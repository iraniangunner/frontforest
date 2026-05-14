import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

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
  },
);

export default api;

/*
|--------------------------------------------------------------------------
| Admin API Functions
|--------------------------------------------------------------------------
*/

export const userAPI = {
  // Get all component statuses in one call
  getProductStatuses: () => api.get("/user/statuses", { requiresAuth: true }),
};

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

  getOne: (id: number) => api.get(`/admin/tags/${id}`, { requiresAuth: true }),

  create: (data: Record<string, unknown>) =>
    api.post("/admin/tags", data, { requiresAuth: true }),

  update: (id: number, data: Record<string, unknown>) =>
    api.put(`/admin/tags/${id}`, data, { requiresAuth: true }),

  delete: (id: number) =>
    api.delete(`/admin/tags/${id}`, { requiresAuth: true }),

  toggle: (id: number) =>
    api.patch(`/admin/tags/${id}/toggle`, {}, { requiresAuth: true }),
};

/**************************************** */

// Admin Products API
export const productsAPI = {
  getAll: (params?: Record<string, unknown>) =>
    api.get("/admin/products", { params, requiresAuth: true }),

  getOne: (id: number) =>
    api.get(`/admin/products/${id}`, { requiresAuth: true }),

  getStatistics: () =>
    api.get("/admin/products/statistics", { requiresAuth: true }),

  create: (data: FormData) =>
    api.post("/admin/products", data, {
      headers: { "Content-Type": "multipart/form-data" },
      requiresAuth: true,
    }),

  update: (id: number, data: FormData) =>
    api.post(`/admin/products/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
      requiresAuth: true,
    }),

  delete: (id: number) =>
    api.delete(`/admin/products/${id}`, { requiresAuth: true }),

  toggle: (id: number) =>
    api.patch(`/admin/products/${id}/toggle`, {}, { requiresAuth: true }),

  toggleFeatured: (id: number) =>
    api.patch(
      `/admin/products/${id}/toggle-featured`,
      {},
      { requiresAuth: true },
    ),

  updateStock: (id: number, stock: number) =>
    api.patch(`/admin/products/${id}/stock`, { stock }, { requiresAuth: true }),
};

// Public Products API
export const publicProductsAPI = {
  getAll: (params?: Record<string, unknown>) =>
    api.get("/products", { params }),

  getBySlug: (slug: string) => api.get(`/products/${slug}`),

  getFeatured: () => api.get("/products/featured"),

  getOnSale: () => api.get("/products/on-sale"),

  getNewest: () => api.get("/products/newest"),

  getRelated: (slug: string) => api.get(`/products/${slug}/related`),

  getReviews: (slug: string, params?: Record<string, unknown>) =>
    api.get(`/products/${slug}/reviews`, { params }),

  addReview: (slug: string, data: { rating: number; comment: string }) =>
    api.post(`/products/${slug}/reviews`, data, { requiresAuth: true }),

  updateReview: (slug: string, data: { rating: number; comment: string }) =>
    api.put(`/products/${slug}/reviews`, data, { requiresAuth: true }),

  deleteReview: (slug: string) =>
    api.delete(`/products/${slug}/reviews`, { requiresAuth: true }),
};

/******************************************/

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

  reply: (id: number, adminReply: string) =>
    api.post(
      `/admin/reviews/${id}/reply`,
      { admin_reply: adminReply },
      { requiresAuth: true },
    ),

  deleteReply: (id: number) =>
    api.delete(`/admin/reviews/${id}/reply`, { requiresAuth: true }),
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
  // دریافت سبد خرید
  get: () => api.get("/cart", { requiresAuth: true }),

  // تعداد کل آیتم‌ها
  count: () => api.get("/cart/count", { requiresAuth: true }),

  // اضافه کردن محصول (quantity اختیاری، پیش‌فرض ۱)
  add: (productId: number, quantity: number = 1) =>
    api.post(`/cart/${productId}`, { quantity }, { requiresAuth: true }),

  // تنظیم دقیق تعداد
  update: (productId: number, quantity: number) =>
    api.put(`/cart/${productId}`, { quantity }, { requiresAuth: true }),

  // کاهش ۱ یا حذف اگه تعداد ۱ باشه
  decrease: (productId: number) =>
    api.delete(`/cart/${productId}`, { requiresAuth: true }),

  // حذف کامل محصول از سبد (صرف‌نظر از تعداد)
  removeAll: (productId: number) =>
    api.delete(`/cart/${productId}/remove`, { requiresAuth: true }),

  // خالی کردن کل سبد
  clear: () => api.delete("/cart", { requiresAuth: true }),
};

export const authAPI = {
  sendOtp: (mobile: string) => api.post("/auth/send-otp", { mobile }),

  verifyOtp: (mobile: string, otp: string) =>
    api.post("/auth/verify-otp", { mobile, otp }),

  me: () => api.get("/auth/me", { requiresAuth: true }),

  logout: () => api.post("/auth/logout", {}, { requiresAuth: true }),
};

// ─────────────────────────────────────────────
// Checkout API
// ─────────────────────────────────────────────
export const checkoutAPI = {
  checkout: (data: { address_id: number; coupon_code?: string }) =>
    api.post("/checkout", data, { requiresAuth: true } as any),
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

  // Check if component is purchased
  // check: (componentId: number) =>
  //   api.get(`/purchases/check/${componentId}`, { requiresAuth: true } as any),
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

  // Check if component is favorite
  // check: (componentId: number) =>
  //   api.get(`/favorites/check/${componentId}`, { requiresAuth: true }),
};

export const contactAPI = {
  // Public endpoint - no auth required
  send: (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => api.post("/contact", data),

  // Admin endpoints - require auth
  getAll: (params?: { page?: number; per_page?: number; status?: string }) =>
    api.get("/admin/contact", { params, requiresAuth: true }),

  getOne: (id: number) =>
    api.get(`/admin/contact/${id}`, { requiresAuth: true }),

  updateStatus: (id: number, status: string) =>
    api.patch(
      `/admin/contact/${id}/status/${status}`,
      {},
      { requiresAuth: true },
    ),

  delete: (id: number) =>
    api.delete(`/admin/contact/${id}`, { requiresAuth: true }),
};

// ─────────────────────────────────────────────
// Admin Orders API — همه از OrderController
// ─────────────────────────────────────────────
export const adminOrdersAPI = {
  getAll: (params?: Record<string, unknown>) =>
    api.get("/admin/orders", { params, requiresAuth: true }),

  getOne: (id: number) =>
    api.get(`/admin/orders/${id}`, { requiresAuth: true }),

  updateStatus: (
    id: number,
    data: {
      status: string;
      note?: string;
      tracking_code?: string;
    },
  ) => api.patch(`/admin/orders/${id}/status`, data, { requiresAuth: true }),

  // زرین‌پال
  getPending: (params?: Record<string, unknown>) =>
    api.get("/admin/orders/pending", { params, requiresAuth: true }),
  checkStatus: (orderId: number) =>
    api.get(`/admin/orders/${orderId}/check-status`, { requiresAuth: true }),
  manualVerify: (orderId: number) =>
    api.post(
      `/admin/orders/${orderId}/manual-verify`,
      {},
      { requiresAuth: true },
    ),
};

// ─────────────────────────────────────────────
// Address API
// ─────────────────────────────────────────────
export interface AddressForm {
  title?: string;
  receiver_name: string;
  receiver_mobile: string;
  province: string;
  city: string;
  address: string;
  postal_code: string;
  is_default?: boolean;
}

export const addressAPI = {
  getAll: () => api.get("/addresses", { requiresAuth: true }),
  store: (data: AddressForm) =>
    api.post("/addresses", data, { requiresAuth: true }),
  update: (id: number, data: AddressForm) =>
    api.put(`/addresses/${id}`, data, { requiresAuth: true }),
  destroy: (id: number) =>
    api.delete(`/addresses/${id}`, { requiresAuth: true }),
  setDefault: (id: number) =>
    api.patch(`/addresses/${id}/set-default`, {}, { requiresAuth: true }),
};

// ─────────────────────────────────────────────
// Coupon API
// ─────────────────────────────────────────────
export const couponAPI = {
  validate: (code: string, total: number) =>
    api.post("/coupon/validate", { code, total }, { requiresAuth: true }),
};
