// import { notFound } from "next/navigation";
// import { Metadata } from "next";
// import ProductDetail from "@/app/_components/product/ProductDetail";

// interface Props {
//   params: { slug: string };
// }

// async function getProduct(slug: string) {
//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`,
//       { next: { revalidate: 60 } }
//     );
//     if (!response.ok) return null;
//     const data = await response.json();
//     return data.data || data;
//   } catch {
//     return null;
//   }
// }

// async function getRelatedProducts(slug: string) {
//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}/related?per_page=4`,
//       { cache: "no-store" }
//     );
//     if (!response.ok) return [];
//     const data = await response.json();
//     return data.data || [];
//   } catch {
//     return [];
//   }
// }

// async function getProductReviews(slug: string) {
//   try {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}/reviews`,
//       { cache: "no-store" }
//     );
//     if (!response.ok) return [];
//     const data = await response.json();
//     return data.data ?? [];
//   } catch {
//     return [];
//   }
// }

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const product = await getProduct(params.slug);
//   if (!product) return { title: "محصول یافت نشد" };

//   const title = `${product.title} | فروشگاه`;
//   const description =
//     product.short_description ||
//     `خرید ${product.title}${product.brand ? " برند " + product.brand : ""}`;
//   const url = `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`;
//   const images = [product.thumbnail, ...(product.images || [])].filter(Boolean);

//   return {
//     title,
//     description,
//     alternates: { canonical: url },
//     openGraph: {
//       title,
//       description,
//       url,
//       siteName: "نمایندگی انحصاری فانتوم پلاس در ایران",
//       locale: "fa_IR",
//       type: "website",
//       images: images.map((img: string) => ({ url: img, alt: product.title })),
//     },
//     twitter: {
//       card: "summary_large_image",
//       title,
//       description,
//       images: [product.thumbnail],
//     },
//   };
// }

// // Schema.org JSON-LD
// function ProductJsonLd({ product }: { product: any }) {
//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "Product",
//     name: product.title,
//     image: [product.thumbnail, ...(product.images || [])].filter(Boolean),
//     description:
//       product.short_description || product.description || product.title,
//     sku: product.sku,
//     brand: product.brand
//       ? { "@type": "Brand", name: product.brand }
//       : undefined,
//     offers: {
//       "@type": "Offer",
//       url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
//       priceCurrency: "IRR",
//       price: product.current_price,
//       availability: product.is_in_stock
//         ? "https://schema.org/InStock"
//         : "https://schema.org/OutOfStock",
//       seller: {
//         "@type": "Organization",
//         name: "نمایندگی انحصاری فانتوم پلاس در ایران",
//         url: process.env.NEXT_PUBLIC_SITE_URL,
//       },
//     },
//     ...(parseFloat(product.rating) > 0 && {
//       aggregateRating: {
//         "@type": "AggregateRating",
//         ratingValue: product.rating,
//         reviewCount: product.reviews_count || "0",
//         bestRating: "5",
//         worstRating: "1",
//       },
//     }),
//   };

//   return (
//     <script
//       type="application/ld+json"
//       dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//     />
//   );
// }

// export default async function ProductPage({ params }: Props) {
//   const [product, relatedProducts, reviews] = await Promise.all([
//     getProduct(params.slug),
//     getRelatedProducts(params.slug),
//     getProductReviews(params.slug),
//   ]);

//   if (!product) notFound();

//   return (
//     <>
//       <ProductJsonLd product={product} />
//       <ProductDetail
//         product={product}
//         relatedProducts={relatedProducts}
//         reviews={reviews}
//       />
//     </>
//   );
// }

// app/products/[slug]/page.tsx  ←  SERVER COMPONENT
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductDetail from "@/app/_components/product/ProductDetail";

import { publicCategoriesAPI, publicProductsAPI } from "@/lib/api";
import CategoryProductsPage, { CategoryBreadcrumbJsonLd, CategoryData } from "@/app/_components/ui/CategoryProductsPage";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// ─────────────────────────────────────────────
// شکل آیتم‌های /categories/menu — بر اساس response واقعی بک‌اند
// ─────────────────────────────────────────────
interface MenuCategory {
  id: number;
  parent_id: number | null;
  name: string;
  name_en?: string;
  slug: string;
  icon?: string | null;
  icon_image?: string | null;
  color?: string | null;
  image?: string | null;
  description: string | null;
  sort_order?: number;
  is_active?: boolean;
  is_featured?: boolean;
  products_count?: number;
  children?: {
    id: number;
    name: string;
    name_en?: string;
    slug: string;
    icon?: string | null;
    icon_image?: string | null;
    color?: string | null;
    image?: string | null;
    description?: string | null;
    products_count?: number;
  }[];
}

