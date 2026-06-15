// import { MetadataRoute } from "next";

// const BASE_URL = "https://petra.pmk-co.com";

// // صفحات ثابت سایت
// const staticPages: MetadataRoute.Sitemap = [
//   {
//     url: BASE_URL,
//     lastModified: new Date(),
//     changeFrequency: "daily",
//     priority: 1,
//   },
//   {
//     url: `${BASE_URL}/products`,
//     lastModified: new Date(),
//     changeFrequency: "daily",
//     priority: 0.9,
//   },
//   {
//     url: `${BASE_URL}/posts`,
//     lastModified: new Date(),
//     changeFrequency: "weekly",
//     priority: 0.8,
//   },
//   {
//     url: `${BASE_URL}/about`,
//     lastModified: new Date(),
//     changeFrequency: "monthly",
//     priority: 0.5,
//   },
//   {
//     url: `${BASE_URL}/contact`,
//     lastModified: new Date(),
//     changeFrequency: "monthly",
//     priority: 0.5,
//   },
// ];

// type Product = {
//   slug: string;
//   updated_at?: string;
// };

// type Post = {
//   slug: string;
//   updated_at?: string;
// };

// type ApiResponse<T> = {
//   success: boolean;
//   data: T[];
//   meta?: {
//     current_page: number;
//     last_page: number;
//     per_page: number;
//     total: number;
//   };
// };

// // تابع برای گرفتن همه صفحات (پیجینیشن)
// async function fetchAllPages<T>(endpoint: string): Promise<T[]> {
//   const allItems: T[] = [];

//   const firstRes = await fetch(`${BASE_URL}${endpoint}?page=1`, {
//     next: { revalidate: 3600 },
//   });
//   const firstJson: ApiResponse<T> = await firstRes.json();

//   if (!firstJson.success) return [];

//   allItems.push(...(firstJson.data ?? []));

//   const lastPage = firstJson.meta?.last_page ?? 1;

//   for (let page = 2; page <= lastPage; page++) {
//     const res = await fetch(`${BASE_URL}${endpoint}?page=${page}`, {
//       next: { revalidate: 3600 },
//     });
//     const json: ApiResponse<T> = await res.json();
//     allItems.push(...(json.data ?? []));
//   }

//   return allItems;
// }

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   // گرفتن لیست محصولات
//   let productPages: MetadataRoute.Sitemap = [];
//   try {
//     const products = await fetchAllPages<Product>("/api/products");

//     productPages = products.map((product) => ({
//       url: `${BASE_URL}/products/${product.slug}`,
//       lastModified: product.updated_at
//         ? new Date(product.updated_at)
//         : new Date(),
//       changeFrequency: "weekly",
//       priority: 0.8,
//     }));
//   } catch (error) {
//     console.error("Error fetching products for sitemap:", error);
//   }

//   // گرفتن لیست پست‌ها
//   let postPages: MetadataRoute.Sitemap = [];
//   try {
//     const posts = await fetchAllPages<Post>("/api/posts");

//     postPages = posts.map((post) => ({
//       url: `${BASE_URL}/posts/${post.slug}`,
//       lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
//       changeFrequency: "monthly",
//       priority: 0.7,
//     }));
//   } catch (error) {
//     console.error("Error fetching posts for sitemap:", error);
//   }

//   return [...staticPages, ...productPages, ...postPages];
// }


import { MetadataRoute } from "next";

const BASE_URL = "https://petra.pmk-co.com";

// آدرس API بک‌اند — برای fetch محصولات/دسته‌بندی‌ها از بک‌اند، نه از خود فرانت
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// صفحات ثابت سایت
// توجه: /products (کلی) دیگر وجود ندارد و در sitemap نیست.
// /search هم چون noindex است، در sitemap قرار نمی‌گیرد.
const staticPages: MetadataRoute.Sitemap = [
  {
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1,
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

// شکل آیتم‌های /categories/menu — بر اساس response واقعی بک‌اند
type MenuCategory = {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  updated_at?: string;
  children?: {
    id: number;
    name: string;
    slug: string;
    updated_at?: string;
  }[];
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
  const firstRes = await fetch(`${API_BASE_URL}${endpoint}?page=1`, {
    next: { revalidate: 3600 },
  });
  const firstJson: ApiResponse<T> = await firstRes.json();
  if (!firstJson.success) return [];
  allItems.push(...(firstJson.data ?? []));
  const lastPage = firstJson.meta?.last_page ?? 1;
  for (let page = 2; page <= lastPage; page++) {
    const res = await fetch(`${API_BASE_URL}${endpoint}?page=${page}`, {
      next: { revalidate: 3600 },
    });
    const json: ApiResponse<T> = await res.json();
    allItems.push(...(json.data ?? []));
  }
  return allItems;
}

// گرفتن منوی دسته‌بندی‌ها (parent + children) — بدون pagination
async function fetchCategoryMenu(): Promise<MenuCategory[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories/menu`, {
      next: { revalidate: 3600 },
    });
    const json: { success: boolean; data: MenuCategory[] } = await res.json();
    if (!json.success) return [];
    return json.data ?? [];
  } catch (error) {
    console.error("Error fetching category menu for sitemap:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── دسته‌بندی‌ها (parent + child) — route-based ──
  // /products/[parent] و /products/[parent]/[child]
  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const menu = await fetchCategoryMenu();

    const parentPages: MetadataRoute.Sitemap = menu.map((cat) => ({
      url: `${BASE_URL}/products/${cat.slug}`,
      lastModified: cat.updated_at ? new Date(cat.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const childPages: MetadataRoute.Sitemap = menu.flatMap((cat) =>
      (cat.children ?? []).map((child) => ({
        url: `${BASE_URL}/products/${cat.slug}/${child.slug}`,
        lastModified: child.updated_at
          ? new Date(child.updated_at)
          : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.75,
      }))
    );

    categoryPages = [...parentPages, ...childPages];
  } catch (error) {
    console.error("Error building category pages for sitemap:", error);
  }

  // ── محصولات: /products/[slug] ──
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await fetchAllPages<Product>("/products");
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

  // ── پست‌ها ──
  let postPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await fetchAllPages<Post>("/posts");
    postPages = posts.map((post) => ({
      url: `${BASE_URL}/posts/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Error fetching posts for sitemap:", error);
  }

  return [...staticPages, ...categoryPages, ...productPages, ...postPages];
}
