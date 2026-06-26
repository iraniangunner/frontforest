"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { HiSearch, HiClock, HiTrendingUp, HiX } from "react-icons/hi";
import { publicProductsAPI } from "@/lib/api";

const RECENT_KEY = "recent_searches";
const RECENT_MAX = 6;

function loadRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveRecent(list: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, RECENT_MAX)));
  } catch {
    /* ignore */
  }
}

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [popular, setPopular] = useState<string[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // بارگذاری جستجوهای اخیر از localStorage
  useEffect(() => {
    setRecent(loadRecent());
  }, []);

  // بارگذاری پرطرفدارها از بک‌اند (یک‌بار، موقع باز شدن اولین بار)
  const fetchPopular = useCallback(async () => {
    if (popular.length > 0 || loadingPopular) return;
    setLoadingPopular(true);
    try {
      const res = await publicProductsAPI.getPopularSearches();
      setPopular(res.data?.data || []);
    } catch {
      setPopular([]);
    } finally {
      setLoadingPopular(false);
    }
  }, [popular.length, loadingPopular]);

  // بستن با کلیک بیرون
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const commitSearch = (term: string) => {
    const q = term.trim();
    if (!q) return;
    // ذخیره در اخیر (بدون تکرار، جدیدترین اول)
    const next = [q, ...recent.filter((r) => r !== q)].slice(0, RECENT_MAX);
    setRecent(next);
    saveRecent(next);
    setOpen(false);
    setQuery("");
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    commitSearch(query);
  };

  const removeRecent = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = recent.filter((r) => r !== term);
    setRecent(next);
    saveRecent(next);
  };

  const clearAllRecent = () => {
    setRecent([]);
    saveRecent([]);
  };

  const handleFocus = () => {
    setOpen(true);
    fetchPopular();
  };

  const showDropdown =
    open && (recent.length > 0 || popular.length > 0 || loadingPopular);

  return (
    <div ref={wrapRef} className="relative flex-1 min-w-0 max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="group relative flex items-center bg-[#F6F6F6] focus-within:bg-white border border-[#F0F0F0] focus-within:border-[#DCACB1] rounded-xl transition-all">
          <HiSearch className="w-[18px] h-[18px] text-[#AFAFAF] mr-3 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            placeholder="جستجوی محصولات..."
            className="flex-1 min-w-0 bg-transparent py-2.5 px-2 text-sm text-[#242424] placeholder-[#AFAFAF] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="پاک کردن"
              className="p-1.5 ml-1 text-[#AFAFAF] hover:text-[#656565] flex-shrink-0"
            >
              <HiX className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            aria-label="جستجو"
            className="sm:hidden p-2 text-[#AFAFAF]"
          >
            <HiSearch className="w-[18px] h-[18px]" />
          </button>
        </div>
      </form>

      {/* ── Dropdown ── */}
      {showDropdown && (
        <div
          className="absolute top-[calc(100%+0.5rem)] right-0 left-0 bg-white rounded-2xl border border-[#F0F0F0] shadow-xl shadow-black/5 overflow-hidden z-50 animate-[searchIn_0.15s_ease-out]"
          dir="rtl"
        >
          {/* جستجوهای اخیر */}
          {recent.length > 0 && (
            <div className="p-3 border-b border-[#F5F5F5]">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-semibold text-[#898989]">
                  جستجوهای اخیر
                </span>
                <button
                  type="button"
                  onClick={clearAllRecent}
                  className="text-[11px] text-[#AFAFAF] hover:text-[#C30000] transition-colors"
                >
                  پاک کردن همه
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recent.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => commitSearch(term)}
                    className="group inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#F8F8F8] hover:bg-[#F6EAEB] text-[#656565] hover:text-[#A72F3B] text-xs rounded-lg border border-[#F0F0F0] transition-colors"
                  >
                    <HiClock className="w-3 h-3 opacity-60" />
                    {term}
                    <span
                      onClick={(e) => removeRecent(term, e)}
                      className="opacity-0 group-hover:opacity-100 hover:text-[#C30000] transition-opacity"
                    >
                      <HiX className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* جستجوهای پرطرفدار */}
          <div className="p-3">
            <div className="flex items-center gap-1.5 mb-2 px-1">
              <HiTrendingUp className="w-3.5 h-3.5 text-[#A72F3B]" />
              <span className="text-xs font-semibold text-[#898989]">
                جستجوهای پرطرفدار
              </span>
            </div>

            {loadingPopular ? (
              <div className="space-y-1.5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-8 bg-[#F5F5F5] rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : popular.length > 0 ? (
              <ul className="space-y-0.5">
                {popular.map((term) => (
                  <li key={term}>
                    <button
                      type="button"
                      onClick={() => commitSearch(term)}
                      className="flex items-center gap-2.5 w-full px-2 py-2 text-sm text-[#656565] hover:text-[#A72F3B] hover:bg-[#F6EAEB] rounded-lg transition-colors text-right"
                    >
                      <HiSearch className="w-4 h-4 text-[#AFAFAF] flex-shrink-0" />
                      {term}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#AFAFAF] px-2 py-1.5">
                موردی برای نمایش نیست
              </p>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes searchIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
