"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { HiViewGrid } from "react-icons/hi";
import ComponentCard from "./ComponentCard";
import { Component } from "@/types";

interface ComponentsGridProps {
  components: Component[];
}

export default function ComponentsGrid({ components }: ComponentsGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get view from URL, default to grid
  const view = (searchParams.get("view") as "grid" | "list") || "grid";

  const handleClearAllFilters = () => {
    const params = new URLSearchParams();
    const perPage = searchParams.get("per_page");
    if (perPage) params.set("per_page", perPage);

    const queryString = params.toString();
    router.push(queryString ? `/components?${queryString}` : "/components", {
      scroll: false,
    });
  };

  if (components.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <HiViewGrid className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          کامپوننتی یافت نشد
        </h3>
        <p className="text-gray-500 mb-4">
          با فیلترهای انتخاب شده نتیجه‌ای یافت نشد
        </p>
        <button
          onClick={handleClearAllFilters}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          پاک کردن فیلترها
        </button>
      </div>
    );
  }

  return (
    <div
      className={
        view === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
          : "space-y-4"
      }
    >
      {components.map((component) => (
        <ComponentCard key={component.id} component={component} view={view} />
      ))}
    </div>
  );
}