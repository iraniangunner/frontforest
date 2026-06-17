// app/(public)/checkout/address/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "آدرس تحویل | فروشگاه پترا",
  description: "انتخاب آدرس تحویل سفارش",
};

export default function CheckoutAddressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
