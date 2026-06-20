// app/(public)/_components/home/BlogSection.tsx

import Link from "next/link";
import { SwiperCarousel } from "../ui/SwiperCarousel";

const API = process.env.NEXT_PUBLIC_API_URL;

async function getPosts() {
  const res = await fetch(`${API}/posts?per_page=5&sort=newest`, {
    next: { revalidate: 60 },
  });

  return res.json();
}

export default async function BlogSection() {
  const data = await getPosts();
  const posts = data?.data ?? [];

  if (!posts.length) return null;

  return (
    <section dir="rtl" className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <span className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-600 to-purple-400 flex-shrink-0" />
            <h2 className="text-[17px] font-bold text-gray-900">
              آخرین مقالات
            </h2>
          </div>
          <Link
            href="/posts"
            className="text-[13px] font-semibold text-violet-600 hover:opacity-70 transition-opacity"
          >
            همه مقالات ←
          </Link>
        </div>

        <SwiperCarousel products={posts}/>
      </div>
    </section>
  );
}
