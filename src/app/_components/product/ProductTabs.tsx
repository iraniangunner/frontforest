"use client";

import { useState } from "react";
import { Product, Review } from "@/types";
import AttributesTab from "./AttributesTab";
import ReviewsTab from "./ReviewsTab";

interface ProductTabsProps {
  product: Product;
  reviews: Review[];
}

type Tab = "description" | "attributes" | "reviews";

export default function ProductTabs({ product, reviews }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("description");

  const tabs: { key: Tab; label: string }[] = [
    { key: "description", label: "توضیحات محصول" },
    { key: "attributes", label: "ویژگی های محصول" },
    { key: "reviews", label: `نظرات کاربران(${product.reviews_count})` },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#F0F0F0]">
      {/* هدر تب‌ها */}
      <div className="flex border-b border-[#F0F0F0] overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition ${
              activeTab === tab.key
                ? "border-[#A72F3B] text-[#A72F3B]"
                : "border-transparent text-[#898989] hover:text-[#242424]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* محتوای تب */}
      <div className="p-6">
        {activeTab === "description" &&
          (product.description ? (
            <div
              className="prose prose-sm max-w-none text-[#656565] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          ) : (
            <p className="text-[#898989] text-center py-8">
              توضیحاتی ثبت نشده است.
            </p>
          ))}

        {activeTab === "attributes" && <AttributesTab product={product} />}

        {activeTab === "reviews" && (
          <ReviewsTab
            slug={product.slug}
            reviews={reviews}
            reviewsCount={product.reviews_count}
            rating={product.rating}
          />
        )}
      </div>
    </div>
  );
}