let menuCache: MenuCategory[] | null = null;

// getMenu رو فقط یک بار در هر request می‌گیریم و کش می‌کنیم
async function getMenu(): Promise<MenuCategory[]> {
  if (menuCache) return menuCache;
  try {
    const res = await publicCategoriesAPI.getMenu();
    menuCache = res.data?.data || [];
    return menuCache!;
  } catch {
    return [];
  }
}

// تبدیل یک MenuCategory به CategoryData (با children ساده‌شده)
function toCategoryData(cat: MenuCategory): CategoryData {
  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    products_count: cat.products_count,
    children: cat.children?.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      products_count: c.products_count,
    })),
  };
}

async function getProduct(slug: string) {
  try {
    const res = await publicProductsAPI.getBySlug(slug);
    return res.data?.data || res.data || null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  // اول چک کن این slug یک parent category در سطح اول منو است
  const menu = await getMenu();
  const parentCategory = menu.find((c) => c.slug === slug);

  if (parentCategory) {
    const title = `${parentCategory.name} | فروشگاه`;
    const description =
      parentCategory.description ||
      `خرید آنلاین محصولات ${parentCategory.name} با گارانتی معتبر`;

    return {
      title,
      description,
      alternates: { canonical: `${siteUrl}/products/${slug}` },
      openGraph: {
        title,
        description,
        type: "website",
        locale: "fa_IR",
      },
    };
  }

  // وگرنه محصول
  const product = await getProduct(slug);
  if (!product) return { title: "یافت نشد" };

  const title = `${product.title} | فروشگاه`;
  const description =
    product.short_description ||
    `خرید ${product.title}${product.brand ? " برند " + product.brand : ""}`;
  const url = `${siteUrl}/products/${product.slug}`;
  const images = [product.thumbnail, ...(product.images || [])].filter(
    Boolean
  );

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "نمایندگی انحصاری فانتوم پلاس در ایران",
      locale: "fa_IR",
      type: "website",
      images: images.map((img: string) => ({ url: img, alt: product.title })),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.thumbnail],
    },
  };
}

// ─────────────────────────────────────────────
// Product JSON-LD
// ─────────────────────────────────────────────
function ProductJsonLd({ product }: { product: any }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: [product.thumbnail, ...(product.images || [])].filter(Boolean),
    description:
      product.short_description || product.description || product.title,
    sku: product.sku,
    brand: product.brand
      ? { "@type": "Brand", name: product.brand }
      : undefined,
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
      priceCurrency: "IRR",
      price: product.current_price,
      availability: product.is_in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "نمایندگی انحصاری فانتوم پلاس در ایران",
        url: process.env.NEXT_PUBLIC_SITE_URL,
      },
    },
    ...(parseFloat(product.rating) > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviews_count || "0",
        bestRating: "5",
        worstRating: "1",
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default async function SlugPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  // 1) چک کن این slug یک parent category در سطح اول منو است
  const menu = await getMenu();
  const parentCategory = menu.find((c) => c.slug === slug);

  if (parentCategory) {
    const categoryData = toCategoryData(parentCategory);

    return (
      <>
        <CategoryBreadcrumbJsonLd category={categoryData} />
        <CategoryProductsPage
          category={categoryData}
          parentCategory={categoryData}
          searchParams={sp}
          basePath={`/products/${slug}`}
        />
      </>
    );
  }

  // 2) وگرنه باید محصول باشد
  const [product, relatedProducts, reviews] = await Promise.all([
    getProduct(slug),
    publicProductsAPI
      .getRelated(slug)
      .then((r) => r.data?.data || [])
      .catch(() => []),
    publicProductsAPI
      .getReviews(slug)
      .then((r) => r.data?.data ?? [])
      .catch(() => []),
  ]);

  if (!product) notFound();

  return (
    <>
      <ProductJsonLd product={product} />
      <ProductDetail
        product={product}
        relatedProducts={relatedProducts}
        reviews={reviews}
      />
    </>
  );
}
