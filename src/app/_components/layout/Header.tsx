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
  HiSearch,
  HiCog,
  HiShoppingBag,
  HiHome,
  HiTemplate,
  HiPhone,
  HiInformationCircle,
  HiQuestionMarkCircle,
  HiNewspaper,
} from "react-icons/hi";
import { Trees } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { logoutAction } from "@/app/_actions/auth";
import toast from "react-hot-toast";

const navLinks = [
  { href: "/", label: "خانه", icon: HiHome },
  { href: "/components", label: "کامپوننت‌ها", icon: HiTemplate },
  { href: "/about", label: "درباره ما", icon: HiInformationCircle },
  { href: "/contact", label: "تماس با ما", icon: HiPhone },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { cartCount, refreshCart, clearCart } = useCart();
  const { user, setUser, loading } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Refresh cart on user change
  useEffect(() => {
    if (user) {
      refreshCart();
    }
  }, [user]);

  // Close user menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/components?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAction();
      setUser(null);
      setUserMenuOpen(false);
      clearCart();
      toast.success("با موفقیت خارج شدید");
      router.push("/");
      router.refresh();
    } catch (error) {
      setUser(null);
      setUserMenuOpen(false);
      clearCart();
      toast.error("خطا در خروج");
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-gray-200/50"
            : "bg-white border-b border-gray-100"
        }`}
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:shadow-xl group-hover:shadow-emerald-500/30 group-hover:scale-105 transition-all duration-300">
                  <Trees className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="hidden sm:flex items-center">
                <span className="text-xl font-black bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
                  فرانت
                </span>
                <span className="text-xl font-black bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                  فارست
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive(link.href)
                      ? "text-teal-600 bg-teal-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                aria-label="جستجو"
              >
                <HiSearch className="w-5 h-5" />
              </button>

              {/* Cart Button */}
              <Link
                href="/cart"
                className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors group"
                aria-label="سبد خرید"
              >
                <HiShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Divider */}
              <div className="hidden sm:block w-px h-8 bg-gray-200 mx-1" />

              {/* Auth Section */}
              {loading ? (
                <div className="w-10 h-10 bg-gray-100 rounded-xl animate-pulse" />
              ) : user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center gap-2 p-1.5 rounded-xl transition-all duration-200 ${
                      userMenuOpen ? "bg-gray-100" : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-white text-sm font-bold">
                        {user.name?.charAt(0) || user.mobile.charAt(1)}
                      </span>
                    </div>
                    <HiChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 hidden sm:block ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* User Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 py-2">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-white font-bold">
                              {user.name?.charAt(0) || user.mobile.charAt(1)}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {user.name || "کاربر"}
                            </p>
                            <p className="text-sm text-gray-500" dir="ltr">
                              {user.mobile}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <HiUser className="w-4 h-4 text-gray-500" />
                          </div>
                          <span className="font-medium">پروفایل من</span>
                        </Link>

                        <Link
                          href="/profile/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <HiShoppingBag className="w-4 h-4 text-blue-500" />
                          </div>
                          <span className="font-medium">سفارشات</span>
                        </Link>

                        <Link
                          href="/profile/purchases"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                            <HiDownload className="w-4 h-4 text-emerald-500" />
                          </div>
                          <span className="font-medium">خریدهای من</span>
                        </Link>

                        <Link
                          href="/profile/favorites"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center">
                            <HiHeart className="w-4 h-4 text-rose-500" />
                          </div>
                          <span className="font-medium">علاقه‌مندی‌ها</span>
                        </Link>

                        <Link
                          href="/profile/settings"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <HiCog className="w-4 h-4 text-gray-500" />
                          </div>
                          <span className="font-medium">تنظیمات</span>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 pt-2 mt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 w-full text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                            <HiLogout className="w-4 h-4 text-red-500" />
                          </div>
                          <span className="font-medium">خروج از حساب</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    ورود
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <span className="hidden sm:inline">ثبت‌نام رایگان</span>
                    <span className="sm:hidden">ورود</span>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors lg:hidden"
                aria-label="منو"
              >
                {mobileMenuOpen ? (
                  <HiX className="w-5 h-5" />
                ) : (
                  <HiMenu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Only Navigation Links */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? "max-h-[400px]" : "max-h-0"
          }`}
        >
          <div className="px-4 py-4 bg-gray-50 border-t border-gray-100 space-y-1">
            {/* Navigation Links Only */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive(link.href)
                    ? "bg-teal-50 text-teal-600"
                    : "text-gray-700 hover:bg-white"
                }`}
              >
                <link.icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}

            {/* Login/Register for Guests Only */}
            {!user && (
              <>
                <div className="border-t border-gray-200 my-3" />
                <div className="flex gap-2 px-2">
                  <Link
                    href="/login"
                    className="flex-1 px-4 py-3 text-center text-gray-700 font-medium bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    ورود
                  </Link>
                  <Link
                    href="/register"
                    className="flex-1 px-4 py-3 text-center text-white font-medium bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl shadow-lg shadow-emerald-500/25"
                  >
                    ثبت‌نام
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60]" dir="rtl">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          />

          {/* Search Box */}
          <div className="relative max-w-2xl mx-auto mt-20 px-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl blur-xl opacity-20" />
                <div className="relative flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden">
                  <HiSearch className="w-6 h-6 text-gray-400 mr-4" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="جستجوی کامپوننت..."
                    className="flex-1 py-5 px-2 text-lg text-gray-700 placeholder-gray-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="p-3 m-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <HiX className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </form>

            {/* Quick Links */}
            {/* <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <span className="text-sm text-white/70">پرطرفدار:</span>
              {["فرم ورود", "دکمه", "کارت", "نوار ناوبری"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    router.push(`/components?search=${encodeURIComponent(tag)}`);
                    setSearchOpen(false);
                  }}
                  className="px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white text-sm rounded-lg hover:bg-white/20 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div> */}
          </div>
        </div>
      )}
    </>
  );
}
