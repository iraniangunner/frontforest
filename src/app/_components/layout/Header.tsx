"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  HiShoppingCart,
  HiUser,
  HiMenu,
  HiX,
  HiChevronDown,
  HiLogout,
  HiHeart,
  HiDownload,
} from "react-icons/hi";
import { useCart } from "@/context/CartContext";
import { authAPI } from "@/lib/api";
import toast from "react-hot-toast";

interface User {
  id: number;
  name: string;
  mobile: string;
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { cartCount, refreshCart, clearCart } = useCart();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      refreshCart();
    }
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const checkAuth = async () => {
    try {
      // This uses axios with refresh token interceptor
      const response = await authAPI.me();
      
      // Check structure
      if (response.data.data) {
        setUser(response.data.data);
      } else if (response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(response.data);
      }
    } catch (error: any) {
      // If 401 and refresh failed, user will be redirected to login by interceptor
      // Otherwise just set user to null
      console.error("Auth check error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // This uses axios with token
      await authAPI.logout();

      // Clear Next.js cookie
      await fetch("/api/auth/logout", { method: "POST" });

      setUser(null);
      setUserMenuOpen(false);
      clearCart();
      toast.success("با موفقیت خارج شدید");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state even if API fails
      setUser(null);
      setUserMenuOpen(false);
      clearCart();
      toast.error("خطا در خروج");
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              فرانت‌فارست
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium ${pathname === "/" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
            >
              خانه
            </Link>
            <Link
              href="/components"
              className={`text-sm font-medium ${pathname.startsWith("/components") ? "text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
            >
              کامپوننت‌ها
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            
            {/* Cart Icon */}
            <Link href="/cart" className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <HiShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Auth Section */}
            {loading ? (
              <div className="w-20 h-9 bg-gray-100 rounded-lg animate-pulse"></div>
            ) : user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <HiUser className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block" dir="ltr">
                    {user.mobile}
                  </span>
                  <HiChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute left-0 mt-2 w-52 bg-white rounded-xl shadow-lg border py-2 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="font-medium text-gray-900">{user.name || "کاربر"}</p>
                      <p className="text-sm text-gray-500" dir="ltr">{user.mobile}</p>
                    </div>
                    
                    <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50">
                      <HiUser className="w-5 h-5 text-gray-400" />
                      <span>پروفایل</span>
                    </Link>
                    <Link href="/profile/purchases" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50">
                      <HiDownload className="w-5 h-5 text-gray-400" />
                      <span>خریدهای من</span>
                    </Link>
                    <Link href="/profile/favorites" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50">
                      <HiHeart className="w-5 h-5 text-gray-400" />
                      <span>علاقه‌مندی‌ها</span>
                    </Link>
                    
                    <div className="border-t mt-2 pt-2">
                      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 w-full text-red-600 hover:bg-red-50">
                        <HiLogout className="w-5 h-5" />
                        <span>خروج</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
              >
                <HiUser className="w-4 h-4" />
                <span>ورود / ثبت‌نام</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
            >
              {mobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-2">
          <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">خانه</Link>
          <Link href="/components" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">کامپوننت‌ها</Link>
          {user && (
            <>
              <div className="border-t my-2"></div>
              <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">پروفایل</Link>
              <Link href="/profile/purchases" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">خریدهای من</Link>
              <Link href="/profile/favorites" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">علاقه‌مندی‌ها</Link>
              <button onClick={handleLogout} className="block w-full text-right px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">خروج</button>
            </>
          )}
        </div>
      )}
    </header>
  );
}