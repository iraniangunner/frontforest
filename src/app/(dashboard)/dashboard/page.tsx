"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Settings,
  LogOut,
  Package,
  CreditCard,
  Bell,
  ChevronLeft,
  Smartphone,
  Mail,
  Edit2,
  Loader2,
  Trees,
  Download,
  Heart,
  Star,
  ShoppingBag,
  Palette,
  Code,
  Layout,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle,
  Gift,
  Zap,
  Crown,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { logoutAction } from "@/app/_actions/auth";
import api from "@/lib/api";
import { InternalAxiosRequestConfig } from "axios";
import Image from "next/image";
import Link from "next/link";

interface UserData {
  id: number;
  name: string | null;
  email: string | null;
  mobile: string;
}

interface PurchasedTheme {
  id: number;
  name: string;
  image: string;
  category: string;
  version: string;
  purchaseDate: string;
  downloadCount: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"purchases" | "downloads" | "favorites">("purchases");

  // Mock data - replace with API calls
  const stats = {
    purchases: 12,
    downloads: 47,
    favorites: 8,
    wallet: "۲,۵۰۰,۰۰۰",
  };

  const purchasedThemes: PurchasedTheme[] = [
    {
      id: 1,
      name: "suspended-domain Next.js Admin",
      image: "/themes/suspended-domain-1.jpg",
      category: "داشبورد",
      version: "2.4.0",
      purchaseDate: "۱۴۰۲/۰۹/۱۵",
      downloadCount: 3,
    },
    {
      id: 2,
      name: "suspended-domain - برند تم",
      image: "/themes/suspended-domain-2.jpg",
      category: "فروشگاهی",
      version: "1.8.2",
      purchaseDate: "۱۴۰۲/۰۸/۲۲",
      downloadCount: 5,
    },
    {
      id: 3,
      name: "suspended-domain لندینگ پیج",
      image: "/themes/suspended-domain-3.jpg",
      category: "لندینگ",
      version: "3.1.0",
      purchaseDate: "۱۴۰۲/۰۷/۱۰",
      downloadCount: 2,
    },
  ];

  const recentActivity = [
    { id: 1, type: "download", title: "دانلود suspended-domain Admin", time: "۲ ساعت پیش", icon: Download },
    { id: 2, type: "purchase", title: "خرید suspended-domain - برند تم", time: "۳ روز پیش", icon: ShoppingBag },
    { id: 3, type: "update", title: "بروزرسانی suspended-domain لندینگ", time: "۱ هفته پیش", icon: Zap },
  ];

