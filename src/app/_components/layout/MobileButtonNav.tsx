"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiHome,
  HiViewGrid,
  HiShoppingCart,
  HiNewspaper,
  HiUser,
  HiX,
  HiChevronDown,
  HiShoppingBag,
} from "react-icons/hi";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

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

interface Props {
  /** همان دسته‌بندی‌هایی که به Header می‌دهید را به این هم بدهید */
  categories?: MegaMenuCategory[];
}

/**
 * نوار ناوبری پایین مخصوص موبایل — شبیه فرادرس.
 * فقط زیر breakpoint مربوط به lg نمایش داده می‌شود؛ در دسکتاپ مخفی است.
 * دکمه «دسته‌بندی‌ها» همان drawer دسته‌بندی هدر را باز می‌کند،
 * و سبد خرید از useCart خودِ شما می‌آید.
 */
export default function MobileBottomNav({ categories = [] }: Props) {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { user } = useAuth();

  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [activeParent, setActiveParent] = useState<MegaMenuCategory | null>(
    null,
  );

  // بستن drawer هنگام تغییر مسیر
  useEffect(() => {
    setCategoriesOpen(false);
    setActiveParent(null);
  }, [pathname]);

  // قفل کردن scroll صفحه وقتی drawer بازه
  useEffect(() => {
    document.body.style.overflow = categoriesOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [categoriesOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const itemClass = (active: boolean) =>
    `relative flex flex-1 flex-col items-center justify-center gap-1 py-2.5 transition-colors ${
      active ? "text-teal-600" : "text-gray-500 hover:text-gray-800"
    }`;

  return (
    <>
      {/* ── نوار پایین موبایل — فقط زیر lg ── */}
      <nav
        dir="rtl"
        aria-label="ناوبری اصلی موبایل"
        className="fixed bottom-0 inset-x-0 z-50 lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
      >
        <ul className="flex items-stretch justify-around">
          {/* خانه */}
          <li className="flex-1">
            <Link
              href="/"
              className={itemClass(isActive("/"))}
              aria-current={isActive("/") ? "page" : undefined}
            >
              <span
                className={`absolute top-0 h-0.5 w-8 rounded-full transition-all duration-200 ${isActive("/") ? "bg-teal-600 opacity-100" : "opacity-0"}`}
              />
              <HiHome
                className={`w-6 h-6 transition-transform ${isActive("/") ? "scale-110" : ""}`}
              />
              <span className="text-[11px] font-medium leading-none">خانه</span>
            </Link>
          </li>

          {/* دسته‌بندی‌ها — باز کردن drawer */}
          <li className="flex-1">
            <button
              type="button"
              onClick={() => setCategoriesOpen(true)}
              aria-expanded={categoriesOpen}
              aria-label="دسته‌بندی‌ها"
              className={`${itemClass(categoriesOpen || pathname.startsWith("/products"))} w-full`}
            >
              <span
                className={`absolute top-0 h-0.5 w-8 rounded-full transition-all duration-200 ${categoriesOpen || pathname.startsWith("/products") ? "bg-teal-600 opacity-100" : "opacity-0"}`}
              />
              <HiViewGrid className="w-6 h-6" />
              <span className="text-[11px] font-medium leading-none">
               محصولات
              </span>
            </button>
          </li>

          {/* سبد خرید */}
          <li className="flex-1">
            <Link
              href="/cart"
              className={itemClass(isActive("/cart"))}
              aria-current={isActive("/cart") ? "page" : undefined}
            >
              <span
                className={`absolute top-0 h-0.5 w-8 rounded-full transition-all duration-200 ${isActive("/cart") ? "bg-teal-600 opacity-100" : "opacity-0"}`}
              />
              <span className="relative">
                <HiShoppingCart
                  className={`w-6 h-6 transition-transform ${isActive("/cart") ? "scale-110" : ""}`}
                />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-none text-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </span>
              <span className="text-[11px] font-medium leading-none">
                سبد خرید
              </span>
            </Link>
          </li>

          {/* اخبار */}
          <li className="flex-1">
            <Link
              href="/posts"
              className={itemClass(isActive("/posts"))}
              aria-current={isActive("/posts") ? "page" : undefined}
            >
              <span
                className={`absolute top-0 h-0.5 w-8 rounded-full transition-all duration-200 ${isActive("/posts") ? "bg-teal-600 opacity-100" : "opacity-0"}`}
              />
              <HiNewspaper
                className={`w-6 h-6 transition-transform ${isActive("/posts") ? "scale-110" : ""}`}
              />
              <span className="text-[11px] font-medium leading-none">
                اخبار
              </span>
            </Link>
          </li>

          {/* پروفایل / ورود */}
          <li className="flex-1">
            <Link
              href={user ? "/profile" : "/login"}
              className={itemClass(isActive("/profile") || isActive("/login"))}
              aria-current={
                isActive("/profile") || isActive("/login") ? "page" : undefined
              }
            >
              <span
                className={`absolute top-0 h-0.5 w-8 rounded-full transition-all duration-200 ${isActive("/profile") || isActive("/login") ? "bg-teal-600 opacity-100" : "opacity-0"}`}
              />
              <HiUser
                className={`w-6 h-6 transition-transform ${isActive("/profile") || isActive("/login") ? "scale-110" : ""}`}
              />
              <span className="text-[11px] font-medium leading-none">
                {user ? "پروفایل" : "ورود"}
              </span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* ── Drawer دسته‌بندی موبایل — مثل فرادرس ── */}
      {categoriesOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden" dir="rtl">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setCategoriesOpen(false);
              setActiveParent(null);
            }}
          />

          {/* پنل اصلی — از راست */}
          <div className="absolute top-0 right-0 h-full w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col">
            {/* هدر drawer */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              {activeParent ? (
                <button
                  onClick={() => setActiveParent(null)}
                  className="flex items-center gap-2 text-gray-700"
                >
                  <HiChevronDown className="w-5 h-5 -rotate-90" />
                  <span className="font-semibold text-sm">
                    {activeParent.name}
                  </span>
                </button>
              ) : (
                <span className="font-semibold text-gray-900 text-sm">
                  دسته‌بندی‌ها
                </span>
              )}
              <button
                onClick={() => {
                  setCategoriesOpen(false);
                  setActiveParent(null);
                }}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"
                aria-label="بستن"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            {/* محتوا */}
            <div className="flex-1 overflow-y-auto">
              {!activeParent ? (
                /* لیست parentها */
                <ul className="py-2">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      {cat.children && cat.children.length > 0 ? (
                        <button
                          onClick={() => setActiveParent(cat)}
                          className="flex items-center justify-between w-full px-4 py-3.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-50"
                        >
                          <span className="font-medium">{cat.name}</span>
                          <HiChevronDown className="w-4 h-4 text-gray-400 -rotate-90 flex-shrink-0" />
                        </button>
                      ) : (
                        <Link
                          href={`/products/${cat.slug}`}
                          onClick={() => setCategoriesOpen(false)}
                          className="flex items-center justify-between px-4 py-3.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-50"
                        >
                          <span className="font-medium">{cat.name}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                /* لیست childهای parent انتخاب‌شده */
                <ul className="py-2">
                  <li>
                    <Link
                      href={`/products/${activeParent.slug}`}
                      onClick={() => {
                        setCategoriesOpen(false);
                        setActiveParent(null);
                      }}
                      className="flex items-center gap-2 px-4 py-3.5 text-sm font-medium text-teal-600 hover:bg-teal-50 transition-colors border-b border-gray-100"
                    >
                      همه‌ی {activeParent.name}
                      <span className="text-xs text-gray-400 mr-1">←</span>
                    </Link>
                  </li>
                  {activeParent.children?.map((child) => (
                    <li key={child.id}>
                      <Link
                        href={`/products/${activeParent.slug}/${child.slug}`}
                        onClick={() => {
                          setCategoriesOpen(false);
                          setActiveParent(null);
                        }}
                        className="block px-4 py-3.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition-colors border-b border-gray-50"
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
