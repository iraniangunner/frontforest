"use client";

// app/(public)/_components/MegaMenu.tsx
import Link from "next/link";
import { useState, useRef } from "react";
import { HiChevronLeft, HiChevronDown } from "react-icons/hi";

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
  const [activeParent, setActiveParent] = useState<MegaMenuCategory | null>(
    categories[0] || null
  );
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  if (!categories.length) return null;

  const handleEnter = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
          open
            ? "text-teal-600 bg-teal-50"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        }`}
      >
        محصولات
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
          className="absolute right-0 top-[calc(100%+0.5rem)] bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden z-50 flex"
          dir="rtl"
          style={{ minWidth: "560px" }}
        >
          {/* ── ستون راست: لیست parentها ── */}
          <div className="w-52 border-l border-gray-100 py-2 bg-gray-50/50">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onMouseEnter={() => setActiveParent(cat)}
                className={`flex items-center justify-between w-full px-4 py-2.5 text-sm transition-colors ${
                  activeParent?.id === cat.id
                    ? "bg-white text-teal-600 font-semibold"
                    : "text-gray-700 hover:bg-white hover:text-gray-900"
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
                  <HiChevronLeft className="w-4 h-4 flex-shrink-0 mr-1" />
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
                  className="block text-sm font-semibold text-gray-900 hover:text-teal-600 transition-colors mb-3 pb-2 border-b border-gray-100"
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
                          className="block px-2 py-2 text-sm text-gray-600 hover:text-teal-600 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400">زیردسته‌ای موجود نیست</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
