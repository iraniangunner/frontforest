// app/(public)/checkout/confirm/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تایید نهایی سفارش | نمایندگی انحصاری فانتوم پلاس در ایران",
  description: "تایید و پرداخت نهایی سفارش",
};

export default function CheckoutConfirmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
