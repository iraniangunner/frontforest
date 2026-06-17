// app/(public)/checkout/confirm/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تایید نهایی سفارش | فروشگاه پترا",
  description: "تایید و پرداخت نهایی سفارش",
};

export default function CheckoutConfirmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
