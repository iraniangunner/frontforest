"use client";

import { useState } from "react";
import { HiStar } from "react-icons/hi";
import toast from "react-hot-toast";
import { publicProductsAPI } from "@/lib/api";
import { Review } from "@/types";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface ReviewsTabProps {
  slug: string;
  reviews: Review[];
  reviewsCount: number;
  rating: number;
}

function StarRating({
  rating,
  interactive = false,
  onChange,
}: {
  rating: number;
  interactive?: boolean;
  onChange?: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type={interactive ? "button" : undefined}
          disabled={!interactive}
          onClick={() => onChange?.(i)}
          onMouseEnter={() => interactive && setHovered(i)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <HiStar
            className={`w-5 h-5 transition-colors ${
              i <= (hovered || rating) ? "text-yellow-400" : "text-gray-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewsTab({
  slug,
  reviews: initialReviews,
  reviewsCount,
  rating,
}: ReviewsTabProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ rating: 5, comment: "" });

  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.comment.trim()) return;
    setSubmitting(true);
    try {
      const res = await publicProductsAPI.addReview(slug, form);
      toast.success("نظر شما ثبت شد و پس از تایید نمایش داده می‌شود");
      setShowForm(false);
      setForm({ rating: 5, comment: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "خطا در ثبت نظر");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* خلاصه امتیاز */}
      <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
        <div className="text-center">
          <p className="text-4xl font-bold text-gray-900">{rating}</p>
          <StarRating rating={rating} />
          <p className="text-xs text-gray-500 mt-1">{reviewsCount} نظر</p>
        </div>
        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            const percent = reviews.length ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-500 w-4">{star}</span>
                <HiStar className="w-3 h-3 text-yellow-400" />
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-6">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* دکمه ثبت نظر */}
      {!showForm &&
        (user ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-blue-300 hover:text-blue-600 transition text-sm"
          >
            + نظر خود را بنویسید
          </button>
        ) : (
          <div className="text-center py-5 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-gray-500 text-sm mb-3">
              برای ثبت نظر باید وارد شوید
            </p>
            <Link
              href="/login"
              className="inline-block px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition"
            >
              ورود به حساب
            </Link>
          </div>
        ))}

      {/* فرم نظر */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="border border-blue-100 bg-blue-50/30 rounded-xl p-4 space-y-3"
        >
          <p className="font-medium text-gray-800 text-sm">ثبت نظر جدید</p>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">امتیاز</label>
            <StarRating
              rating={form.rating}
              interactive
              onChange={(r) => setForm({ ...form, rating: r })}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">نظر شما</label>
            <textarea
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              rows={3}
              required
              placeholder="تجربه خود را بنویسید..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
            >
              {submitting ? "در حال ارسال..." : "ثبت نظر"}
            </button>
          </div>
        </form>
      )}

      {/* لیست نظرات */}
      {reviews.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          هنوز نظری ثبت نشده است.
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border border-gray-100 rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                    {review.user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-800">
                      {review.user.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(review.created_at).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>

              <p className="text-gray-700 text-sm leading-relaxed">
                {review.comment}
              </p>

              {/* پاسخ ادمین */}
              {review.admin_reply && (
                <div className="mt-3 mr-4 p-3 bg-gray-50 rounded-lg border-r-2 border-blue-400">
                  <p className="text-xs font-medium text-blue-600 mb-1">
                    پاسخ فروشگاه
                  </p>
                  <p className="text-sm text-gray-700">{review.admin_reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
