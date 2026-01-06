// app/components/[slug]/component-detail/ComponentTags.tsx

"use client";

import Link from "next/link";
import { HiTag } from "react-icons/hi";

interface Tag {
  id: number;
  name: string;
  slug: string;
  color: string;
  type?: string;
}

interface ComponentTagsProps {
  tags?: Tag[];
}

export function ComponentTags({ tags }: ComponentTagsProps) {
  // Don't render if no tags
  if (!tags || tags.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <HiTag className="w-5 h-5 text-gray-400" />
        <h3 className="text-lg font-bold text-gray-900">تگ‌ها</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag.id}
            href={`/components?${tag.type}s[]=${tag.slug}`}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 hover:shadow-md"
            style={{
              backgroundColor: `${tag.color}15`,
              color: tag.color,
              borderWidth: "1px",
              borderColor: `${tag.color}30`,
            }}
          >
            {tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
}