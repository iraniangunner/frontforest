"use client";

// app/(public)/_components/MegaMenu.tsx
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { HiChevronLeft, HiChevronDown, HiViewGrid } from "react-icons/hi";

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
  categories: MegaMenuCategory[];
}

export default function MegaMenu({ categories }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeParent, setActiveParent] = useState<MegaMenuCategory | null>(
    categories[0] || null,
  );
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => setMounted(true), []);

  if (!categories.length) return null;

  const handleEnter = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <>
      {/* ── Overlay تیره — با portal مستقیم روی body تا مستقل از هدر کل صفحه را بپوشاند ── */}
      {mounted &&
        createPortal(
          <div
            className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-30 transition-opacity duration-200 ${
              open ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden="true"
          />,
          document.body,
        )}

      <div
        className="relative z-50"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <button
          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
            open
              ? "text-[#A72F3B] bg-[#F6EAEB]"
              : "text-[#656565] hover:text-[#242424] hover:bg-[#F8F8F8]"
          }`}
        >
          <HiViewGrid className="w-[18px] h-[18px]" />
          دسته‌بندی‌ها
          <HiChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* فاصله‌ی شفاف بین دکمه و پنل، تا hover قطع نشود */}
        {open && <div className="absolute top-full right-0 h-2 w-full" />}

        {open && (
          <div
            className="absolute right-0 top-[calc(100%+0.5rem)] bg-white rounded-2xl shadow-xl shadow-[#A72F3B]/10 border border-[#F0F0F0] overflow-hidden z-50 flex animate-[megaIn_0.2s_ease-out]"
            dir="rtl"
            style={{ minWidth: "560px" }}
          >
            {/* ── ستون راست: لیست parentها ── */}
            <div className="w-52 border-l border-[#F0F0F0] py-2 bg-[#FAFAFA]">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onMouseEnter={() => setActiveParent(cat)}
                  className={`flex items-center justify-between w-full px-4 py-2.5 text-sm transition-colors ${
                    activeParent?.id === cat.id
                      ? "bg-white text-[#A72F3B] font-semibold"
                      : "text-[#444444] hover:bg-white hover:text-[#242424]"
                  }`}
                >
                  <Link
                    href={`/products/${cat.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex-1 text-right"
                  >
                    {cat.name}
                  </Link>
                  {cat.children && cat.children.length > 0 && (
                    <HiChevronLeft
                      className={`w-4 h-4 flex-shrink-0 mr-1 ${
                        activeParent?.id === cat.id
                          ? "text-[#A72F3B]"
                          : "text-[#AFAFAF]"
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* ── پنل کنار: children دسته‌ی فعال ── */}
            <div className="flex-1 p-4">
              {activeParent && (
                <>
                  <Link
                    href={`/products/${activeParent.slug}`}
                    onClick={() => setOpen(false)}
                    className="block text-sm font-semibold text-[#242424] hover:text-[#A72F3B] transition-colors mb-3 pb-2 border-b border-[#F0F0F0]"
                  >
                    همه‌ی {activeParent.name}
                  </Link>

                  {activeParent.children && activeParent.children.length > 0 ? (
                    <ul className="space-y-0.5">
                      {activeParent.children.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={`/products/${activeParent.slug}/${child.slug}`}
                            onClick={() => setOpen(false)}
                            className="block px-2 py-2 text-sm text-[#656565] hover:text-[#A72F3B] hover:bg-[#F6EAEB] rounded-lg transition-colors"
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-[#AFAFAF]">
                      زیردسته‌ای موجود نیست
                    </p>
                  )}
                </>
              )}
            </div>

            <style>{`
              @keyframes megaIn {
                from { opacity: 0; transform: translateY(-6px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
          </div>
        )}
      </div>
    </>
  );
}
