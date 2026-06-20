import LatestProductsSection from "./LatestProductsSection";

const API = process.env.NEXT_PUBLIC_API_URL;

async function getProducts() {
  const res = await fetch(`${API}/products?per_page=12&sort=newest`, {
    next: { revalidate: 60 },
  });

  return res.json();
}

export default async function LatestProductsServer() {
  const data = await getProducts();
  const products = data?.data ?? [];

  if (!products.length) return null;

  return <LatestProductsSection products={products} />;
}
