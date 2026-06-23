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
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useUserStatus } from "@/context/UserStatusContext";
import { logoutAction } from "@/app/_actions/auth";
import { guestCart } from "@/lib/guestCart";
import { cartAPI } from "@/lib/api";
import toast from "react-hot-toast";
import MegaMenu from "../home/MegaMenu";

interface MegaMenuChild {
  id: number;
  name: string;
  slug: string;
}
interface MegaMenuCategory {
  id: number;
  name: string;
  slug: string;
  children?: MegaMenuChild[];
}

const navLinks = [
  { href: "/", label: "خانه", icon: HiHome },
  { href: "/about", label: "درباره ما", icon: HiInformationCircle },
  { href: "/posts", label: "اخبار", icon: HiNewspaper },
  { href: "/contact", label: "تماس با ما", icon: HiPhone },
];

interface Props {
  categories?: MegaMenuCategory[];
}

export default function Header({ categories = [] }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const { cartCount, refreshCart, clearCart } = useCart();
  const { user, setUser, loading } = useAuth();
  const { refresh: refreshUserStatus } = useUserStatus();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [activeMobileParent, setActiveMobileParent] =
    useState<MegaMenuCategory | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  // ── guest cart count ──
  const [guestCount, setGuestCount] = useState(() => guestCart.count());

  useEffect(() => {
    const updateGuestCount = () => {
      setGuestCount(user ? 0 : guestCart.count());
    };

    updateGuestCount();

    // storage event: برای تغییرات از tab های دیگه
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "guest_cart") updateGuestCount();
    };

    // custom event: برای تغییرات توی همین tab (از ProductInfo)
    const handleGuestCartUpdate = () => updateGuestCount();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("guestCartUpdated", handleGuestCartUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("guestCartUpdated", handleGuestCartUpdate);
    };
  }, [user]);

  // تعداد نهایی روی آیکون
  const displayCount = !loading && !user ? guestCount : cartCount;
  // اول true تا اولین refreshCart تموم بشه
  const [cartLoading, setCartLoading] = useState(true);
  // وقتی user مشخص شد ولی هنوز refresh/sync نشده، loading نگه دار
  const cartReady = useRef(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // وقتی auth چک شد و کاربر لاگین نبود، loading رو خاموش کن
  useEffect(() => {
    if (!loading && !user) {
      setCartLoading(false);
      cartReady.current = true;
    }
  }, [loading, user]);

  useEffect(() => {
    if (!user) return;

    setCartLoading(true);

    const syncThenRefresh = async () => {
      try {
        const guestItems = guestCart.get();
        const owner = localStorage.getItem("guest_cart_owner");

        // اگه سبد مال کاربر دیگه‌ایه (تگ owner با کاربر فعلی فرق داره) → دور بریز
        if (owner && String(user.id) !== owner) {
          guestCart.clear();
          localStorage.removeItem("guest_cart_owner");
          await refreshCart();
          return;
        }

        // فقط یه بار بعد از لاگین merge کن
        if (
          guestItems.length > 0 &&
          sessionStorage.getItem("guest_cart_synced") !== "true"
        ) {
          sessionStorage.setItem("guest_cart_synced", "true");
          try {
            // یه call واحد — سبد سرور دقیقاً با guest cart یکی میشه
            await cartAPI.merge(
              guestItems.map((i) => ({
                product_id: i.id,
                quantity: i.quantity,
              })),
              "replace"
            );
          } catch {
            // اگه merge خطا داد، guest cart رو نگه میداریم
          }
          guestCart.clear();
          localStorage.removeItem("guest_cart_owner");
          // وضعیت محصولات (isInCart) رو هم آپدیت کن
          await refreshUserStatus();
        }
        await refreshCart();
      } finally {
        setCartLoading(false);
        cartReady.current = true;
      }
    };

    syncThenRefresh();
  }, [user]);

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

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
    setMobileCategoriesOpen(false);
    setActiveMobileParent(null);
  }, [pathname]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    // ── قبل از خروج، سبد سرور رو بخون و توی guest cart بریز ──
    // اینطوری بعد از logout همون سبد رو میبینی و میتونی ادامه بدی
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
    setUserMenuOpen(false);
    // flag sync رو پاک کن تا دفعه بعد merge درست کار کنه
    sessionStorage.removeItem("guest_cart_synced");
    window.dispatchEvent(new Event("guestCartUpdated"));
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Image
                src="/images/petra-logo.png"
                alt="فروشگاه پترا"
                width={120}
                height={40}
                className="object-contain"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/"
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive("/")
                    ? "text-teal-600 bg-teal-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                خانه
              </Link>

              <MegaMenu categories={categories} />

              {navLinks
                .filter((l) => l.href !== "/")
                .map((link) => (
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

            {/* Right Section */}
            <div className="flex items-center gap-1">
              {/* جستجو */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                aria-label="جستجو"
              >
                <HiSearch className="w-5 h-5" />
              </button>

              {/* سبد خرید — displayCount شامل guest هم میشه */}
              <Link
                href="/cart"
                className="hidden lg:block relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors group"
                aria-label="سبد خرید"
              >
                <HiShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartLoading ? (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30">
                    <span className="w-2.5 h-2.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  </span>
                ) : (
                  displayCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30">
                      {displayCount > 99 ? "99+" : displayCount}
                    </span>
                  )
                )}
              </Link>

              <div className="hidden sm:block w-px h-6 bg-gray-200 mx-0.5" />

              {/* Auth */}
              {loading ? (
                <div className="hidden lg:block w-9 h-9 bg-gray-100 rounded-xl animate-pulse" />
              ) : user ? (
                <div className="relative hidden lg:block" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center gap-1.5 p-1.5 rounded-xl transition-all duration-200 ${
                      userMenuOpen ? "bg-gray-100" : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                      <span className="text-white text-sm font-bold">
                        {user.name?.charAt(0) ||
                          (user.mobile ?? user.email)?.charAt(0)}
                      </span>
                    </div>
                    <HiChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 hidden md:block ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
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
                              className={`w-8 h-8 ${item.bg} rounded-lg flex items-center justify-center flex-shrink-0`}
                            >
                              <item.icon className={`w-4 h-4 ${item.ic}`} />
                            </div>
                            <span className="font-medium text-sm">
                              {item.label}
                            </span>
                          </Link>
                        ))}
                      </div>

                      <div className="border-t border-gray-100 pt-2 mt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 w-full text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
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
                  className="hidden lg:flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                  aria-label="ورود / ثبت نام"
                >
                  <HiUser className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">ورود / ثبت‌نام</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
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
                    className="p-3 m-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0"
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
