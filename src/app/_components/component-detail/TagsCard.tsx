import Link from "next/link";
import { Component } from "@/types";

interface TagsCardProps {
  component: Component;
}

export function TagsCard({ component }: TagsCardProps) {
  if (!component.tags || component.tags.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">تگ‌ها</h3>
      <div className="flex flex-wrap gap-2">
        {component.tags.map((tag) => (
          <Link
            key={tag.id}
            href={`/components?${
              tag.type === "framework"
                ? "frameworks"
                : tag.type === "styling"
                ? "stylings"
                : "features"
            }[]=${tag.slug}`}
            className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors hover:opacity-80"
            style={{
              backgroundColor: `${tag.color}20`,
              color: tag.color,
            }}
          >
            {tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
}