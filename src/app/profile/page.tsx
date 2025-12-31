"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  HiUser,
  HiShoppingBag,
  HiHeart,
  HiDownload,
  HiCreditCard,
  HiCog,
  HiLogout,
} from "react-icons/hi";
import { ordersAPI, favoritesAPI } from "@/lib/api";
import toast from "react-hot-toast";

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
        totalSpent: 0, // Calculate from orders if needed
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      href: "/profile/purchases",
      icon: HiDownload,
      label: "خریدهای من",
      count: stats.purchases,
      color: "bg-green-500",
    },
    {
      href: "/profile/favorites",
      icon: HiHeart,
      label: "علاقه‌مندی‌ها",
      count: stats.favorites,
      color: "bg-red-500",
    },
    {
      href: "/profile/orders",
      icon: HiShoppingBag,
      label: "سفارشات",
      count: stats.orders,
      color: "bg-blue-500",
    },
    {
      href: "/profile/settings",
      icon: HiCog,
      label: "تنظیمات",
      color: "bg-gray-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <HiUser className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">پروفایل من</h1>
              <p className="text-gray-500">مدیریت حساب کاربری</p>
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow flex items-center gap-4"
            >
              <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.label}</h3>
                {item.count !== undefined && (
                  <p className="text-sm text-gray-500">{item.count} مورد</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}