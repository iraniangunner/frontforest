import HeroCarousel from "./HeroCarousel";

const API = process.env.NEXT_PUBLIC_API_URL;

async function getSlides() {
  const res = await fetch(`${API}/products?per_page=5&sort=newest`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error("Failed hero fetch");

  return res.json();
}

export default async function HeroCarouselServer() {
  const data = await getSlides();
  const products = data?.data ?? [];

  if (!products.length) return null;

  return <HeroCarousel products={products} />;
}
