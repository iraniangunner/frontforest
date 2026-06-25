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
  categories?: MegaMenuCategory[];
}

export default function MobileBottomNav({ categories = [] }: Props) {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { user } = useAuth();

  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [activeParent, setActiveParent] = useState<MegaMenuCategory | null>(
    null,
  );

  useEffect(() => {
    setCategoriesOpen(false);
    setActiveParent(null);
  }, [pathname]);

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
      active ? "text-[#A72F3B]" : "text-[#898989] hover:text-[#242424]"
    }`;

  const indicator = (active: boolean) =>
    `absolute top-0 h-0.5 w-8 rounded-full transition-all duration-200 ${
      active ? "bg-[#A72F3B] opacity-100" : "opacity-0"
    }`;

  return (
    <>
      {/* ── نوار پایین موبایل ── */}
      <nav
        dir="rtl"
        aria-label="ناوبری اصلی موبایل"
        className="fixed bottom-0 inset-x-0 z-50 lg:hidden border-t border-[#F0F0F0] bg-white/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
      >
        <ul className="flex items-stretch justify-around">
          {/* خانه */}
          <li className="flex-1">
            <Link
              href="/"
              className={itemClass(isActive("/"))}
              aria-current={isActive("/") ? "page" : undefined}
            >
              <span className={indicator(isActive("/"))} />
              <HiHome
                className={`w-6 h-6 transition-transform ${isActive("/") ? "scale-110" : ""}`}
              />
              <span className="text-[11px] font-medium leading-none">خانه</span>
            </Link>
          </li>

          {/* محصولات — باز کردن drawer */}
          <li className="flex-1">
            <button
              type="button"
              onClick={() => setCategoriesOpen(true)}
              aria-expanded={categoriesOpen}
              aria-label="دسته‌بندی‌ها"
              className={`${itemClass(categoriesOpen || pathname.startsWith("/products"))} w-full`}
            >
              <span
                className={indicator(
                  categoriesOpen || pathname.startsWith("/products"),
                )}
              />
              <HiViewGrid className="w-6 h-6" />
              <span className="text-[11px] font-medium leading-none">
              دسته بندی ها
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
              <span className={indicator(isActive("/cart"))} />
              <span className="relative">
                <HiShoppingCart
                  className={`w-6 h-6 transition-transform ${isActive("/cart") ? "scale-110" : ""}`}
                />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#A72F3B] px-1 text-[10px] font-bold leading-none text-white">
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
              <span className={indicator(isActive("/posts"))} />
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
                className={indicator(
                  isActive("/profile") || isActive("/login"),
                )}
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

      {/* ── Drawer دسته‌بندی موبایل با انیمیشن ── */}
      {categoriesOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden" dir="rtl">
          {/* backdrop با fade */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
            onClick={() => {
              setCategoriesOpen(false);
              setActiveParent(null);
            }}
          />

          {/* پنل از راست با slide */}
          <div className="absolute top-0 right-0 h-full w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col animate-[slideInRight_0.3s_cubic-bezier(0.16,1,0.3,1)]">
            {/* هدر drawer */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#F0F0F0] bg-[#F6EAEB]">
              {activeParent ? (
                <button
                  onClick={() => setActiveParent(null)}
                  className="flex items-center gap-2 text-[#A72F3B]"
                >
                  <HiChevronDown className="w-5 h-5 -rotate-90" />
                  <span className="font-semibold text-sm">
                    {activeParent.name}
                  </span>
                </button>
              ) : (
                <span className="font-bold text-[#242424] text-sm">
                  دسته‌بندی‌ها
                </span>
              )}
              <button
                onClick={() => {
                  setCategoriesOpen(false);
                  setActiveParent(null);
                }}
                className="p-1.5 text-[#898989] hover:text-[#A72F3B] hover:bg-white rounded-lg transition-colors"
                aria-label="بستن"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            {/* محتوا */}
            <div className="flex-1 overflow-y-auto">
              {!activeParent ? (
                <ul className="py-2">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      {cat.children && cat.children.length > 0 ? (
                        <button
                          onClick={() => setActiveParent(cat)}
                          className="flex items-center justify-between w-full px-4 py-3.5 text-sm text-[#444444] hover:bg-[#F6EAEB] hover:text-[#A72F3B] transition-colors border-b border-[#F5F5F5]"
                        >
                          <span className="font-medium">{cat.name}</span>
                          <HiChevronDown className="w-4 h-4 text-[#AFAFAF] -rotate-90 flex-shrink-0" />
                        </button>
                      ) : (
                        <Link
                          href={`/products/${cat.slug}`}
                          onClick={() => setCategoriesOpen(false)}
                          className="flex items-center justify-between px-4 py-3.5 text-sm text-[#444444] hover:bg-[#F6EAEB] hover:text-[#A72F3B] transition-colors border-b border-[#F5F5F5]"
                        >
                          <span className="font-medium">{cat.name}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="py-2 animate-[slideInRight_0.25s_cubic-bezier(0.16,1,0.3,1)]">
                  <li>
                    <Link
                      href={`/products/${activeParent.slug}`}
                      onClick={() => {
                        setCategoriesOpen(false);
                        setActiveParent(null);
                      }}
                      className="flex items-center gap-2 px-4 py-3.5 text-sm font-semibold text-[#A72F3B] hover:bg-[#F6EAEB] transition-colors border-b border-[#F0F0F0]"
                    >
                      همه‌ی {activeParent.name}
                      <span className="text-xs text-[#AFAFAF] mr-1">←</span>
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
                        className="block px-4 py-3.5 text-sm text-[#444444] hover:bg-[#F6EAEB] hover:text-[#A72F3B] transition-colors border-b border-[#F5F5F5]"
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* keyframes */}
          <style>{`
            @keyframes slideInRight {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
