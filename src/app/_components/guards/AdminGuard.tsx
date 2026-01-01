"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { HiShieldExclamation, HiLogin } from "react-icons/hi";
import Link from "next/link";

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiLogin className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              ورود به حساب کاربری
            </h1>
            <p className="text-gray-500 mb-6">
              برای دسترسی به پنل مدیریت ابتدا وارد شوید
            </p>
            <div className="space-y-3">
              <Link
                href="/login?redirect=/admin"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                <HiLogin className="w-5 h-5" />
                ورود به حساب
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

  // Not admin
  if (!user.is_admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiShieldExclamation className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              دسترسی محدود
            </h1>
            <p className="text-gray-500 mb-6">
              شما اجازه دسترسی به پنل مدیریت را ندارید
            </p>
            <div className="space-y-3">
              <Link
                href="/profile"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                رفتن به پروفایل
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

  // Is admin - render children
  return <>{children}</>;
}