// app/_components/HeaderWrapper.tsx  ←  SERVER COMPONENT
import Header from "./Header";

async function getMenu() {
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

export default async function HeaderWrapper() {
  const categories = await getMenu();
  return <Header categories={categories} />;
}
