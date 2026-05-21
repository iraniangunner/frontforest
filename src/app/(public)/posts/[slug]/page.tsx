"use client";

// app/(public)/posts/[slug]/page.tsx
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { postsAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  HiArrowRight,
  HiEye,
  HiCalendar,
  HiChat,
  HiCheckCircle,
} from "react-icons/hi";
import toast from "react-hot-toast";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  thumbnail: string | null;
  views: number;
  published_at: string | null;
  author: { id: number; name: string };
}

interface Reply {
  id: number;
  body: string;
  created_at: string;
  user: { id: number; name: string };
}

interface Comment {
  id: number;
  body: string;
  created_at: string;
  user: { id: number; name: string };
  replies: Reply[];
}

const fmtDate = (d: string | null) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const fmtDateTime = (d: string) =>
  new Date(d).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// ── Comment Item ──
function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="space-y-3">
      {/* نظر کاربر */}
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-sm font-bold flex-shrink-0 mt-1">
          {comment.user.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="bg-gray-50 rounded-2xl rounded-tr-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-900">
                {comment.user.name}
              </p>
              <p className="text-xs text-gray-400">
                {fmtDateTime(comment.created_at)}
              </p>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {comment.body}
            </p>
          </div>
        </div>
      </div>

      {/* پاسخ ادمین */}
      {comment.replies.map((reply) => (
        <div key={reply.id} className="flex gap-3 mr-12">
          <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
            {reply.user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="bg-teal-50 rounded-2xl rounded-tr-sm p-3.5 border border-teal-100">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <p className="text-xs font-semibold text-teal-800">
                  {reply.user.name}
                </p>
                <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                  پاسخ تیم پشتیبانی
                </span>
                <p className="text-xs text-gray-400 mr-auto">
                  {fmtDateTime(reply.created_at)}
                </p>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {reply.body}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Page ──
export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (slug) {
      loadPost();
      loadComments();
    }
  }, [slug]);

  const loadPost = async () => {
    try {
      const res = await postsAPI.getOne(slug);
      setPost(res.data.data);
    } catch (err: any) {
      if (err.response?.status === 404) router.push("/posts");
      else toast.error("خطا در دریافت مقاله");
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const res = await postsAPI.getComments(slug);
      setComments(res.data.data);
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    try {
      await postsAPI.addComment(slug, { body: body.trim() });
      setBody("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "خطا در ثبت نظر");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );

  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Hero */}
      <div
        className={`relative overflow-hidden ${post.thumbnail ? "h-72 sm:h-96" : "h-48 bg-gradient-to-br from-teal-600 to-teal-800"}`}
      >
        {post.thumbnail && (
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* breadcrumb روی hero */}
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
                {post.title}
              </span>
            </div>
          </div>
        </div>

        {/* عنوان روی hero */}
        <div className="absolute bottom-0 right-0 left-0">
          <div className="max-w-3xl mx-auto px-4 pb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-relaxed">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* meta bar */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 py-4 mb-6 border-b border-gray-200">
          <span className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xs font-bold">
              {post.author.name.charAt(0)}
            </div>
            {post.author.name}
          </span>
          <span className="flex items-center gap-1.5">
            <HiCalendar className="w-4 h-4 text-gray-400" />
            {fmtDate(post.published_at)}
          </span>
          <span className="flex items-center gap-1.5">
            <HiEye className="w-4 h-4 text-gray-400" />
            {post.views.toLocaleString("fa-IR")} بازدید
          </span>
          <span className="flex items-center gap-1.5">
            <HiChat className="w-4 h-4 text-gray-400" />
            {comments.length.toLocaleString("fa-IR")} نظر
          </span>
        </div>

        {/* خلاصه */}
        {post.excerpt && (
          <p className="text-gray-600 text-lg leading-relaxed mb-8 pb-8 border-b border-gray-200 font-medium">
            {post.excerpt}
          </p>
        )}

        {/* بدنه مقاله */}
        <div
          className="text-gray-700 text-base leading-loose mb-10
            [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-gray-900 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-gray-200
            [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-gray-900
            [&_p]:mb-4 [&_p]:leading-loose
            [&_ul]:list-disc [&_ul]:pr-6 [&_ul]:mb-4 [&_ul]:space-y-1
            [&_ol]:list-decimal [&_ol]:pr-6 [&_ol]:mb-4 [&_ol]:space-y-1
            [&_li]:leading-relaxed
            [&_a]:text-teal-600 [&_a]:underline [&_a:hover]:text-teal-700
            [&_strong]:font-bold [&_strong]:text-gray-900
            [&_em]:italic
            [&_u]:underline
            [&_s]:line-through
            [&_blockquote]:border-r-4 [&_blockquote]:border-teal-400 [&_blockquote]:pr-5 [&_blockquote]:py-1 [&_blockquote]:text-gray-600 [&_blockquote]:my-6 [&_blockquote]:italic [&_blockquote]:bg-teal-50 [&_blockquote]:rounded-l-xl
            [&_hr]:border-gray-200 [&_hr]:my-8"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />

        {/* ── نظرات ── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
              <HiChat className="w-5 h-5 text-teal-500" />
              نظرات
            </h2>
            <span className="px-2.5 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full">
              {comments.length.toLocaleString("fa-IR")} نظر
            </span>
          </div>

          {/* لیست */}
          <div className="p-6 space-y-6">
            {comments.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-4xl mb-3">💬</p>
                <p className="text-gray-500 text-sm">
                  هنوز نظری ثبت نشده — اولین نفر باشید!
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))
            )}
          </div>

          {/* فرم */}
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-teal-500 rounded-full inline-block" />
              ثبت نظر
            </h3>

            {submitted && (
              <div className="flex items-center gap-2 p-3.5 bg-green-50 rounded-xl mb-4 border border-green-200">
                <HiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="text-sm text-green-700 font-medium">
                  نظر شما ثبت شد و پس از تایید نمایش داده میشه.
                </p>
              </div>
            )}

            {user ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* نام کاربر */}
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-sm font-bold">
                    {user.name?.charAt(0)}
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    {user.name}
                  </p>
                </div>

                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="نظر خود را بنویسید..."
                  rows={4}
                  maxLength={1000}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition resize-none bg-white"
                  required
                />

                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">{body.length}/1000</p>
                  <button
                    type="submit"
                    disabled={submitting || !body.trim()}
                    className="px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 disabled:opacity-50 transition shadow-sm"
                  >
                    {submitting ? "در حال ثبت..." : "ثبت نظر"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8 bg-white rounded-xl border border-gray-200">
                <p className="text-gray-500 text-sm mb-4">
                  برای ثبت نظر باید وارد شوید
                </p>
                <Link
                  href="/login"
                  className="inline-block px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition shadow-sm"
                >
                  ورود به حساب
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* برگشت */}
        <div className="mt-8">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600 transition group"
          >
            <HiArrowRight className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            بازگشت به اخبار
          </Link>
        </div>
      </div>
    </div>
  );
}
