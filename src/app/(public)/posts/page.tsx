// app/(public)/posts/page.tsx  ← SERVER COMPONENT
import { Suspense } from "react";
import type { Metadata } from "next";
import { postsAPI } from "@/lib/api";
import Pagination from "@/app/_components/ui/Pagination";
import PostsFilter from "@/app/_components/posts/PostsFilter";
import type { Post } from "@/types";
import PostsHeroCard from "@/app/_components/posts/PostsHeroCard";
import PostsCard from "@/app/_components/posts/PostsCard";

export const metadata: Metadata = {
  title: "اخبار و مقالات | نمایندگی انحصاری فانتوم پلاس در ایران",
  description:
    "آخرین اخبار، مقالات، آموزش‌ها و معرفی محصولات فانتوم پلاس — نمایندگی انحصاری در ایران",
  keywords: "اخبار فانتوم پلاس، مقالات، آموزش، معرفی محصول",
  openGraph: {
    title: "اخبار و مقالات | فانتوم پلاس",
    description: "آخرین اخبار، مقالات، آموزش‌ها و معرفی محصولات فانتوم پلاس",
    type: "website",
    locale: "fa_IR",
  },
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/posts` },
};

// Schema.org JSON-LD
function PostsJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "اخبار و مقالات فانتوم پلاس",
    description: "آخرین اخبار، مقالات، آموزش‌ها و معرفی محصولات فانتوم پلاس",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/posts`,
    publisher: {
      "@type": "Organization",
      name: "نمایندگی انحصاری فانتوم پلاس در ایران",
      url: process.env.NEXT_PUBLIC_SITE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

function HeroSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="grid grid-cols-2">
        <div className="aspect-[16/10] bg-gray-100" />
        <div className="p-8 space-y-4">
          <div className="h-2 bg-gray-100 rounded w-1/4" />
          <div className="h-7 bg-gray-100 rounded" />
          <div className="h-7 bg-gray-100 rounded w-4/5" />
          <div className="h-4 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="aspect-[16/10] bg-gray-100" />
      <div className="p-5 space-y-3">
        <div className="h-2 bg-gray-100 rounded w-1/4" />
        <div className="h-4 bg-gray-100 rounded" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
      <p className="text-gray-400 text-lg mb-2">مطلبی یافت نشد</p>
    </div>
  );
}

export default async function PostsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = sp.page ? +sp.page : 1;
  const category = sp.category || "all";
  const search = sp.search || "";

  const res = await postsAPI.getAll({
    page,
    per_page: 10,
    search: search || undefined,
    category: category !== "all" ? category : undefined,
  });

  const posts: Post[] = res.data.data || [];
  const meta = res.data.meta || { current_page: 1, last_page: 1, total: 0 };

  const hero = posts[0];
  const rest = posts.slice(1);

  return (
    <>
      <PostsJsonLd />
      <div className="min-h-screen bg-gray-50" dir="rtl">
        {/* Filter — client component */}
        <Suspense
          fallback={
            <div className="h-32 bg-white border-b border-gray-100 animate-pulse" />
          }
        >
          <PostsFilter
            currentCategory={category}
            currentSearch={search}
            total={meta.total}
          />
        </Suspense>

        <div className="max-w-5xl mx-auto px-4 py-10">
          {posts.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-6">
              {/* Hero */}
              {page === 1 && hero && (
                <Suspense fallback={<HeroSkeleton />}>
                  <PostsHeroCard post={hero} />
                </Suspense>
              )}

              {page === 1 && rest.length > 0 && (
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">
                    سایر مطالب
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
              )}

              {/* گرید */}
              {(page === 1 ? rest : posts).length > 0 && (
                <Suspense
                  fallback={
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(6)].map((_, i) => (
                        <CardSkeleton key={i} />
                      ))}
                    </div>
                  }
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(page === 1 ? rest : posts).map((p) => (
                      <PostsCard key={p.id} post={p} />
                    ))}
                  </div>
                </Suspense>
              )}

              {/* Pagination */}
              {meta.last_page > 1 && (
                <Suspense>
                  <Pagination
                    currentPage={meta.current_page}
                    lastPage={meta.last_page}
                    basePath="/posts"
                  />
                </Suspense>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
