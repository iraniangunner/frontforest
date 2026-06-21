export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  icon_image: string | null;
  color: string | null;
  image: string | null;
  products_count: number;
  children?: { id: number; name: string; slug: string }[];
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  color: string;
  type: "framework" | "styling" | "feature";
}

// Product
// ─────────────────────────────────────────────
export interface Product {
  id: number;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  sku: string | null;
  brand: string | null;

  // قیمت
  price: number;
  sale_price: number | null;
  current_price: number;
  discount_percent: number;
  is_on_sale: boolean;

  // انبار
  stock: number;
  is_in_stock: boolean;
  is_low_stock: boolean;

  // فیزیکی
  weight: number | null;
  dimensions: string | null;

  // مدیا
  thumbnail: string | null;
  images: string[] | null;

  // آمار
  views_count: number;
  sales_count: number;
  rating: number;
  reviews_count: number;

  // فلگ‌ها
  is_featured: boolean;
  is_new: boolean;
  is_active: boolean;

  // دسته‌بندی
  category: {
    id: number;
    name: string;
    slug: string;
    parent?: { id: number; name: string; slug: string } | null;
  } | null;

  // تگ‌ها
  tags: {
    id: number;
    name: string;
    color: string;
  }[];

  // ویژگی‌ها
  attributes?: {
    id: number;
    key: string;
    value: string;
    sort_order?: number;
  }[];

  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────
// Review
// ─────────────────────────────────────────────
export interface Review {
  id: number;
  user: {
    id: number;
    name: string;
  };
  rating: number;
  comment: string;
  admin_reply: string | null;
  is_approved: boolean;
  created_at: string;
}

// ─────────────────────────────────────────────
// ProductAttribute
// ─────────────────────────────────────────────
export interface ProductAttribute {
  id?: number;
  key: string;
  value: string;
  sort_order?: number;
}

// ─────────────────────────────────────────────
// FilterParams
// ─────────────────────────────────────────────
export interface FilterParams {
  category?: string;
  categories?: string[];
  brand?: string;
  featured?: boolean;
  on_sale?: boolean;
  in_stock?: boolean;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  q?: string;
  sort?: string;
  page?: number;
  per_page?: number;
}

// ─────────────────────────────────────────────
// PaginationMeta
// ─────────────────────────────────────────────
export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// ─────────────────────────────────────────────
// Address
// ─────────────────────────────────────────────
export interface Address {
  id: number;
  title: string | null;
  receiver_name: string;
  receiver_mobile: string;
  province: string;
  city: string;
  address: string;
  postal_code: string;
  is_default: boolean;
}

// ─────────────────────────────────────────────
// Order
// ─────────────────────────────────────────────
export interface OrderItem {
  id: number;
  product_id: number;
  product_title: string;
  product_slug: string;
  product_thumbnail: string | null;
  price: number;
  sale_price: number | null;
  paid_price: number;
  quantity: number;
}

export interface Order {
  id: number;
  order_number: string;
  status: string;
  status_label: string;
  subtotal: number;
  discount: number;
  coupon_code: string | null;
  coupon_discount: number;
  total: number;
  tracking_code: string | null;
  status_note: string | null;
  items_count: number;
  items: OrderItem[];
  shipping: {
    receiver_name: string;
    receiver_mobile: string;
    province: string;
    city: string;
    address: string;
    postal_code: string;
  } | null;
  timeline: {
    created_at: string | null;
    paid_at: string | null;
    processing_at: string | null;
    shipped_at: string | null;
    delivered_at: string | null;
    cancelled_at: string | null;
  };
  latest_transaction: {
    ref_id: string | null;
    status: string;
  } | null;
  created_at: string;
  paid_at: string | null;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnail: string | null;
  category: string;
  category_label: string;
  views: number;
  published_at: string | null;
  author: { id: number; name: string };
}

export interface Reply {
  id: number;
  body: string;
  created_at: string;
  user: { id: number; name: string };
}

export interface Comment {
  id: number;
  body: string;
  created_at: string;
  user: { id: number; name: string };
  replies: Reply[];
}


export type StatRow = {
  date: string;
  visits: number;
  pageviews: number;
  users: number;
};

export type PageRow = {
  page: string;
  pageviews: number;
};
