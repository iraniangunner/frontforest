// app/(public)/profile/orders/[id]/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "جزئیات سفارش | نمایندگی انحصاری فانتوم پلاس در ایران",
  description: "مشاهده جزئیات و وضعیت سفارش",
};

export default function OrderDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
