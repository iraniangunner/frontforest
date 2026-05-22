"use client";

// app/(public)/posts/[slug]/PostHero.tsx
import Link from "next/link";
import Image from "next/image";

interface Props {
  title: string;
  thumbnail: string | null;
}

export default function PostHero({ title, thumbnail }: Props) {
  return (
    <div
      className={`relative overflow-hidden ${thumbnail ? "h-72 sm:h-96" : "h-48 bg-gradient-to-br from-teal-600 to-teal-800"}`}
    >
      {thumbnail && (
        <Image src={thumbnail} alt={title} fill className="object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      <div className="absolute top-6 right-0 left-0">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-white/80">
            <Link href="/" className="hover:text-white transition">
              خانه
            </Link>
            <span>/</span>
            <Link href="/posts" className="hover:text-white transition">
              اخبار
            </Link>
            <span>/</span>
            <span className="text-white/60 truncate max-w-[200px]">
              {title}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 left-0">
        <div className="max-w-3xl mx-auto px-4 pb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-relaxed">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
}
