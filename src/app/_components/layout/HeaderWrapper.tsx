// app/_components/HeaderWrapper.tsx  ←  SERVER COMPONENT
import Header from "./Header";
import { publicCategoriesAPI } from "@/lib/api";

async function getMenu() {
  try {
    const res = await publicCategoriesAPI.getAll();
    return res.data?.data || [];
  } catch {
    return [];
  }
}

export default async function HeaderWrapper() {
  const categories = await getMenu();
  return <Header categories={categories} />;
}
