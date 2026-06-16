
// app/products/[slug]/page.tsx  ←  SERVER COMPONENT
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductDetail from "@/app/_components/product/ProductDetail";
import { publicProductsAPI } from "@/lib/api";
import CategoryProductsPage, {
  CategoryBreadcrumbJsonLd,
  CategoryData,
} from "@/app/_components/ui/CategoryProductsPage";

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

// getMenu با Next.js cache — هر 60 ثانیه revalidate می‌شود
// (بدون module-level variable که بین request‌ها زنده می‌ماند)
async function getMenu(): Promise<MenuCategory[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories/menu`,
      { next: { revalidate: 60 } }
    );
    const json = await res.json();
    return json?.data || [];
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
  const images = [product.thumbnail, ...(product.images || [])].filter(Boolean);

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
