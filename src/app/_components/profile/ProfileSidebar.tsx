"use client";

// app/(public)/profile/_components/ProfileSidebar.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  HiViewGrid,
  HiShoppingBag,
  HiHeart,
  HiLocationMarker,
  HiCog,
  HiLogout,
  HiPlusCircle,
  HiCamera,
} from "react-icons/hi";
import { ordersAPI, favoritesAPI, cartAPI } from "@/lib/api";
import { logoutAction } from "@/app/_actions/auth";
import { useAuth } from "@/context/AuthContext";
import { guestCart } from "@/lib/guestCart";

const NAV = [
  { href: "/profile", label: "داشبورد", icon: HiViewGrid, exact: true },
  { href: "/profile/orders", label: "تاریخچه سفارشات", icon: HiShoppingBag },
  { href: "/profile/favorites", label: "علاقه‌مندی‌ها", icon: HiHeart },
  { href: "/profile/addresses", label: "آدرس‌ها", icon: HiLocationMarker },
  { href: "/profile/settings", label: "اطلاعات حساب کاربری", icon: HiCog },
];

const fmt = (n: number) => Number(n).toLocaleString("fa-IR");

export function ProfileSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  // setUser را از AuthContext خودت بگیر؛ اگر نامش فرق دارد همین‌جا تنظیم کن
  const { user, setUser } = useAuth() as any;

  const [stats, setStats] = useState({
    orders: 0,
    favorites: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const [o, f] = await Promise.all([
          ordersAPI.getAll({ per_page: 1 }),
          favoritesAPI.getAll({ per_page: 1 }),
        ]);
        setStats({
          orders: o.data.meta?.total ?? 0,
          favorites: f.data.meta?.total ?? 0,
          totalSpent: o.data.meta?.stats?.total_spent ?? 0,
        });
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // ── خروج (منطق سینک سبد سرور به guest cart) ──
  const handleLogout = async () => {
    try {
      const res = await cartAPI.get();
      const serverItems = res.data.data || [];
      if (serverItems.length > 0) {
        const guestItems = serverItems.map((item: any) => ({
          id: item.id,
          quantity: Number(item.quantity) || 1,
          slug: item.slug,
          title: item.title,
          thumbnail: item.thumbnail ?? null,
          price: Number(item.price) || 0,
          sale_price: item.sale_price !== null ? Number(item.sale_price) : null,
          current_price: Number(item.current_price) || 0,
          stock: Number(item.stock) || 0,
        }));
        localStorage.setItem("guest_cart", JSON.stringify(guestItems));
        // تگ بزن که این سبد مال کدوم کاربره — تا کاربر دیگه‌ای merge نشه
        if (user?.id) {
          localStorage.setItem("guest_cart_owner", String(user.id));
        }
      } else {
        guestCart.clear();
        localStorage.removeItem("guest_cart_owner");
      }
    } catch {
      // اگه نشد، guest cart رو دست نزن
    }

    try {
      await logoutAction();
    } catch {}
    setUser(null);
    // flag sync رو پاک کن تا دفعه بعد merge درست کار کنه
    sessionStorage.removeItem("guest_cart_synced");
    window.dispatchEvent(new Event("guestCartUpdated"));
    toast.success("با موفقیت خارج شدید");
    router.push("/");
    router.refresh();
  };

  const isActive = (item: (typeof NAV)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <>
      {/* ═══════════ موبایل: کارت جمع‌وجور با منوی شبکه‌ای ═══════════ */}
      <div className="lg:hidden bg-white rounded-2xl border border-[#F0F0F0] p-4 mb-2">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#F6EAEB] flex items-center justify-center flex-shrink-0">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user?.name || "کاربر"}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-base font-bold text-[#A72F3B]">
                {user?.name?.charAt(0) || user?.mobile?.charAt(0) || "؟"}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[#242424] text-sm truncate">
              {user?.name || "کاربر"}
            </p>
            {(user?.email || user?.mobile) && (
              <p className="text-xs text-[#898989] truncate" dir="ltr">
                {user?.email || user?.mobile}
              </p>
            )}
          </div>
        </div>

        <nav className="grid grid-cols-2 gap-2">
          {NAV.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border transition-colors ${
                  active
                    ? "bg-[#A72F3B] text-white border-[#A72F3B]"
                    : "bg-white text-[#656565] border-[#F0F0F0]"
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border border-[#F0F0F0] bg-white text-[#656565]"
          >
            <HiLogout className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">خروج</span>
          </button>
        </nav>
      </div>

      {/* ═══════════ دسکتاپ: کارت کامل سایدبار ═══════════ */}
      <aside className="hidden lg:block bg-white rounded-2xl border border-[#F0F0F0] p-6 h-fit">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-[#F6EAEB] flex items-center justify-center">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user?.name || "کاربر"}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-[#A72F3B]">
                  {user?.name?.charAt(0) || user?.mobile?.charAt(0) || "؟"}
                </span>
              )}
            </div>
            <span className="absolute bottom-0 right-0 w-7 h-7 bg-[#A72F3B] rounded-full flex items-center justify-center border-2 border-white">
              <HiCamera className="w-3.5 h-3.5 text-white" />
            </span>
          </div>

          <h2 className="mt-4 font-bold text-[#242424]">
            {user?.name || "کاربر"}
          </h2>
          {(user?.email || user?.mobile) && (
            <p className="text-xs text-[#898989] mt-1" dir="ltr">
              {user?.email || user?.mobile}
            </p>
          )}
        </div>

        <div className="mt-6 pt-5 border-t border-[#F0F0F0] space-y-3.5 text-sm">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[#A72F3B] font-medium">
              <HiPlusCircle className="w-4 h-4" /> مجموع خرید
            </span>
            <span className="text-[#242424]">
              {fmt(stats.totalSpent)} تومان
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#656565]">علاقه‌مندی‌ها</span>
            <span className="text-[#242424]">{fmt(stats.favorites)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#656565]">تعداد سفارش‌ها</span>
            <span className="text-[#242424]">{fmt(stats.orders)}</span>
          </div>
        </div>

        <nav className="mt-5 pt-4 border-t border-[#F0F0F0] flex flex-col">
          {NAV.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 py-3.5 border-b border-[#F5F5F5] text-sm transition-colors ${
                  active
                    ? "text-[#A72F3B] font-medium"
                    : "text-[#656565] hover:text-[#A72F3B]"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {active && (
                  <span className="mr-auto w-6 h-0.5 bg-[#A72F3B] rounded-full" />
                )}
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 py-3.5 text-sm text-[#656565] hover:text-[#A72F3B] transition-colors"
          >
            <HiLogout className="w-5 h-5" />
            <span>خروج</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
