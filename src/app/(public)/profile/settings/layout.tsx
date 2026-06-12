// app/(public)/profile/settings/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تنظیمات حساب | نمایندگی انحصاری فانتوم پلاس در ایران",
  description: "ویرایش اطلاعات و تنظیمات حساب کاربری",
};

export default function ProfileSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
