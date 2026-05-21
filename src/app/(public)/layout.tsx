// app/(public)/layout.tsx
import Header from "@/app/_components/layout/Header";
import Footer from "@/app/_components/layout/Footer";
import { Suspense } from "react";
import TopLoader from "../_components/ui/TopLoader";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense>
        <TopLoader />
      </Suspense>
      <Header />
      {children}
      <Footer />
    </>
  );
}
