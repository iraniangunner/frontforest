import { Metadata } from "next";

export const metadata: Metadata = {
  title: "سبد خرید | فروشگاه پترا",
  description: "مشاهده و مدیریت سبد خرید شما",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
