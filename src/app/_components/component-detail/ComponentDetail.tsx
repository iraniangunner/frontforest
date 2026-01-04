// app/components/[slug]/ComponentDetail.tsx

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Component } from "@/types";

// Import all sub-components
import { Breadcrumb } from "./Breadcrumb";
import { ResponsivePreview } from "./ResponsivePerview";
import { ContentTabs } from "./ContentTabs";
import { ComponentTags } from "./ComponentTags";
import { ComponentSidebar } from "./ComponentSidebar";
import { FileInfo } from "./FileInfo";
import { Features } from "./Features";
import { RelatedComponents } from "./RelatedComponents";

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  user: { id: number; name: string };
  created_at: string;
}

interface Props {
  component: Component;
  relatedComponents: Component[];
  reviews?: Review[];
}

export default function ComponentDetail({
  component,
  relatedComponents,
  reviews = [],
}: Props) {
  const router = useRouter();
  const [componentReviews, setComponentReviews] = useState<Review[]>(reviews);

  // Get all images (thumbnail + additional images)
  const allImages = [component.thumbnail, ...(component.images || [])].filter(
    Boolean
  ) as string[];

  // Callback when review is added - refresh the page to get updated reviews
  const handleReviewAdded = useCallback(() => {
    router.refresh();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        categoryName={component.category.name}
        categorySlug={component.category.slug}
        componentTitle={component.title}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Preview & Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Responsive Preview with Fullscreen Mode */}
            <ResponsivePreview
              previewUrl={component.preview_url}
              thumbnail={component.thumbnail}
              title={component.title}
              slug={component.slug}
            />

            {/* Description & Reviews Tabs */}
            <ContentTabs
              description={component.description}
              shortDescription={component.short_description}
              reviews={componentReviews}
              reviewsCount={component.reviews_count || 0}
              componentSlug={component.slug}
              onReviewAdded={handleReviewAdded}
            />

            {/* Tags */}
            <ComponentTags tags={component.tags} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Main Info & Actions Card */}
              <ComponentSidebar component={component} />

              {/* File Information */}
              <FileInfo
                fileSizeFormatted={component.file_size_formatted}
                tags={component.tags}
              />

              {/* Features List */}
              <Features />
            </div>
          </div>
        </div>

        {/* Related Components Section */}
        <RelatedComponents
          components={relatedComponents}
          categorySlug={component.category.slug}
        />
      </div>
    </div>
  );
}
