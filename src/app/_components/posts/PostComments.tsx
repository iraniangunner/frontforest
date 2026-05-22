"use client";

// app/(public)/posts/[slug]/PostComments.tsx
import Link from "next/link";
import { useState } from "react";
import { HiChat, HiCheckCircle } from "react-icons/hi";
import { postsAPI } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

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

const fmtDateTime = (d: string) =>
  new Date(d).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="space-y-3">
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

interface Props {
  slug: string;
  comments: Comment[];
}

export default function PostComments({ slug, comments: init }: Props) {
  const { user } = useAuth(); // ← از خودش میگیره
  const [comments, setComments] = useState<Comment[]>(init);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
          <HiChat className="w-5 h-5 text-teal-500" /> نظرات
        </h2>
        <span className="px-2.5 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full">
          {comments.length.toLocaleString("fa-IR")} نظر
        </span>
      </div>

      <div className="p-6 space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-gray-500 text-sm">
              هنوز نظری ثبت نشده — اولین نفر باشید!
            </p>
          </div>
        ) : (
          comments.map((c) => <CommentItem key={c.id} comment={c} />)
        )}
      </div>

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
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-sm font-bold">
                {user.name?.charAt(0)}
              </div>
              <p className="text-sm font-medium text-gray-700">{user.name}</p>
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
  );
}
