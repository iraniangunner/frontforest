// app/(public)/layout.tsx
import Header from "@/app/_components/layout/Header";
import Footer from "@/app/_components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
