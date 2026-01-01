"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { HiLogin } from "react-icons/hi";
import Link from "next/link";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!loading) {
      setChecked(true);
    }
  }, [loading]);

  // Still loading auth state
  if (loading || !checked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        dir="rtl"
      >
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiLogin className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              ورود به حساب کاربری
            </h1>
            <p className="text-gray-500 mb-6">
              برای دسترسی به این صفحه ابتدا وارد حساب کاربری خود شوید
            </p>
            <div className="space-y-3">
              <Link
                href={`/login?redirect=${encodeURIComponent(pathname)}`}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                <HiLogin className="w-5 h-5" />
                ورود به حساب
              </Link>
              <Link
                href={`/register?redirect=${encodeURIComponent(pathname)}`}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                ثبت‌نام
              </Link>
              <Link
                href="/"
                className="block text-sm text-gray-500 hover:text-gray-700 mt-4"
              >
                بازگشت به صفحه اصلی
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated - render children
  return <>{children}</>;
}
