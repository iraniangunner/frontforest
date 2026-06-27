// app/_components/posts/LatestPostsSidebar.tsx  ← SERVER COMPONENT
import Link from "next/link";
import Image from "next/image";
import { HiEye } from "react-icons/hi";

interface SidebarPost {
  id: number;
  title: string;
  slug: string;
  thumbnail: string | null;
  category_label?: string;
  published_at: string | null;
  views: number;
}

const fmtDate = (d: string | null) =>
  d
    ? new Date(d).toLocaleDateString("fa-IR", { month: "long", day: "numeric" })
    : "";

async function getLatest(excludeSlug: string): Promise<SidebarPost[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts?per_page=6&sort=newest`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return [];
    const json = await res.json();
    const posts: SidebarPost[] = json?.data ?? [];
    // مقاله‌ی فعلی را از لیست حذف کن و حداکثر ۵ تا نشان بده
    return posts.filter((p) => p.slug !== excludeSlug).slice(0, 5);
  } catch {
    return [];
  }
}

export default async function LatestPostsSidebar({
  currentSlug,
}: {
  currentSlug: string;
}) {
  const posts = await getLatest(currentSlug);

  if (!posts.length) return null;

  return (
    <aside className="lg:sticky lg:top-6" dir="rtl">
      <div className="bg-white rounded-2xl border border-[#F0F0F0] overflow-hidden">
        {/* سرتیتر */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-[#F0F0F0]">
          <span className="w-1 h-5 bg-[#A72F3B] rounded-full" />
          <h2 className="text-sm font-bold text-[#242424]">آخرین مقالات</h2>
        </div>

        {/* لیست */}
        <div className="divide-y divide-[#F5F5F5]">
          {posts.map((p) => (
            <Link
              key={p.id}
              href={`/posts/${p.slug}`}
              className="group flex gap-3 p-4 hover:bg-[#FCF8F8] transition-colors"
            >
              {/* تصویر کوچک */}
              <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-[#F5F5F5]">
                {p.thumbnail ? (
                  <Image
                    src={p.thumbnail}
                    alt={p.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#F6EAEB] to-[#EDD5D8]" />
                )}
              </div>

              {/* متن */}
              <div className="flex-1 min-w-0">
                {p.category_label && (
                  <span className="text-[11px] font-bold text-[#A72F3B]">
                    {p.category_label}
                  </span>
                )}
                <h3 className="text-[13px] font-semibold text-[#242424] leading-snug line-clamp-2 group-hover:text-[#A72F3B] transition-colors">
                  {p.title}
                </h3>
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#AFAFAF]">
                  <span>{fmtDate(p.published_at)}</span>
                  <span className="flex items-center gap-0.5">
                    <HiEye className="w-3 h-3" />
                    {p.views.toLocaleString("fa-IR")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* فوتر */}
        <Link
          href="/posts"
          className="group flex items-center justify-center gap-1.5 px-5 py-3.5 text-[13px] font-medium text-[#A72F3B] bg-[#F6EAEB]/40 hover:bg-[#F6EAEB] transition-colors border-t border-[#F0F0F0]"
        >
          مشاهده همه‌ی مقالات
          <svg
            className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
      </div>
    </aside>
  );
}
