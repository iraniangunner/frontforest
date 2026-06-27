"use client";

// app/_components/ProfileAuthGuard.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiLogin } from "react-icons/hi";
import { useAuth } from "@/context/AuthContext";

export default function ProfileAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  const status = loading ? "loading" : user ? "auth" : "guest";

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#F0F0F0] border-t-[#A72F3B] rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "guest") {
    return (
      <div className="min-h-screen bg-[#FAFAFA]" dir="rtl">
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl border border-[#F0F0F0] shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-[#F6EAEB] rounded-full flex items-center justify-center mx-auto mb-6">
              <HiLogin className="w-10 h-10 text-[#A72F3B]" />
            </div>
            <h1 className="text-xl font-bold text-[#242424] mb-2">
              ورود به حساب کاربری
            </h1>
            <p className="text-[#656565] mb-6">
              برای مشاهده این صفحه ابتدا وارد شوید
            </p>
            <div className="space-y-3">
              <Link
                href={`/login?redirect=${pathname}`}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#A72F3B] text-white rounded-xl font-medium hover:bg-[#86262F] transition-colors"
              >
                <HiLogin className="w-5 h-5" /> ورود به حساب
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
