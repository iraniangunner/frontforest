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
    const onScroll = () => setScrolled(window.scrollY > (bannerOpen ? 80 : 56));
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
      {/* ── نوار اعلان باریک ── */}
      {bannerOpen && (
        <div className="relative bg-[#A72F3B] text-white text-center text-xs py-1.5 px-10">
          <span className="inline-flex items-center gap-1.5">
            <HiTruck className="w-3.5 h-3.5 flex-shrink-0" />
            ارسال سریع به سراسر کشور — همراه با ضمانت اصالت کالا
          </span>
          <button
            onClick={() => setBannerOpen(false)}
            aria-label="بستن"
            className="absolute top-1/2 -translate-y-1/2 right-3 w-5 h-5 flex items-center justify-center rounded-md hover:bg-white/15 transition-colors"
          >
            <HiX className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── ردیف اصلی ── */}
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-[#F0F0F0]"
            : "bg-white border-b border-[#F0F0F0]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 sm:gap-6 h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image
                src="/images/petra-logo.png"
                alt="فروشگاه پترا"
                width={110}
                height={36}
                className="object-contain w-20 sm:w-[110px]"
                priority
              />
            </Link>

            {/* جستجو — جمع‌وجورتر و وسط */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-auto">
              <div className="group relative flex items-center bg-[#F6F6F6] focus-within:bg-white border border-[#F0F0F0] focus-within:border-[#DCACB1] rounded-xl transition-all">
                <HiSearch className="w-[18px] h-[18px] text-[#AFAFAF] mr-3 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی محصولات..."
                  className="flex-1 bg-transparent py-2.5 px-2 text-sm text-[#242424] placeholder-[#AFAFAF] focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="جستجو"
                  className="sm:hidden p-2 text-[#AFAFAF]"
                >
                  <HiSearch className="w-[18px] h-[18px]" />
                </button>
              </div>
            </form>

            {/* اکشن‌ها */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* سبد خرید */}
              <Link
                href="/cart"
                className="relative w-10 h-10 flex items-center justify-center text-[#656565] hover:text-[#A72F3B] hover:bg-[#F6EAEB] rounded-xl transition-colors"
                aria-label="سبد خرید"
              >
                <HiShoppingCart className="w-[21px] h-[21px]" />
                {displayCount > 0 && (
                  <span className="absolute top-0.5 left-0.5 min-w-[17px] h-[17px] px-1 bg-[#A72F3B] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {displayCount > 99 ? "99+" : displayCount}
                  </span>
                )}
              </Link>

              {/* کاربر — فقط دسکتاپ، تخت و مینیمال */}
              {loading ? (
                <div className="hidden lg:block w-28 h-10 bg-[#F5F5F5] rounded-xl animate-pulse" />
              ) : (
                <Link
                  href={user ? "/profile" : "/login"}
                  aria-label={user ? "پروفایل من" : "ورود / ثبت‌نام"}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 border border-[#EDEDED] text-[#242424] hover:border-[#DCACB1] hover:text-[#A72F3B] text-sm font-medium rounded-xl transition-colors"
                >
                  {user && (user.name || user.mobile || user.email) ? (
                    <>
                      <span className="w-6 h-6 rounded-lg bg-[#F6EAEB] text-[#A72F3B] flex items-center justify-center text-xs font-bold">
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

      {/* ── ردیف دسته‌بندی ── */}
      {scrolled && <div className="hidden lg:block h-11" />}
      <div
        className={`hidden lg:block bg-white border-b border-[#F0F0F0] z-50 ${
          scrolled ? "fixed top-0 inset-x-0 shadow-sm" : "relative"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 h-11">
            <Link
              href="/"
              className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all ${
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
                  className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all ${
                    isActive(link.href)
                      ? "text-[#A72F3B] bg-[#F6EAEB]"
                      : "text-[#656565] hover:text-[#242424] hover:bg-[#F8F8F8]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

            {/* سبد و پروفایل — وقتی اسکرول شد */}
            {scrolled && (
              <div className="mr-auto flex items-center gap-1.5 animate-[slideInLeft_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                <Link
                  href="/cart"
                  className="relative w-9 h-9 flex items-center justify-center text-[#656565] hover:text-[#A72F3B] hover:bg-[#F6EAEB] rounded-lg transition-colors"
                  aria-label="سبد خرید"
                >
                  <HiShoppingCart className="w-5 h-5" />
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
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-[#EDEDED] text-[#242424] hover:border-[#DCACB1] hover:text-[#A72F3B] text-[13px] font-medium rounded-lg transition-colors"
                  >
                    {user && (user.name || user.mobile || user.email) ? (
                      <>
                        <span className="w-5 h-5 rounded-md bg-[#F6EAEB] text-[#A72F3B] flex items-center justify-center text-[11px] font-bold">
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
