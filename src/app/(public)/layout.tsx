// app/(public)/layout.tsx
import Header from "@/app/_components/layout/Header";
import Footer from "@/app/_components/layout/Footer";
import { Suspense } from "react";
import TopLoader from "../_components/ui/TopLoader";
import HeaderWrapper from "../_components/layout/HeaderWrapper";

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
      <HeaderWrapper />
      {children}
      <Footer />
    </>
  );
}
