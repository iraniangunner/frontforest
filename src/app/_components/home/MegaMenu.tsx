"use client";

// app/(public)/_components/MegaMenu.tsx
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { HiChevronDown } from "react-icons/hi";

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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!categories.length) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
          open
            ? "text-teal-600 bg-teal-50"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        }`}
      >
        محصولات
        <HiChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-[640px] max-w-[90vw] bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-5 z-50"
          dir="rtl"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat.id}>
                <Link
                  href={`/products/${cat.slug}`}
                  onClick={() => setOpen(false)}
                  className="block text-sm font-semibold text-gray-900 hover:text-teal-600 transition-colors mb-2"
                >
                  {cat.name}
                </Link>
                {cat.children && cat.children.length > 0 && (
                  <ul className="space-y-1.5">
                    {cat.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={`/products/${cat.slug}/${child.slug}`}
                          onClick={() => setOpen(false)}
                          className="block text-sm text-gray-500 hover:text-teal-600 transition-colors"
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
