// app/(public)/checkout/address/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "آدرس تحویل | نمایندگی انحصاری فانتوم پلاس در ایران",
  description: "انتخاب آدرس تحویل سفارش",
};

export default function CheckoutAddressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
