import { notFound } from "next/navigation";
import { Metadata } from "next";
import ProductDetail from "@/app/_components/product/ProductDetail";

interface Props {
  params: { slug: string };
}

async function getProduct(slug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`,
      { next: { revalidate: 60 } }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data.data || data;
  } catch {
    return null;
  }
}

async function getRelatedProducts(slug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}/related?per_page=4`,
      { cache: "no-store" }
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function getProductReviews(slug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}/reviews`,
      { cache: "no-store" }
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: "محصول یافت نشد" };

  const title = `${product.title} | فروشگاه`;
  const description =
    product.short_description ||
    `خرید ${product.title}${product.brand ? " برند " + product.brand : ""}`;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`;
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

// Schema.org JSON-LD
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

export default async function ProductPage({ params }: Props) {
  const [product, relatedProducts, reviews] = await Promise.all([
    getProduct(params.slug),
    getRelatedProducts(params.slug),
    getProductReviews(params.slug),
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
