// app/(public)/profile/orders/return/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مرجوعی کالا | فروشگاه پترا",
  description: "ثبت و پیگیری درخواست مرجوعی محصولات",
};

export default function OrderReturnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