  useEffect(() => {
    api
      .get("/auth/me", { requiresAuth: true } as InternalAxiosRequestConfig)
      .then((res) => {
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await logoutAction();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl flex items-center justify-center animate-pulse">
              <Trees className="w-8 h-8 text-white" />
            </div>
            {/* <Loader2 className="absolute -bottom-1 -right-1 w-6 h-6 text-emerald-500 animate-spin" /> */}
          </div>
          <p className="text-gray-400 text-sm">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-teal-200/20 via-emerald-100/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-200/20 via-teal-100/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Trees className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:flex items-center">
                <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
               فرانت
                </span>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                 فارست
                </span>
              </div>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                  ۳
                </span>
              </button>

              {/* Profile dropdown */}
              <div className="flex items-center gap-3 pr-3 border-r border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800">{user?.name || "کاربر"}</p>
                  <p className="text-xs text-gray-400" dir="ltr">{user?.mobile}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0) || "U"}
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-10 h-10 bg-rose-50 hover:bg-rose-100 rounded-xl flex items-center justify-center transition-colors group"
              >
                <LogOut className="w-5 h-5 text-rose-500 group-hover:text-rose-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              {/* Cover */}
              <div className="h-24 bg-gradient-to-br from-emerald-500 via-teal-500 to-teal-600 relative">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
              </div>

              {/* Avatar */}
              <div className="relative px-6 -mt-12">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-white">
                    {user?.name ? (
                      <span className="text-3xl font-bold bg-gradient-to-br from-teal-500 to-emerald-500 bg-clip-text text-transparent">
                        {user.name.charAt(0)}
                      </span>
                    ) : (
                      <User className="w-10 h-10 text-slate-300" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="px-6 py-4">
                <h2 className="text-lg font-bold text-gray-800">{user?.name || "کاربر مهمان"}</h2>
                <p className="text-sm text-gray-400 mt-1">عضو ویژه</p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Smartphone className="w-4 h-4 text-teal-500" />
                    <span dir="ltr">{user?.mobile}</span>
                  </div>
                  {user?.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail className="w-4 h-4 text-teal-500" />
                      <span dir="ltr" className="truncate">{user.email}</span>
                    </div>
                  )}
                </div>

                {!user?.name && (
                  <button
                    onClick={() => router.push("/complete-profile")}
                    className="mt-4 w-full py-2.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-sm font-semibold rounded-xl shadow-md"
                  >
                    تکمیل پروفایل
                  </button>
                )}
              </div>
            </div>

            {/* Navigation */}
            <nav className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              {[
                { icon: Package, label: "خریدهای من", href: "/dashboard", active: true },
                { icon: Download, label: "دانلودها", href: "/dashboard/downloads" },
                { icon: Heart, label: "علاقه‌مندی‌ها", href: "/dashboard/favorites", badge: stats.favorites },
                { icon: CreditCard, label: "کیف پول", href: "/dashboard/wallet" },
                { icon: ShoppingBag, label: "سفارشات", href: "/dashboard/orders" },
                { icon: Bell, label: "اعلان‌ها", href: "/dashboard/notifications", badge: 3 },
                { icon: Settings, label: "تنظیمات", href: "/dashboard/settings" },
              ].map((item, index) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center justify-between px-5 py-4 transition-all
                             ${item.active 
                               ? "bg-gradient-to-r from-teal-50 to-emerald-50 border-r-4 border-emerald-500" 
                               : "hover:bg-slate-50"
                             }
                             ${index !== 6 ? "border-b border-slate-100" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                                   ${item.active 
                                     ? "bg-gradient-to-br from-teal-400 to-emerald-500 shadow-lg shadow-emerald-500/20" 
                                     : "bg-slate-100"
                                   }`}>
                      <item.icon className={`w-5 h-5 ${item.active ? "text-white" : "text-slate-500"}`} />
                    </div>
                    <span className={`font-medium ${item.active ? "text-emerald-600" : "text-gray-600"}`}>
                      {item.label}
                    </span>
                  </div>
                  {item.badge && (
                    <span className="px-2.5 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Support Card */}
            <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="relative">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                  <Gift className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">نیاز به کمک دارید؟</h3>
                <p className="text-violet-100 text-sm mb-4">تیم پشتیبانی ما ۲۴ ساعته آماده کمک است</p>
                <button className="w-full py-2.5 bg-white text-violet-600 font-semibold rounded-xl hover:bg-violet-50 transition-colors">
                  شروع گفتگو
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "خریدها", value: stats.purchases, icon: ShoppingBag, color: "from-teal-400 to-teal-500", bgColor: "bg-teal-50" },
                { label: "دانلودها", value: stats.downloads, icon: Download, color: "from-emerald-400 to-emerald-500", bgColor: "bg-emerald-50" },
                { label: "علاقه‌مندی", value: stats.favorites, icon: Heart, color: "from-rose-400 to-rose-500", bgColor: "bg-rose-50" },
                { label: "موجودی", value: stats.wallet, icon: CreditCard, color: "from-amber-400 to-amber-500", bgColor: "bg-amber-50", suffix: "تومان" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl transition-shadow group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text`} style={{ color: stat.color.includes('teal') ? '#14b8a6' : stat.color.includes('emerald') ? '#10b981' : stat.color.includes('rose') ? '#f43f5e' : '#f59e0b' }} />
                    </div>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {stat.label} {stat.suffix && <span className="text-xs">({stat.suffix})</span>}
                  </p>
                </div>
              ))}
            </div>

            {/* Purchased Themes Section */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              {/* Section Header */}
              <div className="px-6 py-5 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <Palette className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">قالب‌های خریداری شده</h2>
                      <p className="text-sm text-gray-400">مدیریت و دانلود قالب‌ها</p>
                    </div>
                  </div>
                  <Link
                    href="/themes"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-50 to-emerald-50 text-emerald-600 font-medium rounded-xl hover:from-teal-100 hover:to-emerald-100 transition-colors"
                  >
                    <span>فروشگاه</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mt-5">
                  {[
                    { key: "purchases", label: "همه خریدها", count: 12 },
                    { key: "downloads", label: "دانلود شده", count: 8 },
                    { key: "favorites", label: "علاقه‌مندی", count: 5 },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                                 ${activeTab === tab.key
                                   ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20"
                                   : "bg-slate-100 text-gray-600 hover:bg-slate-200"
                                 }`}
                    >
                      {tab.label}
                      <span className={`px-1.5 py-0.5 rounded-md text-xs
                                       ${activeTab === tab.key ? "bg-white/20" : "bg-slate-200"}`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Themes Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {purchasedThemes.map((theme) => (
                    <div
                      key={theme.id}
                      className="group bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/10 transition-all"
                    >
                      {/* Image */}
                      <div className="relative aspect-[16/10] bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
                        {/* Placeholder - replace with actual image */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Layout className="w-12 h-12 text-slate-400" />
                        </div>
                        
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                            <button className="flex-1 py-2 bg-white text-gray-800 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                              <Download className="w-4 h-4" />
                              دانلود
                            </button>
                            <button className="w-10 h-10 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center">
                              <Heart className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Category badge */}
                        <span className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 rounded-lg">
                          {theme.category}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
                          {theme.name}
                        </h3>
                        
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Code className="w-4 h-4" />
                              v{theme.version}
                            </span>
                            <span className="flex items-center gap-1">
                              <Download className="w-4 h-4" />
                              {theme.downloadCount}
                            </span>
                          </div>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {theme.purchaseDate}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
                          <button className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                            <Download className="w-4 h-4" />
                            دانلود
                          </button>
                          <button className="px-4 py-2.5 bg-slate-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-slate-200 transition-colors">
                            جزئیات
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {purchasedThemes.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">هنوز خریدی نداشته‌اید</h3>
                    <p className="text-gray-400 mb-6">از فروشگاه ما دیدن کنید و قالب مورد نظرتان را پیدا کنید</p>
                    <Link
                      href="/themes"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20"
                    >
                      <Sparkles className="w-5 h-5" />
                      مشاهده فروشگاه
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">فعالیت‌های اخیر</h2>
                  </div>
                </div>

                <div className="p-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={activity.id}
                      className={`flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors
                                 ${index !== recentActivity.length - 1 ? "mb-2" : ""}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                                      ${activity.type === "download" ? "bg-emerald-100" : 
                                        activity.type === "purchase" ? "bg-teal-100" : "bg-amber-100"}`}>
                        <activity.icon className={`w-5 h-5
                                                  ${activity.type === "download" ? "text-emerald-500" : 
                                                    activity.type === "purchase" ? "text-teal-500" : "text-amber-500"}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                      <ChevronLeft className="w-5 h-5 text-gray-300" />
                    </div>
                  ))}
                </div>

                <div className="px-6 py-4 border-t border-slate-100">
                  <button className="w-full text-center text-sm text-emerald-500 font-medium hover:text-emerald-600">
                    مشاهده همه فعالیت‌ها
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">دسترسی سریع</h2>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-2 gap-4">
                  {[
                    { icon: Download, label: "آخرین دانلود", color: "from-emerald-400 to-emerald-500", bg: "bg-emerald-50" },
                    { icon: CreditCard, label: "شارژ کیف پول", color: "from-teal-400 to-teal-500", bg: "bg-teal-50" },
                    { icon: Star, label: "امتیازدهی", color: "from-amber-400 to-amber-500", bg: "bg-amber-50" },
                    { icon: Gift, label: "کد تخفیف", color: "from-rose-400 to-rose-500", bg: "bg-rose-50" },
                  ].map((action) => (
                    <button
                      key={action.label}
                      className={`${action.bg} rounded-2xl p-4 text-center hover:scale-105 transition-transform group`}
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-xl transition-shadow`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm font-medium text-gray-700">{action.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Promo Banner */}
            <div className="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-8 overflow-hidden">
              {/* Decorations */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute top-10 left-20 w-4 h-4 bg-white/30 rounded-full animate-float" />
              <div className="absolute bottom-10 right-32 w-3 h-3 bg-white/20 rounded-full animate-float-delayed" />

              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-right">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4">
                    <Sparkles className="w-4 h-4" />
                    پیشنهاد ویژه
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    ۳۰٪ تخفیف روی همه قالب‌ها
                  </h3>
                  <p className="text-teal-100">
                    فقط تا پایان این هفته - کد تخفیف: FOREST30
                  </p>
                </div>
                <Link
                  href="/themes"
                  className="flex items-center gap-2 px-8 py-4 bg-white text-teal-600 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                >
                  <span>مشاهده قالب‌ها</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}