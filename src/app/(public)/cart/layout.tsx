import { Metadata } from "next";

export const metadata: Metadata = {
  title: "سبد خرید | نمایندگی انحصاری فانتوم پلاس در ایران",
  description: "مشاهده و مدیریت سبد خرید شما",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
