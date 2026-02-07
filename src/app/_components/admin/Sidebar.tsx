"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineHome,
  HiOutlineFolder,
  HiOutlineTag,
  HiOutlineCube,
  HiOutlineStar,
  HiOutlineLogout,
} from "react-icons/hi";

const menuItems = [
  { path: "/admin", icon: HiOutlineHome, label: "داشبورد" },
  { path: "/admin/categories", icon: HiOutlineFolder, label: "دسته‌بندی‌ها" },
  { path: "/admin/tags", icon: HiOutlineTag, label: "تگ‌ها" },
  { path: "/admin/components", icon: HiOutlineCube, label: "کامپوننت‌ها" },
  { path: "/admin/reviews", icon: HiOutlineStar, label: "نظرات" },
  { path: "/admin/contact", icon: HiOutlineStar, label: "پیام های ارسالی" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    // Call your logout API
    window.location.href = "/login";
  };

  return (
    <aside className="fixed right-0 top-0 h-full w-64 bg-gray-900 text-white z-40">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-800">
        <h1 className="text-xl font-bold">پنل مدیریت</h1>
      </div>

      {/* Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive =
              item.path === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.path);

            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Logout */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 w-full"
          >
            <HiOutlineLogout className="w-5 h-5" />
            <span>خروج</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
