"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { HiLogin, HiExclamationCircle } from "react-icons/hi";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
  requireComplete?: boolean;
}

export default function AuthGuard({ children, requireComplete = true }: AuthGuardProps) {
  const { user, loading, refreshUser } = useAuth();
  const pathname = usePathname();
  const [retried, setRetried] = useState(false);

  // اگه user نبود، یه بار دیگه retry کن قبل از نشون دادن پیام لاگین
  // (برای مواقعی که بعد از login تازه به این صفحه اومدیم و
  // اولین درخواست هنوز کوکی جدید رو نگرفته بود)
  useEffect(() => {
    if (!loading && !user && !retried) {
      setRetried(true);
      refreshUser();
    }
  }, [loading, user, retried, refreshUser]);

  if (loading || (!user && !retried)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
      </div>
    );
  }

  // لاگین نکرده
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
              برای دسترسی به این صفحه ابتدا وارد حساب کاربری خود شوید
            </p>
            <div className="space-y-3">
              <Link
                href={`/login?redirect=${encodeURIComponent(pathname)}`}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors"
              >
                <HiLogin className="w-5 h-5" />
                ورود به حساب
              </Link>
              <Link
                href="/"
                className="block text-sm text-gray-500 hover:text-gray-700 mt-2"
              >
                بازگشت به صفحه اصلی
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // پروفایل ناقص (فقط اگه requireComplete = true باشه)
  if (requireComplete && (!user.email || !user.mobile)) {
    const missingField = !user.email ? "ایمیل" : "شماره موبایل";
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiExclamationCircle className="w-10 h-10 text-amber-500" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              تکمیل پروفایل الزامی است
            </h1>
            <p className="text-gray-500 mb-6">
              برای دسترسی به این بخش، ابتدا{" "}
              <span className="font-medium text-amber-600">{missingField}</span>{" "}
              خود را تایید کنید
            </p>
            <div className="space-y-3">
              <Link
                href="/profile/settings?incomplete=true"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors"
              >
                تکمیل پروفایل
              </Link>
              <Link
                href="/profile"
                className="block text-sm text-gray-500 hover:text-gray-700 mt-2"
              >
                بازگشت به پروفایل
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}