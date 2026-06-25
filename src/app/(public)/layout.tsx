// app/(public)/layout.tsx
import Footer from "@/app/_components/layout/Footer";
import { Suspense } from "react";
import TopLoader from "../_components/ui/TopLoader";
import HeaderWrapper from "../_components/layout/HeaderWrapper";
import MobileBottomNav from "../_components/layout/MobileButtonNav";

async function getMenu() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories/menu`,
      { next: { revalidate: 60 } },
    );
    const json = await res.json();
    return json?.data || [];
  } catch {
    return [];
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getMenu();
  return (
    <>
      <Suspense>
        <TopLoader />
      </Suspense>
      <HeaderWrapper />
      {children}
      <MobileBottomNav categories={categories} />
      <Footer />
    </>
  );
}
