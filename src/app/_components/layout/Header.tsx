"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiShoppingCart,
  HiUser,
  HiHome,
  HiPhone,
  HiInformationCircle,
  HiNewspaper,
} from "react-icons/hi";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import MegaMenu from "../home/MegaMenu";
import SearchBar from "../ui/SearchBar";

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
  const pathname = usePathname();
  // فقط نمایش — منطق merge توی CartContext هست
  const { displayCount, cartLoading } = useCart();
  const { user, loading } = useAuth();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 lg:gap-6 h-16">
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

          {/* لینک‌ها + دسته‌بندی‌ها — دسکتاپ، کنار لوگو */}
          <nav className="hidden lg:flex items-center gap-1 flex-shrink-0">
            <MegaMenu categories={categories} />

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
          </nav>

          {/* جستجو — کامپوننت جدا با dropdown اخیر/پرطرفدار */}
          <SearchBar />

          {/* اکشن‌ها */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* سبد خرید */}
            <Link
              href="/cart"
              className="relative w-10 h-10 flex items-center justify-center text-[#656565] hover:text-[#A72F3B] hover:bg-[#F6EAEB] rounded-xl transition-colors"
              aria-label="سبد خرید"
            >
              <HiShoppingCart className="w-[21px] h-[21px]" />
              {cartLoading ? (
                <span className="absolute top-0.5 left-0.5 w-[17px] h-[17px] flex items-center justify-center">
                  <span className="w-2 h-2 border border-[#A72F3B]/40 border-t-[#A72F3B] rounded-full animate-spin" />
                </span>
              ) : (
                displayCount > 0 && (
                  <span className="absolute top-0.5 left-0.5 min-w-[17px] h-[17px] px-1 bg-[#A72F3B] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {displayCount > 99 ? "99+" : displayCount}
                  </span>
                )
              )}
            </Link>

            {/* کاربر — دسکتاپ */}
            {loading ? (
              <div className="hidden lg:block w-28 h-10 bg-[#F5F5F5] rounded-xl animate-pulse" />
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
                    <span>حساب کاربری</span>
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
    </header>
  );
}
