"use client";

// app/(public)/posts/PostsFilter.tsx
import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { HiSearch } from "react-icons/hi";

const CATS = [
  { key: "all", label: "همه" },
  { key: "news", label: "اخبار" },
  { key: "article", label: "مقاله" },
  { key: "product", label: "معرفی محصول" },
  { key: "tutorial", label: "آموزش" },
];

interface Props {
  currentCategory: string;
  currentSearch: string;
  total: number;
}

export default function PostsFilter({
  currentCategory,
  currentSearch,
  total,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentSearch);
  const [, startTransition] = useTransition();

  const updateURL = (params: Record<string, string>) => {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([k, v]) => {
      if (v && v !== "all") sp.set(k, v);
      else sp.delete(k);
    });
    sp.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${sp.toString()}`);
    });
  };

  const handleSearch = () => updateURL({ search, category: currentCategory });
  const handleCategory = (key: string) => updateURL({ search, category: key });

  return (
    <div className="bg-white border-b border-[#F0F0F0]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between py-7">
          <div>
            <h1 className="text-2xl font-extrabold text-[#242424]">
              اخبار و مقالات
            </h1>
            <p className="text-[#AFAFAF] text-xs mt-0.5">
              {total.toLocaleString("fa-IR")} مطلب
            </p>
          </div>
          <div className="relative">
            <HiSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AFAFAF]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="جستجو..."
              className="pr-9 pl-4 py-2 text-sm border border-[#EDEDED] rounded-lg outline-none focus:ring-2 focus:ring-[#A72F3B]/30 w-48"
            />
          </div>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto">
          {CATS.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleCategory(cat.key)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                currentCategory === cat.key
                  ? "border-[#A72F3B] text-[#A72F3B]"
                  : "border-transparent text-[#656565] hover:text-[#242424]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
