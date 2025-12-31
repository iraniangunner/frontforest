import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi";
import { Component } from "@/types";

interface BreadcrumbProps {
  component: Component;
}

export function Breadcrumb({ component }: BreadcrumbProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">
            خانه
          </Link>
          <HiChevronLeft className="w-4 h-4" />
          <Link href="/components" className="hover:text-blue-600">
            کامپوننت‌ها
          </Link>
          <HiChevronLeft className="w-4 h-4" />
          {component.category.parent && (
            <>
              <Link
                href={`/components?category=${component.category.parent.slug}`}
                className="hover:text-blue-600"
              >
                {component.category.parent.name}
              </Link>
              <HiChevronLeft className="w-4 h-4" />
            </>
          )}
          <Link
            href={`/components?categories[]=${component.category.slug}`}
            className="hover:text-blue-600"
          >
            {component.category.name}
          </Link>
          <HiChevronLeft className="w-4 h-4" />
          <span className="text-gray-900">{component.title}</span>
        </nav>
      </div>
    </div>
  );
}