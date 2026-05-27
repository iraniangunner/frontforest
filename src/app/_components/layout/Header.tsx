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
  HiSearch,
  HiCog,
  HiShoppingBag,
  HiHome,
  HiPhone,
  HiInformationCircle,
  HiLocationMarker,
  HiNewspaper,
} from "react-icons/hi";
import { MdStorefront } from "react-icons/md";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { logoutAction } from "@/app/_actions/auth";
import toast from "react-hot-toast";

// ─────────────────────────────────────────────
// Nav Links
// ─────────────────────────────────────────────
const navLinks = [
  { href: "/", label: "خانه", icon: HiHome },
  { href: "/products", label: "محصولات", icon: MdStorefront },
  { href: "/about", label: "درباره ما", icon: HiInformationCircle },
  { href: "/posts", label: "اخبار", icon: HiNewspaper },
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

  // scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // refresh cart on login
  useEffect(() => {
    if (user) refreshCart();
  }, [user]);

  // close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // focus search input
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAction();
    } catch {}
    setUser(null);
    setUserMenuOpen(false);
    clearCart();
    toast.success("با موفقیت خارج شدید");
    router.push("/");
    router.refresh();
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        dir="rtl"
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-gray-200/50"
            : "bg-white border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between h-16">
            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/petra-logo.png" 
                alt="فانتوم پلاس"
                width={120}
                height={40}
                className="w-auto object-contain"
                priority
              />
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive(link.href)
                      ? "text-teal-600 bg-teal-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* ── Right Section ── */}
            <div className="flex items-center gap-1.5">
              {/* جستجو */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                aria-label="جستجو"
              >
                <HiSearch className="w-5 h-5" />
              </button>

              {/* سبد خرید */}
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

              <div className="hidden sm:block w-px h-8 bg-gray-200 mx-1" />

              {/* Auth */}
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
                        {user.name?.charAt(0) ||
                          (user.mobile ?? user.email)?.charAt(0)}
                      </span>
                    </div>
                    <HiChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 hidden sm:block ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 py-2 z-50">
                      {/* اطلاعات کاربر */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-white font-bold">
                              {user.name?.charAt(0) ||
                                (user.mobile ?? user.email)?.charAt(0)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                              {user.name || "کاربر"}
                            </p>
                            <p
                              className="text-xs text-gray-500 truncate"
                              dir="ltr"
                            >
                              {user.mobile ?? user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* لینک‌ها */}
                      <div className="py-2">
                        {[
                          {
                            href: "/profile",
                            icon: HiUser,
                            bg: "bg-gray-100",
                            ic: "text-gray-500",
                            label: "پروفایل من",
                          },
                          {
                            href: "/profile/orders",
                            icon: HiShoppingBag,
                            bg: "bg-blue-50",
                            ic: "text-blue-500",
                            label: "سفارشات",
                          },
                          {
                            href: "/profile/addresses",
                            icon: HiLocationMarker,
                            bg: "bg-teal-50",
                            ic: "text-teal-500",
                            label: "آدرس‌های من",
                          },
                          {
                            href: "/profile/favorites",
                            icon: HiHeart,
                            bg: "bg-rose-50",
                            ic: "text-rose-500",
                            label: "علاقه‌مندی‌ها",
                          },
                          {
                            href: "/profile/settings",
                            icon: HiCog,
                            bg: "bg-gray-100",
                            ic: "text-gray-500",
                            label: "تنظیمات",
                          },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <div
                              className={`w-8 h-8 ${item.bg} rounded-lg flex items-center justify-center`}
                            >
                              <item.icon className={`w-4 h-4 ${item.ic}`} />
                            </div>
                            <span className="font-medium text-sm">
                              {item.label}
                            </span>
                          </Link>
                        ))}
                      </div>

                      {/* خروج */}
                      <div className="border-t border-gray-100 pt-2 mt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 w-full text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                            <HiLogout className="w-4 h-4 text-red-500" />
                          </div>
                          <span className="font-medium text-sm">
                            خروج از حساب
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                  ورود / ثبت‌نام
                </Link>
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

        {/* ── Mobile Menu ── */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? "max-h-[400px]" : "max-h-0"
          }`}
        >
          <div className="px-4 py-4 bg-gray-50 border-t border-gray-100 space-y-1">
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

            {/* لینک‌های اضافه برای موبایل */}
            {user && (
              <>
                <div className="border-t border-gray-200 my-2" />
                <Link
                  href="/profile/addresses"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-white transition-colors"
                >
                  <HiLocationMarker className="w-5 h-5 text-teal-500" />
                  <span className="font-medium">آدرس‌های من</span>
                </Link>
                <Link
                  href="/profile/orders"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-white transition-colors"
                >
                  <HiShoppingBag className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">سفارشات</span>
                </Link>
              </>
            )}

            {!user && (
              <div className="pt-2">
                <Link
                  href="/login"
                  className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-medium text-sm"
                >
                  ورود / ثبت‌نام
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Search Modal ── */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60]" dir="rtl">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative max-w-2xl mx-auto mt-20 px-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl blur-xl opacity-20" />
                <div className="relative flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden">
                  <HiSearch className="w-6 h-6 text-gray-400 mr-4 flex-shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="جستجوی محصولات..."
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
          </div>
        </div>
      )}
    </>
  );
}
