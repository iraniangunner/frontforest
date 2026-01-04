// app/components/[slug]/component-detail/ContentTabs.tsx

"use client";

import { useState } from "react";
import { HiDocumentText, HiChatAlt2 } from "react-icons/hi";
import { ReviewsSection } from "./ReviewsSection";

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  user: { id: number; name: string };
  created_at: string;
}

interface ContentTabsProps {
  description?: string | null;
  shortDescription?: string | null;
  reviews: Review[];
  reviewsCount: number;
  componentSlug: string;
  onReviewAdded: () => void;
}

export function ContentTabs({
  description,
  shortDescription,
  reviews,
  reviewsCount,
  componentSlug,
  onReviewAdded,
}: ContentTabsProps) {
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("description")}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-all ${
            activeTab === "description"
              ? "text-teal-600 border-b-2 border-teal-600 bg-teal-50/50"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          <HiDocumentText className="w-5 h-5" />
          <span>توضیحات</span>
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium transition-all ${
            activeTab === "reviews"
              ? "text-teal-600 border-b-2 border-teal-600 bg-teal-50/50"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          <HiChatAlt2 className="w-5 h-5" />
          <span>نظرات</span>
          {reviewsCount > 0 && (
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              activeTab === "reviews" 
                ? "bg-teal-100 text-teal-700" 
                : "bg-gray-100 text-gray-600"
            }`}>
              {reviewsCount}
            </span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "description" ? (
          <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-teal-600 prose-strong:text-gray-900">
            {description ? (
              <div dangerouslySetInnerHTML={{ __html: description }} />
            ) : shortDescription ? (
              <p className="text-gray-600 leading-relaxed">{shortDescription}</p>
            ) : (
              <div className="text-center py-8">
                <HiDocumentText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">توضیحاتی برای این کامپوننت ثبت نشده است.</p>
              </div>
            )}
          </div>
        ) : (
          <ReviewsSection
            reviews={reviews}
            componentSlug={componentSlug}
            onReviewAdded={onReviewAdded}
          />
        )}
      </div>
    </div>
  );
}