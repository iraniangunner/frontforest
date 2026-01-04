// components/[slug]/components/Breadcrumb.tsx

// app/components/[slug]/component-detail/Breadcrumb.tsx

"use client";

import Link from "next/link";
import { HiChevronRight } from "react-icons/hi";

interface BreadcrumbProps {
  categoryName: string;
  categorySlug: string;
  componentTitle: string;
}

export function Breadcrumb({
  categoryName,
  categorySlug,
  componentTitle,
}: BreadcrumbProps) {
  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors">
            خانه
          </Link>
          <HiChevronRight className="w-4 h-4 text-gray-400 rotate-180" />
          <Link href="/components" className="text-gray-500 hover:text-gray-700 transition-colors">
            کامپوننت‌ها
          </Link>
          <HiChevronRight className="w-4 h-4 text-gray-400 rotate-180" />
          <Link
            href={`/components?categories[]=${categorySlug}`}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            {categoryName}
          </Link>
          <HiChevronRight className="w-4 h-4 text-gray-400 rotate-180" />
          <span className="text-gray-900 font-medium truncate max-w-[200px]">
            {componentTitle}
          </span>
        </nav>
      </div>
    </div>
  );
}