"use client";

interface ComponentCardSkeletonProps {
  view?: "grid" | "list";
}

export default function ComponentCardSkeleton({
  view = "grid",
}: ComponentCardSkeletonProps) {
  if (view === "grid") {
    return (
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200 animate-pulse">
        {/* Image Skeleton */}
        <div className="relative aspect-[16/10] bg-gray-200">
          {/* Badge Skeleton */}
          <div className="absolute top-2 right-2">
            <div className="w-14 h-5 bg-gray-300 rounded" />
          </div>
          {/* Favorite Button Skeleton */}
          <div className="absolute top-2 left-2">
            <div className="w-8 h-8 bg-gray-300 rounded-lg" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="p-3">
          {/* Title Skeleton */}
          <div className="h-4 bg-gray-200 rounded mb-2 w-full" />
          <div className="h-4 bg-gray-200 rounded mb-3 w-2/3" />

          {/* Bottom Row Skeleton */}
          <div className="flex items-center justify-between gap-2">
            {/* Rating Skeleton */}
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-200 rounded" />
              <div className="w-8 h-4 bg-gray-200 rounded" />
            </div>

            {/* Price & Action Skeleton */}
            <div className="flex items-center gap-2">
              <div className="w-20 h-4 bg-gray-200 rounded" />
              <div className="w-8 h-8 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== LIST VIEW SKELETON ====================
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 animate-pulse">
      <div className="flex flex-col sm:flex-row">
        {/* Image Skeleton */}
        <div className="relative sm:w-48 h-32 sm:h-auto bg-gray-200 flex-shrink-0">
          {/* Badge Skeleton */}
          <div className="absolute top-2 right-2">
            <div className="w-14 h-5 bg-gray-300 rounded" />
          </div>
          {/* Favorite Skeleton */}
          <div className="absolute top-2 left-2">
            <div className="w-8 h-8 bg-gray-300 rounded-lg" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 p-3 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Category Skeleton */}
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2 h-2 bg-gray-200 rounded-full" />
              <div className="w-16 h-3 bg-gray-200 rounded" />
            </div>

            {/* Title Skeleton */}
            <div className="h-5 bg-gray-200 rounded mb-2 w-3/4" />

            {/* Rating & Stats Skeleton */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-gray-200 rounded" />
                <div className="w-8 h-3 bg-gray-200 rounded" />
              </div>
              <div className="w-1 h-1 bg-gray-200 rounded-full" />
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-gray-200 rounded" />
                <div className="w-8 h-3 bg-gray-200 rounded" />
              </div>
            </div>
          </div>

          {/* Price & Action Skeleton */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <div className="w-24 h-5 bg-gray-200 rounded mb-1" />
              <div className="w-16 h-3 bg-gray-200 rounded" />
            </div>
            <div className="w-9 h-9 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Multiple skeletons for grid/list loading
interface ComponentCardSkeletonListProps {
  count?: number;
  view?: "grid" | "list";
}

export function ComponentCardSkeletonList({
  count = 6,
  view = "grid",
}: ComponentCardSkeletonListProps) {
  return (
    <div
      className={
        view === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
          : "space-y-4"
      }
    >
      {[...Array(count)].map((_, index) => (
        <ComponentCardSkeleton key={index} view={view} />
      ))}
    </div>
  );
}

// Full grid section skeleton (results count + grid + pagination)
interface ComponentsGridSkeletonProps {
  count?: number;
  view?: "grid" | "list";
}

export function ComponentsGridSkeleton({
  count = 12,
  view = "grid",
}: ComponentsGridSkeletonProps) {
  return (
    <div className="animate-pulse">
      {/* Results Count Skeleton */}
      <div className="mb-4">
        <div className="h-5 bg-gray-200 rounded w-28" />
      </div>

      {/* Grid Skeleton */}
      <div
        className={
          view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
            : "space-y-4"
        }
      >
        {[...Array(count)].map((_, index) => (
          <ComponentCardSkeleton key={index} view={view} />
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="mt-8 flex flex-col items-center gap-4">
        <div className="h-5 bg-gray-200 rounded w-32" />
        <div className="flex items-center gap-1 p-1.5 bg-white rounded-2xl border border-gray-200">
          <div className="w-16 h-10 bg-gray-100 rounded-xl" />
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-10 h-10 bg-gray-100 rounded-xl" />
            ))}
          </div>
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <div className="w-16 h-10 bg-gray-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}