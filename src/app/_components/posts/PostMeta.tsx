"use client";

// app/(public)/posts/[slug]/PostMeta.tsx
import { HiEye, HiCalendar, HiChat } from "react-icons/hi";

interface Props {
  author: { id: number; name: string };
  publishedAt: string | null;
  views: number;
  commentsCount: number;
}

const fmtDate = (d: string | null) =>
  d
    ? new Date(d).toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

export default function PostMeta({
  author,
  publishedAt,
  views,
  commentsCount,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-[#656565] py-4 mb-6 border-b border-[#F0F0F0]">
      <span className="flex items-center gap-1.5">
        <div className="w-6 h-6 rounded-full bg-[#F6EAEB] flex items-center justify-center text-[#A72F3B] text-xs font-bold">
          {author?.name?.charAt(0) || "ا"}
        </div>
        {author?.name || "ادمین"}
      </span>
      <span className="flex items-center gap-1.5">
        <HiCalendar className="w-4 h-4 text-[#AFAFAF]" />
        {fmtDate(publishedAt)}
      </span>
      <span className="flex items-center gap-1.5">
        <HiEye className="w-4 h-4 text-[#AFAFAF]" />
        {views.toLocaleString("fa-IR")} بازدید
      </span>
      <span className="flex items-center gap-1.5">
        <HiChat className="w-4 h-4 text-[#AFAFAF]" />
        {commentsCount.toLocaleString("fa-IR")} نظر
      </span>
    </div>
  );
}
