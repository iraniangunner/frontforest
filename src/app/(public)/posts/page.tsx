"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { postsAPI } from "@/lib/api";
import { HiEye, HiSearch } from "react-icons/hi";
import Pagination from "@/app/_components/ui/Pagination";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnail: string | null;
  category: string;
  category_label: string;
  views: number;
  published_at: string | null;
  author: { id: number; name: string };
}

const CATS = [
  { key: "all", label: "همه" },
  { key: "news", label: "اخبار" },
  { key: "article", label: "مقاله" },
  { key: "product", label: "معرفی محصول" },
  { key: "tutorial", label: "آموزش" },
];

const fmtDate = (d: string | null) =>
  d
    ? new Date(d).toLocaleDateString("fa-IR", { month: "long", day: "numeric" })
    : "";

// ── Hero Post ──
function HeroPost({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          {post.thumbnail
            ? <Image src={post.thumbnail} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
            : <div className="w-full h-full bg-gradient-to-br from-teal-100 to-teal-200" />}
        </div>
        <div className="p-8 flex flex-col justify-center gap-4">
          <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
            {post.category_label}
          </span>
          <h2 className="text-2xl font-extrabold text-gray-900 leading-tight line-clamp-3 group-hover:text-teal-600 transition-colors">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-gray-400 pt-2 border-t border-gray-100">
            <span>{post.author.name}</span>
            <span>·</span>
            <span>{fmtDate(post.published_at)}</span>
            <span className="mr-auto flex items-center gap-1">
              <HiEye className="w-3.5 h-3.5" />{post.views.toLocaleString("fa-IR")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Regular Card ──
function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        {post.thumbnail
          ? <Image src={post.thumbnail} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />}
      </div>
      <div className="p-5 flex flex-col flex-1 gap-2">
        <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
          {post.category_label}
        </span>
        <h3 className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-teal-600 transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 flex-1">{post.excerpt}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-400 pt-3 border-t border-gray-50 mt-auto">
          <span>{post.author.name}</span>
          <span>·</span>
          <span>{fmtDate(post.published_at)}</span>
          <span className="mr-auto flex items-center gap-1">
            <HiEye className="w-3.5 h-3.5" />{post.views.toLocaleString("fa-IR")}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Skeleton ──
function Skeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="aspect-[16/10] bg-gray-100 rounded-xl" />
      <div className="h-3 bg-gray-100 rounded w-1/4" />
      <div className="h-4 bg-gray-100 rounded" />
      <div className="h-4 bg-gray-100 rounded w-3/4" />
    </div>
  );
}

// ── Content ──
function PostsContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

  useEffect(() => {
    load();
  }, [meta.current_page, category]);

  const load = async (q?: string) => {
    setLoading(true);
    try {
      const res = await postsAPI.getAll({
        page: meta.current_page,
        per_page: 10,
        search: (q ?? search).trim() || undefined,
        category: category !== "all" ? category : undefined,
      });
      setPosts(res.data.data);
      setMeta((p) => ({
        ...p,
        current_page: res.data.meta.current_page,
        last_page: res.data.meta.last_page,
        total: res.data.meta.total,
      }));
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const hero = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* هدر */}
      <div className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          {/* عنوان */}
          <div className="flex items-center justify-between py-8">
            <h1 className="text-2xl font-extrabold text-gray-900">
              اخبار و مقالات
            </h1>
            <div className="relative">
              <HiSearch className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setMeta((p) => ({ ...p, current_page: 1 }));
                    load(search);
                  }
                }}
                placeholder="جستجو..."
                className="pr-9 pl-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 w-48"
              />
            </div>
          </div>

          {/* تب دسته‌بندی */}
          <div className="flex items-center gap-1 overflow-x-auto pb-px">
            {CATS.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  setCategory(cat.key);
                  setMeta((p) => ({ ...p, current_page: 1 }));
                }}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  category === cat.key
                    ? "border-teal-600 text-teal-600"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {loading ? (
          <div className="space-y-16">
            {/* hero skeleton */}
            <div className="grid grid-cols-2 gap-8">
              <div className="animate-pulse aspect-[16/10] bg-gray-100 rounded-2xl" />
              <div className="space-y-4 py-4">
                <div className="h-3 bg-gray-100 rounded w-1/4" />
                <div className="h-8 bg-gray-100 rounded" />
                <div className="h-8 bg-gray-100 rounded w-4/5" />
                <div className="h-4 bg-gray-100 rounded" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} />
              ))}
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-300 text-5xl mb-4">○</p>
            <p className="text-gray-500">مطلبی یافت نشد</p>
            {(search || category !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                  setMeta((p) => ({ ...p, current_page: 1 }));
                  load("");
                }}
                className="text-teal-600 text-sm mt-3 hover:underline block mx-auto"
              >
                پاک کردن فیلتر
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-16">
            {/* Hero */}
            {meta.current_page === 1 && hero && (
              <>
                <HeroPost post={hero} />
                {rest.length > 0 && <hr className="border-gray-100" />}
              </>
            )}

            {/* گرید */}
            {(meta.current_page === 1 ? rest : posts).length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {(meta.current_page === 1 ? rest : posts).map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
              </div>
            )}

            <Pagination
              currentPage={meta.current_page}
              lastPage={meta.last_page}
              onPageChange={(page) =>
                setMeta((p) => ({ ...p, current_page: page }))
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function PostsPage() {
  return (
    <Suspense>
      <PostsContent />
    </Suspense>
  );
}
