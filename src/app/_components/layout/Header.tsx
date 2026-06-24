"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  HiShoppingCart,
  HiUser,
  HiSearch,
  HiTruck,
  HiX,
  HiHome,
  HiPhone,
  HiInformationCircle,
  HiNewspaper,
} from "react-icons/hi";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
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

  const { cartCount } = useCart();
  const { user, loading } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(true);

  // ── guest cart count ──
  const [guestCount, setGuestCount] = useState(0);

  useEffect(() => {
    const { guestCart } = require("@/lib/guestCart");
    const updateGuestCount = () => setGuestCount(user ? 0 : guestCart.count());
    updateGuestCount();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "guest_cart") updateGuestCount();
    };
    const handleGuestCartUpdate = () => updateGuestCount();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("guestCartUpdated", handleGuestCartUpdate);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("guestCartUpdated", handleGuestCartUpdate);
    };
  }, [user]);

  const displayCount = !loading && !user ? guestCount : cartCount;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > (bannerOpen ? 96 : 70));
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [bannerOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header dir="rtl">
      {/* ── نوار اعلان باریک — قابل بستن ── */}
      {bannerOpen && (
        <div className="relative bg-[#A72F3B] text-white text-center text-xs sm:text-[13px] py-2 px-10">
          <span className="inline-flex items-center gap-1.5">
            <HiTruck className="w-4 h-4 flex-shrink-0" />
            ارسال سریع به سراسر کشور — همراه با ضمانت اصالت کالا
          </span>
          <button
            onClick={() => setBannerOpen(false)}
            aria-label="بستن"
            className="absolute top-1/2 -translate-y-1/2 right-3 w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/15 transition-colors"
          >
            <HiX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── ردیف اصلی ── */}
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-[#A72F3B]/5"
            : "bg-white border-b border-[#F0F0F0]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-6 h-16 sm:h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image
                src="/images/petra-logo.png"
                alt="فروشگاه پترا"
                width={120}
                height={40}
                className="object-contain w-24 sm:w-[120px]"
                priority
              />
            </Link>

            {/* جستجو — درازتر، کنار لوگو سمت راست */}
            <form
              onSubmit={handleSearch}
              className="flex-1 sm:flex-none sm:w-[26rem] lg:w-[34rem] sm:ml-auto"
            >
              <div className="group relative flex items-center bg-[#F4F4F4] focus-within:bg-white border-[1.5px] border-transparent focus-within:border-[#DCACB1] rounded-xl sm:rounded-2xl transition-all focus-within:shadow-[0_0_0_4px_rgba(167,47,59,0.07)]">
                <HiSearch className="w-5 h-5 text-[#AFAFAF] mr-3 sm:mr-4 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی محصولات..."
                  className="flex-1 bg-transparent py-2.5 sm:py-3 px-2 text-sm text-[#242424] placeholder-[#AFAFAF] focus:outline-none"
                />
                <button
                  type="submit"
                  className="hidden sm:block m-1.5 px-5 py-2 bg-[#A72F3B] hover:bg-[#86262F] text-white text-[13px] font-semibold rounded-lg sm:rounded-xl transition-colors flex-shrink-0"
                >
                  جستجو
                </button>
              </div>
            </form>

            {/* اکشن‌ها */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* سبد خرید */}
              <Link
                href="/cart"
                className="relative w-11 h-11 flex items-center justify-center text-[#656565] hover:text-[#A72F3B] hover:bg-[#F6EAEB] rounded-xl transition-colors group"
                aria-label="سبد خرید"
              >
                <HiShoppingCart className="w-[22px] h-[22px] group-hover:scale-110 transition-transform" />
                {displayCount > 0 && (
                  <span className="absolute top-1 left-1 min-w-[18px] h-[18px] px-1.5 bg-[#A72F3B] text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                    {displayCount > 99 ? "99+" : displayCount}
                  </span>
                )}
              </Link>

              <div className="hidden sm:block w-px h-6 bg-[#EDEDED] mx-1" />

              {/* کاربر — فقط دسکتاپ (موبایل توی نوار پایینه) */}
              {loading ? (
                <div className="hidden lg:block w-10 h-10 bg-[#F5F5F5] rounded-xl animate-pulse" />
              ) : (
                <Link
                  href={user ? "/profile" : "/login"}
                  aria-label={user ? "پروفایل من" : "ورود / ثبت‌نام"}
                  className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-[#A72F3B] hover:bg-[#86262F] text-white text-sm font-semibold rounded-xl shadow-lg shadow-[#A72F3B]/25 hover:-translate-y-0.5 transition-all duration-200"
                >
                  {user && (user.name || user.mobile || user.email) ? (
                    <>
                      <span className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-xs font-bold">
                        {user.name?.charAt(0) ||
                          (user.mobile ?? user.email)?.charAt(0)}
                      </span>
                      <span>پروفایل من</span>
                    </>
                  ) : (
                    <>
                      <HiUser className="w-4 h-4" />
                      <span>ورود / ثبت‌نام</span>
                    </>
                  )}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── ردیف دسته‌بندی — وقتی اسکرول شد fixed می‌شود و بالا می‌ماند ── */}
      {/* spacer که جای نوار fixed را پر می‌کند تا محتوا نپرد */}
      {scrolled && <div className="hidden lg:block h-12" />}
      <div
        className={`hidden lg:block bg-white border-b border-[#F0F0F0] z-50 ${
          scrolled
            ? "fixed top-0 inset-x-0 shadow-md shadow-[#A72F3B]/5"
            : "relative"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 h-12">
            <Link
              href="/"
              className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-all ${
                isActive("/")
                  ? "text-[#A72F3B] bg-[#F6EAEB]"
                  : "text-[#656565] hover:text-[#242424] hover:bg-[#F8F8F8]"
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
                  className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-all ${
                    isActive(link.href)
                      ? "text-[#A72F3B] bg-[#F6EAEB]"
                      : "text-[#656565] hover:text-[#242424] hover:bg-[#F8F8F8]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

            {/* سبد و پروفایل — فقط وقتی اسکرول شد و نوار ثابت است */}
            {scrolled && (
              <div className="mr-auto flex items-center gap-1.5 animate-[slideInLeft_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                <Link
                  href="/cart"
                  className="relative w-9 h-9 flex items-center justify-center text-[#656565] hover:text-[#A72F3B] hover:bg-[#F6EAEB] rounded-lg transition-colors group"
                  aria-label="سبد خرید"
                >
                  <HiShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {displayCount > 0 && (
                    <span className="absolute -top-1 -left-1 min-w-[16px] h-4 px-1 bg-[#A72F3B] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {displayCount > 99 ? "99+" : displayCount}
                    </span>
                  )}
                </Link>

                {!loading && (
                  <Link
                    href={user ? "/profile" : "/login"}
                    aria-label={user ? "پروفایل من" : "ورود / ثبت‌نام"}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#A72F3B] hover:bg-[#86262F] text-white text-[13px] font-semibold rounded-lg transition-colors"
                  >
                    {user && (user.name || user.mobile || user.email) ? (
                      <>
                        <span className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center text-[11px] font-bold">
                          {user.name?.charAt(0) ||
                            (user.mobile ?? user.email)?.charAt(0)}
                        </span>
                        <span>پروفایل من</span>
                      </>
                    ) : (
                      <>
                        <HiUser className="w-4 h-4" />
                        <span>ورود / ثبت نام</span>
                      </>
                    )}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </header>
  );
}
