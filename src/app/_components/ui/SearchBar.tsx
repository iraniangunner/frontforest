"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HiSearch, HiX } from "react-icons/hi";

interface SearchBarProps {
  placeholder?: string;
}

export default function SearchBar({
  placeholder = "جستجو در کامپوننت‌ها...",
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialValue = searchParams.get("q") || "";
  const [localValue, setLocalValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(searchParams.get("q") || "");
  }, [searchParams]);

  const updateUrl = (newValue: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newValue) {
      params.set("q", newValue);
    } else {
      params.delete("q");
    }

    params.delete("page");

    const queryString = params.toString();
    router.push(queryString ? `/components?${queryString}` : "/components", {
      scroll: false,
    });
    setIsSearching(false);
  };

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    setIsSearching(true);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      updateUrl(newValue);
    }, 500);
  };

  const handleClear = () => {
    setLocalValue("");
    updateUrl("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClear();
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative group">
      {/* Glow effect on focus — maroon */}
      <div
        className={`absolute -inset-1 bg-gradient-to-r from-[#A72F3B] to-[#86262F] rounded-2xl blur-lg transition-opacity duration-300 ${
          isFocused ? "opacity-20" : "opacity-0"
        }`}
      />

      <div
        className={`relative flex items-center bg-white rounded-xl border-2 transition-all duration-300 ${
          isFocused
            ? "border-[#A72F3B] shadow-lg shadow-[#A72F3B]/10"
            : "border-[#EDEDED] hover:border-[#DCACB1]"
        }`}
      >
        <div
          className={`flex items-center justify-center w-12 h-12 transition-colors duration-200 ${
            isFocused ? "text-[#A72F3B]" : "text-[#AFAFAF]"
          }`}
        >
          <HiSearch className="w-5 h-5" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 py-3.5 bg-transparent text-[#242424] placeholder-[#AFAFAF] focus:outline-none text-sm sm:text-base"
        />

        <div className="flex items-center gap-2 pl-3">
          {localValue && (
            <button
              onClick={handleClear}
              className="p-1.5 text-[#AFAFAF] hover:text-[#656565] hover:bg-[#F5F5F5] rounded-lg transition-all duration-200"
              type="button"
            >
              <HiX className="w-4 h-4" />
            </button>
          )}

          {!localValue && (
            <div className="hidden sm:flex items-center gap-1 text-xs text-[#AFAFAF]">
              <kbd className="px-2 py-1 bg-[#F5F5F5] rounded-md font-mono text-[#898989]">
                ESC
              </kbd>
            </div>
          )}
        </div>
      </div>

      {isSearching && (
        <div className="absolute left-14 top-1/2 -translate-y-1/2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-[#A72F3B] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )}
    </div>
  );
}
