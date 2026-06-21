"use client";

// app/_components/admin/Sidebar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  HiOutlineHome,
  HiOutlineFolder,
  HiOutlineTag,
  HiOutlineCube,
  HiOutlineStar,
  HiOutlineLogout,
  HiOutlineUsers,
  HiOutlineShoppingCart,
  HiOutlineChatAlt,
  HiOutlineNewspaper,
  HiOutlineAnnotation,
  HiX,
  HiMenu,
  HiChevronRight,
  HiTag,
  HiOutlineRefresh,
  HiOutlineShieldCheck,
  HiOutlineChartBar,
} from "react-icons/hi";

const menuItems = [
  { path: "/admin", icon: HiOutlineHome, label: "داشبورد", group: null },
  {
    path: "/admin/analytics",
    icon: HiOutlineChartBar,
    label: "آمار سایت",
    group: null,
  },
  {
    path: "/admin/products",
    icon: HiOutlineCube,
    label: "محصولات",
    group: "فروشگاه",
  },
  {
    path: "/admin/categories",
    icon: HiOutlineFolder,
    label: "دسته‌بندی‌ها",
    group: "فروشگاه",
  },
  { path: "/admin/tags", icon: HiOutlineTag, label: "تگ‌ها", group: "فروشگاه" },
  {
    path: "/admin/orders",
    icon: HiOutlineShoppingCart,
    label: "سفارشات",
    group: "فروش",
  },
  { path: "/admin/coupons", icon: HiTag, label: "کدهای تخفیف", group: "فروش" },
  {
    path: "/admin/return-requests",
    icon: HiOutlineRefresh,
    label: "مرجوعی‌ها",
    group: "فروش",
  },
  {
    path: "/admin/users",
    icon: HiOutlineUsers,
    label: "کاربران",
    group: "کاربران",
  },
  {
    path: "/admin/sessions",
    icon: HiOutlineShieldCheck,
    label: "نشست‌ها",
    group: "کاربران",
  },
  {
    path: "/admin/posts",
    icon: HiOutlineNewspaper,
    label: "مقالات",
    group: "محتوا",
  },
  {
    path: "/admin/comments",
    icon: HiOutlineAnnotation,
    label: "نظرات مقالات",
    group: "محتوا",
  },
  {
    path: "/admin/reviews",
    icon: HiOutlineStar,
    label: "نظرات محصولات",
    group: "محتوا",
  },
  {
    path: "/admin/contact",
    icon: HiOutlineChatAlt,
    label: "پیام‌های ارسالی",
    group: "محتوا",
  },
];

const grouped = menuItems.reduce((acc, item) => {
  const key = item.group || "__root__";
  if (!acc[key]) acc[key] = [];
  acc[key].push(item);
  return acc;
}, {} as Record<string, typeof menuItems>);

const groupOrder = ["__root__", "فروشگاه", "فروش", "کاربران", "محتوا"];

interface SidebarContentProps {
  pathname: string;
  onClose?: () => void;
}

function SidebarContent({ pathname, onClose }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* هدر */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-gray-800 flex-shrink-0">
        <h1 className="text-lg font-bold text-white">پنل مدیریت</h1>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <HiX className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* منو */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {groupOrder.map((group) => {
          const items = grouped[group];
          if (!items) return null;
          return (
            <div key={group}>
              {group !== "__root__" && (
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-3 pt-4 pb-1.5">
                  {group}
                </p>
              )}
              {items.map((item) => {
                const isActive =
                  item.path === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                    {isActive && (
                      <HiChevronRight className="w-4 h-4 mr-auto opacity-70" />
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* خروج */}
      <div className="p-3 border-t border-gray-800 flex-shrink-0">
        <button
          onClick={() => (window.location.href = "/login")}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white w-full transition-all text-sm"
        >
          <HiOutlineLogout className="w-5 h-5 flex-shrink-0" />
          <span>خروج از پنل</span>
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col fixed right-0 top-0 h-full w-64 bg-gray-900 z-40">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-gray-900 text-white rounded-xl shadow-lg"
      >
        <HiMenu className="w-5 h-5" />
      </button>

      {/* Mobile drawer */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex justify-end"
          dir="rtl"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full bg-gray-900 flex flex-col shadow-2xl">
            <SidebarContent
              pathname={pathname}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
