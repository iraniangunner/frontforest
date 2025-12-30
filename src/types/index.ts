export interface Category {
    id: number;
    name: string;
    name_en: string | null;
    slug: string;
    icon: string | null;
    color: string;
    parent_id: number | null;
    is_active: boolean;
    components_count: number;
    children?: Category[];
  }
  
  export interface Tag {
    id: number;
    name: string;
    slug: string;
    color: string;
    type: "framework" | "styling" | "feature";
  }
  
  export interface Component {
    id: number;
    title: string;
    slug: string;
    short_description: string | null;
    category: {
      id: number;
      name: string;
      slug: string;
      color: string;
      parent?: { id: number; name: string; slug: string } | null;
    };
    price: number;
    sale_price: number | null;
    current_price: number;
    discount_percent: number;
    is_free: boolean;
    is_on_sale: boolean;
    thumbnail: string | null;
    preview_url: string | null;
    rating: number;
    reviews_count: number;
    sales_count: number;
    views_count: number;
    is_featured: boolean;
    is_new: boolean;
    tags: { id: number; name: string; slug: string; color: string; type: string }[];
    created_at: string;
  }
  
  export interface FilterParams {
    category?: string;
    categories?: string[];
    frameworks?: string[];
    stylings?: string[];
    features?: string[];
    free?: boolean;
    featured?: boolean;
    on_sale?: boolean;
    min_price?: number;
    max_price?: number;
    min_rating?: number;
    q?: string;
    sort?: string;
    page?: number;
    per_page?: number;
  }
  
  export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  }