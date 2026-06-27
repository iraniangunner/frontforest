"use client";

// app/(public)/posts/PostsCard.tsx
import Link from "next/link";
import Image from "next/image";
import { HiEye } from "react-icons/hi";
import type { Post } from "@/types";

const fmtDate = (d: string | null) =>
  d
    ? new Date(d).toLocaleDateString("fa-IR", { month: "long", day: "numeric" })
    : "";

export default function PostsCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#F0F0F0] hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#F5F5F5]">
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#F6EAEB] to-[#EDD5D8]" />
        )}
      </div>
      <div className="p-5 flex flex-col flex-1 gap-2">
        <span className="text-xs font-bold text-[#A72F3B] uppercase tracking-wider">
          {post.category_label}
        </span>
        <h3 className="font-bold text-[#242424] leading-snug line-clamp-2 group-hover:text-[#A72F3B] transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-[#AFAFAF] text-sm leading-relaxed line-clamp-2 flex-1">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs text-[#AFAFAF] pt-3 border-t border-[#F5F5F5] mt-auto">
          <span>{post.author?.name || "ادمین"}</span>
          <span>·</span>
          <span>{fmtDate(post.published_at)}</span>
          <span className="mr-auto flex items-center gap-1">
            <HiEye className="w-3.5 h-3.5" />
            {post.views.toLocaleString("fa-IR")}
          </span>
        </div>
      </div>
    </Link>
  );
}
