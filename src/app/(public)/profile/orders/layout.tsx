// app/(public)/profile/orders/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "سفارشات من | نمایندگی انحصاری فانتوم پلاس در ایران",
  description: "مشاهده و پیگیری سفارشات شما",
};

export default function ProfileOrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
