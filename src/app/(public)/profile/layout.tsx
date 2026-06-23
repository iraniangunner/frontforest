// app/(public)/profile/layout.tsx
import { Metadata } from "next";
import { ProfileAuthGuard } from "@/app/_components/guards";
import { ProfileSidebar } from "@/app/_components/profile/ProfileSidebar";

export const metadata: Metadata = {
  title: "پروفایل | فروشگاه پترا",
  description: "پروفایل کاربری شما",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProfileAuthGuard>
      <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">
        <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8">
          <h1 className="text-2xl font-bold text-[#242424] mb-5 lg:mb-6">
            پروفایل
          </h1>

          <div className="grid gap-5 lg:gap-6 lg:grid-cols-[320px_1fr] items-start">
            <ProfileSidebar />
            <main className="min-w-0">{children}</main>
          </div>
        </div>
      </div>
    </ProfileAuthGuard>
  );
}
