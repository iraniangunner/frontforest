export interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface ProductAttribute {
  id: number;
  key: string;
  value: string;
  sort_order: number;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  is_approved: boolean;
  admin_reply: string | null;
  admin_reply_at: string | null;
  user: { id: number; name: string };
  created_at: string;
}

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

  // روابط
  category: {
    id: number;
    name: string;
    slug: string;
    parent?: { id: number; name: string; slug: string };
  };
  tags: Tag[];
  attributes: ProductAttribute[];

  created_at: string;
  updated_at: string;
}

export interface FilterParams {
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
