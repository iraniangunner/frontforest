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
import { ordersAPI, favoritesAPI } from "@/lib/api";
import { HiDownload } from "react-icons/hi";

interface Stats {
  purchases: number;
  favorites: number;
  orders: number;
  totalSpent: number;
}

export default function ProfilePage() {
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
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header with Profile */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-xl p-8 mb-8">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

          <div className="relative flex items-center gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <HiUser className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">پروفایل من</h1>
              <p className="text-slate-300 text-lg">
                به داشبورد حساب کاربری خود خوش آمدید
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-slate-100"
            >
              <div
                className={`absolute top-0 right-0 w-32 h-32 ${stat.bgPattern} rounded-full blur-2xl opacity-50 -mr-16 -mt-16`}
              />

              <div className="relative flex items-start justify-between mb-4">
                <div
                  className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <HiArrowTrendingUp className="w-5 h-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="relative">
                <p className="text-slate-600 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">
                  {typeof stat.value === "number"
                    ? stat.value.toLocaleString("fa-IR")
                    : stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Menu */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            دسترسی سریع
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-slate-100"
              >
                {/* Gradient accent on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                <div className="relative flex items-center gap-6">
                  <div
                    className={`p-4 bg-gradient-to-br ${item.gradient} rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                  >
                    <item.icon className="w-7 h-7 text-white" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-slate-700 transition-colors">
                      {item.label}
                    </h3>
                    <p className="text-slate-600 text-sm">{item.description}</p>
                  </div>

                  <svg
                    className="w-6 h-6 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all"
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
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
