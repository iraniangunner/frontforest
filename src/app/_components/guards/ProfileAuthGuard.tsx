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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "guest") {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiLogin className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              ورود به حساب کاربری
            </h1>
            <p className="text-gray-500 mb-6">
              برای مشاهده این صفحه ابتدا وارد شوید
            </p>
            <div className="space-y-3">
              <Link
                href={`/login?redirect=${pathname}`}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
              >
                <HiLogin className="w-5 h-5" /> ورود به حساب
              </Link>
              <Link
                href="/products"
                className="block text-sm text-gray-500 hover:text-gray-700 mt-4"
              >
                مشاهده محصولات
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
