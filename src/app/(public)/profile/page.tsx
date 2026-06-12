"use client";

// app/(public)/profile/page.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { HiUser, HiShoppingBag, HiHeart, HiCog } from "react-icons/hi2";
import {
  HiExclamationCircle,
  HiCheckCircle,
  HiLocationMarker,
} from "react-icons/hi";
import { ordersAPI, favoritesAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Stats {
  orders: number;
  favorites: number;
  totalSpent: number;
}

export default function ProfilePage() {
  const { user } = useAuth();
  
  const [stats, setStats] = useState<Stats>({
    orders: 0,
    favorites: 0,
    totalSpent: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [ordersRes, favoritesRes] = await Promise.all([
        ordersAPI.getAll({ per_page: 1 }),
        favoritesAPI.getAll({ per_page: 1 }),
      ]);
      setStats({
        orders: ordersRes.data.meta?.total ?? 0,
        favorites: favoritesRes.data.meta?.total ?? 0,
        totalSpent: ordersRes.data.meta?.stats?.total_spent ?? 0,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // const profileComplete = !!(user?.email && user?.mobile);
  // const missingField = !user?.email
  //   ? "ایمیل"
  //   : !user?.mobile
  //     ? "شماره موبایل"
  //     : null;

const profileComplete = !!user?.mobile;
const missingField = !user?.mobile ? "شماره موبایل" : null;

  const statCards = [
    {
      label: "سفارشات",
      value: stats.orders,
      icon: HiShoppingBag,
      color: "bg-teal-500",
      bg: "bg-teal-50",
    },
    {
      label: "علاقه‌مندی‌ها",
      value: stats.favorites,
      icon: HiHeart,
      color: "bg-rose-500",
      bg: "bg-rose-50",
    },
    {
      label: "مجموع خرید",
      value: `${Number(stats.totalSpent).toLocaleString("fa-IR")} ت`,
      icon: HiUser,
      color: "bg-amber-500",
      bg: "bg-amber-50",
      isText: true,
    },
  ];

  const menuItems = [
    {
      href: "/profile/orders",
      icon: HiShoppingBag,
      label: "سفارشات من",
      description: "پیگیری و مشاهده وضعیت سفارشات",
      color: "bg-teal-500",
    },
    {
      href: "/profile/favorites",
      icon: HiHeart,
      label: "علاقه‌مندی‌ها",
      description: "محصولات مورد علاقه شما",
      color: "bg-rose-500",
    },
    {
      href: "/profile/addresses",
      icon: HiLocationMarker,
      label: "آدرس‌های من",
      description: "مدیریت آدرس‌های تحویل",
      color: "bg-blue-500",
    },
    {
      href: "/profile/settings",
      icon: HiCog,
      label: "تنظیمات حساب",
      description: "ویرایش اطلاعات و تنظیمات",
      color: "bg-gray-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        {/* ── هدر پروفایل ── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-5">
            {/* آواتار */}
            <div className="w-20 h-20 rounded-2xl bg-teal-500 flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-3xl font-bold text-white">
                {user?.name?.charAt(0) || user?.mobile?.charAt(0) || "؟"}
              </span>
            </div>

            {/* اطلاعات */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                {user?.name || "کاربر"}
              </h1>
              {user?.mobile && (
                <p className="text-sm text-gray-500" dir="ltr">
                  📱 {user.mobile}
                </p>
              )}
              {/* {user?.email && (
                <p className="text-sm text-gray-500" dir="ltr">
                  ✉️ {user.email}
                </p>
              )} */}
            </div>

            {/* badge پروفایل */}
            <div className="flex-shrink-0">
              {profileComplete ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-xl text-xs font-medium text-green-700">
                  <HiCheckCircle className="w-4 h-4" /> پروفایل کامل
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-medium text-amber-700">
                  <HiExclamationCircle className="w-4 h-4" /> پروفایل ناقص
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── بنر تکمیل پروفایل ── */}
        {!profileComplete && (
          <div className="flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <HiExclamationCircle className="w-6 h-6 text-amber-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-amber-800 text-sm">
                پروفایل ناقص
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                {missingField} خود را اضافه کنید
              </p>
            </div>
            <Link
              href="/profile/settings"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-xl transition-colors whitespace-nowrap flex-shrink-0"
            >
              تکمیل پروفایل
            </Link>
          </div>
        )}

        {/* ── آمار ── */}
        <div className="grid grid-cols-3 gap-4">
          {statCards.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
            >
              <div
                className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}
              >
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-gray-500 mb-1">{s.label}</p>
              {loading ? (
                <div className="h-6 bg-gray-100 rounded animate-pulse w-12" />
              ) : (
                <p
                  className={`font-bold text-gray-900 ${s.isText ? "text-sm" : "text-xl"}`}
                >
                  {typeof s.value === "number"
                    ? s.value.toLocaleString("fa-IR")
                    : s.value}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* ── منو ── */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-900 px-1">
            دسترسی سریع
          </h2>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:border-teal-200 hover:shadow-md transition-all group"
            >
              <div
                className={`w-11 h-11 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}
              >
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">
                  {item.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {item.description}
                </p>
              </div>
              <svg
                className="w-4 h-4 text-gray-400 group-hover:text-teal-500 transition-colors flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
