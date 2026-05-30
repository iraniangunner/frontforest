// app/(public)/profile/layout.tsx
import { Metadata } from "next";
import ProfileAuthGuard from "@/app/_components/guards/ProfileAuthGuard";

export const metadata: Metadata = {
  title: "پروفایل | نمایندگی انحصاری فانتوم پلاس در ایران",
  description: "پروفایل کاربری شما",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProfileAuthGuard>{children}</ProfileAuthGuard>;
}
