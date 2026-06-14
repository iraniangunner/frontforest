import { MetadataRoute } from "next";

const BASE_URL = "https://petra.pmk-co.com";

// صفحات ثابت سایت
const staticPages: MetadataRoute.Sitemap = [
  {
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1,
  },
  {
    url: `${BASE_URL}/products`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/posts`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/about`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/contact`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  },
];

type Product = {
  slug: string;
  updated_at?: string;
};

type Post = {
  slug: string;
  updated_at?: string;
};

type ApiResponse<T> = {
  success: boolean;
  data: T[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

// تابع برای گرفتن همه صفحات (پیجینیشن)
async function fetchAllPages<T>(endpoint: string): Promise<T[]> {
  const allItems: T[] = [];

  const firstRes = await fetch(`${BASE_URL}${endpoint}?page=1`, {
    next: { revalidate: 3600 },
  });
  const firstJson: ApiResponse<T> = await firstRes.json();

  if (!firstJson.success) return [];

  allItems.push(...(firstJson.data ?? []));

  const lastPage = firstJson.meta?.last_page ?? 1;

  for (let page = 2; page <= lastPage; page++) {
    const res = await fetch(`${BASE_URL}${endpoint}?page=${page}`, {
      next: { revalidate: 3600 },
    });
    const json: ApiResponse<T> = await res.json();
    allItems.push(...(json.data ?? []));
  }

  return allItems;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // گرفتن لیست محصولات
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await fetchAllPages<Product>("/api/products");

    productPages = products.map((product) => ({
      url: `${BASE_URL}/products/${product.slug}`,
      lastModified: product.updated_at
        ? new Date(product.updated_at)
        : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
  }

  // گرفتن لیست پست‌ها
  let postPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await fetchAllPages<Post>("/api/posts");

    postPages = posts.map((post) => ({
      url: `${BASE_URL}/posts/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Error fetching posts for sitemap:", error);
  }

  return [...staticPages, ...productPages, ...postPages];
}


