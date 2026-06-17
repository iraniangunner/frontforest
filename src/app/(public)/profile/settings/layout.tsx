// app/(public)/profile/settings/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تنظیمات حساب | فروشگاه پترا",
  description: "ویرایش اطلاعات و تنظیمات حساب کاربری",
};

export default function ProfileSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
