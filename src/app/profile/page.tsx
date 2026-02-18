"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  HiUser,
  HiShoppingBag,
  HiHeart,
  HiCog,
  HiArrowTrendingUp,
  HiCreditCard,
} from "react-icons/hi2";
import { HiDownload, HiExclamationCircle, HiCheckCircle } from "react-icons/hi";
import { ordersAPI, favoritesAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Stats {
  purchases: number;
  favorites: number;
  orders: number;
  totalSpent: number;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    purchases: 0,
    favorites: 0,
    orders: 0,
    totalSpent: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [purchasesRes, favoritesRes, ordersRes] = await Promise.all([
        ordersAPI.getPurchases({ per_page: 1 }),
        favoritesAPI.getAll({ per_page: 1 }),
        ordersAPI.getAll({ per_page: 1 }),
      ]);

      setStats({
        purchases: purchasesRes.data.meta?.total || 0,
        favorites: favoritesRes.data.meta?.total || 0,
        orders: ordersRes.data.meta?.total || 0,
        totalSpent: purchasesRes.data.meta.total_spent || 0,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const profileComplete = user?.email && user?.mobile;
  const missingField = !user?.email ? "ایمیل" : !user?.mobile ? "شماره موبایل" : null;

  const statCards = [
    {
      label: "خریدهای من",
      value: stats.purchases,
      icon: HiDownload,
      color: "from-blue-500 to-cyan-500",
      bgPattern: "bg-blue-50",
    },
    {
      label: "علاقه‌مندی‌ها",
      value: stats.favorites,
      icon: HiHeart,
      color: "from-rose-500 to-pink-500",
      bgPattern: "bg-rose-50",
    },
    {
      label: "سفارشات",
      value: stats.orders,
      icon: HiShoppingBag,
      color: "from-emerald-500 to-teal-500",
      bgPattern: "bg-emerald-50",
    },
    {
      label: "مجموع خرید",
      value: `${Number(stats.totalSpent).toLocaleString("fa-IR")} تومان`,
      icon: HiCreditCard,
      color: "from-amber-500 to-orange-500",
      bgPattern: "bg-amber-50",
    },
  ];

  const menuItems = [
    {
      href: "/profile/purchases",
      icon: HiDownload,
      label: "خریدهای من",
      description: "مشاهده و دانلود کامپوننت‌های خریداری شده",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      href: "/profile/favorites",
      icon: HiHeart,
      label: "علاقه‌مندی‌ها",
      description: "لیست کامپوننت‌های مورد علاقه شما",
      gradient: "from-rose-500 to-pink-500",
    },
    {
      href: "/profile/orders",
      icon: HiShoppingBag,
      label: "سفارشات",
      description: "پیگیری و مدیریت سفارشات",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      href: "/profile/settings",
      icon: HiCog,
      label: "تنظیمات",
      description: "مدیریت حساب کاربری و تنظیمات",
      gradient: "from-slate-600 to-slate-800",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-xl p-8 mb-6">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

          <div className="relative flex items-center gap-6">
            {/* Avatar */}
            <div className="relative group flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-4xl font-bold text-white">
                  {user?.name?.charAt(0) ||
                    (user?.mobile ?? user?.email)?.charAt(0)?.toUpperCase() ||
                    "؟"}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-white mb-2">
                {user?.name || "کاربر"}
              </h1>
              <div className="flex flex-col gap-1">
                {user?.mobile && (
                  <span className="text-slate-300 text-sm" dir="ltr">
                    📱 {user.mobile}
                  </span>
                )}
                {user?.email && (
                  <span className="text-slate-300 text-sm" dir="ltr">
                    ✉️ {user.email}
                  </span>
                )}
              </div>
            </div>

            {/* Profile completion badge */}
            <div className="flex-shrink-0">
              {profileComplete ? (
                <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl px-3 py-2">
                  <HiCheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 text-xs font-medium">پروفایل کامل</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-xl px-3 py-2">
                  <HiExclamationCircle className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-300 text-xs font-medium">پروفایل ناقص</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* بنر تکمیل پروفایل */}
        {!profileComplete && (
          <div className="flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
            <div className="p-2 bg-amber-100 rounded-xl flex-shrink-0">
              <HiExclamationCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-amber-800">پروفایل شما ناقص است</p>
              <p className="text-sm text-amber-600 mt-0.5">
                {missingField} خود را اضافه کنید تا بتوانید از هر دو روش وارد شوید
              </p>
            </div>
            <Link
              href="/profile/settings"
              className="flex-shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-xl transition-colors whitespace-nowrap"
            >
              تکمیل پروفایل
            </Link>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-slate-100"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bgPattern} rounded-full blur-2xl opacity-50 -mr-16 -mt-16`} />
              <div className="relative flex items-start justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <HiArrowTrendingUp className="w-5 h-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="relative">
                <p className="text-slate-600 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">
                  {loading ? (
                    <span className="inline-block w-12 h-7 bg-slate-100 rounded animate-pulse" />
                  ) : typeof stat.value === "number" ? (
                    stat.value.toLocaleString("fa-IR")
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Menu */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">دسترسی سریع</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-slate-100"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <div className="relative flex items-center gap-6">
                  <div className={`p-4 bg-gradient-to-br ${item.gradient} rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{item.label}</h3>
                    <p className="text-slate-600 text-sm">{item.description}</p>
                  </div>
                  <svg className="w-6 h-6 text-slate-400 group-hover:text-slate-600 group-hover:-translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}