// app/(public)/profile/orders/[id]/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "جزئیات سفارش | فروشگاه پترا",
  description: "مشاهده جزئیات و وضعیت سفارش",
};

export default function OrderDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
