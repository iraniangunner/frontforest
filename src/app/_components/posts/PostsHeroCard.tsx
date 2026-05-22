"use client";

// app/(public)/posts/PostsHeroCard.tsx
import Link from "next/link";
import Image from "next/image";
import { HiEye } from "react-icons/hi";
import type { Post } from "@/types";

const fmtDate = (d: string | null) =>
  d
    ? new Date(d).toLocaleDateString("fa-IR", { month: "long", day: "numeric" })
    : "";

export default function PostsHeroCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-teal-100 to-teal-200" />
          )}
        </div>
        <div className="p-8 flex flex-col justify-center gap-4">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
            {post.category_label}
          </span>
          <h2 className="text-2xl font-extrabold text-gray-900 leading-tight line-clamp-3 group-hover:text-teal-600 transition-colors">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-gray-400 pt-2 border-t border-gray-100">
            <span>{post.author.name}</span>
            <span>·</span>
            <span>{fmtDate(post.published_at)}</span>
            <span className="mr-auto flex items-center gap-1">
              <HiEye className="w-3.5 h-3.5" />
              {post.views.toLocaleString("fa-IR")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
