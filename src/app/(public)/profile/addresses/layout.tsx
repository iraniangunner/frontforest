// app/(public)/profile/addresses/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "آدرس های من | فروشگاه پترا",
  description: "مدیریت آدرس‌های تحویل شما",
};

export default function ProfileAddressesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
