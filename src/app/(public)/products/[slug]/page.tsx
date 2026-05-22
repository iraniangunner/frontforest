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
      { next: { revalidate: 60 } },
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
      { cache: "no-store" },
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
      { cache: "no-store" },
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

  return {
    title: `${product.title} | فروشگاه`,
    description:
      product.short_description ||
      `خرید ${product.title}${product.brand ? " برند " + product.brand : ""}`,
  };
}

export default async function ProductPage({ params }: Props) {
  const [product, relatedProducts, reviews] = await Promise.all([
    getProduct(params.slug),
    getRelatedProducts(params.slug),
    getProductReviews(params.slug),
  ]);

  if (!product) notFound();

  return (
    <ProductDetail
      product={product}
      relatedProducts={relatedProducts}
      reviews={reviews}
    />
  );
}
