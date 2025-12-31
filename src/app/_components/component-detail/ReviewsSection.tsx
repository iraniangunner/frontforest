"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiStar } from "react-icons/hi";
import { publicComponentsAPI } from "@/lib/api";
import toast from "react-hot-toast";

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  user: { id: number; name: string };
  created_at: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
  componentSlug: string;
  onReviewAdded: () => void;
}

export function ReviewsSection({
  reviews,
  componentSlug,
  onReviewAdded,
}: ReviewsSectionProps) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating < 1 || rating > 5) {
      toast.error("لطفاً امتیاز را انتخاب کنید");
      return;
    }

    setSubmitting(true);

    try {
      await publicComponentsAPI.addReview(componentSlug, {
        rating,
        comment: comment.trim() || undefined,
      });

      toast.success("نظر شما ثبت شد و پس از تایید نمایش داده می‌شود");
      setComment("");
      setRating(5);
      onReviewAdded();
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("برای ثبت نظر ابتدا وارد شوید");
        router.push("/login");
      } else if (error.response?.status === 403) {
        toast.error("برای ثبت نظر ابتدا این کامپوننت را خریداری کنید");
      } else if (error.response?.status === 409) {
        toast.error("شما قبلاً برای این کامپوننت نظر ثبت کرده‌اید");
      } else if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)?.[0];
        toast.error(Array.isArray(firstError) ? firstError[0] : "خطا در اعتبارسنجی");
      } else {
        toast.error(error.response?.data?.message || "خطا در ثبت نظر");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR");
  };

  return (
    <div className="space-y-6">
      {/* Review Form */}
      <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-4">
        <h4 className="font-medium text-gray-900 mb-4">ثبت نظر</h4>

        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-4">
          <span className="text-sm text-gray-500 ml-2">امتیاز:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1"
            >
              <HiStar
                className={`w-6 h-6 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
          <span className="text-sm text-gray-500 mr-2">({rating} از 5)</span>
        </div>

        {/* Comment */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="نظر خود را بنویسید... (اختیاری)"
          rows={3}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />

        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-gray-400">
            نظر شما پس از تایید مدیر نمایش داده می‌شود
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {submitting ? "در حال ارسال..." : "ثبت نظر"}
          </button>
        </div>
      </form>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-100 pb-4 last:border-0"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {review.user.name?.charAt(0) || "؟"}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {review.user.name || "کاربر"}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <HiStar
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">
                      {formatDate(review.created_at)}
                    </span>
                  </div>
                </div>
              </div>
              {review.comment && (
                <p className="text-gray-600 mr-13">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>هنوز نظری ثبت نشده است.</p>
          <p className="text-sm mt-1">اولین نفر باشید که نظر می‌دهد!</p>
        </div>
      )}
    </div>
  );
}