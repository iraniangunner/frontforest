"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  HiStar,
  HiDownload,
  HiEye,
  HiExternalLink,
  HiShoppingCart,
  HiHeart,
  HiOutlineHeart,
  HiChevronRight,
  HiChevronLeft,
  HiX,
  HiCheck,
  HiClock,
  HiDocumentDownload,
  HiCode,
  HiShare,
} from "react-icons/hi";
import { publicComponentsAPI, reviewsAPI } from "../../../lib/api";
import { Component } from "@/types";
import toast from "react-hot-toast";

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  user: { id: number; name: string };
  created_at: string;
}

export default function ComponentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  // State
  const [component, setComponent] = useState<Component | null>(null);
  const [relatedComponents, setRelatedComponents] = useState<Component[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Load data
  useEffect(() => {
    if (slug) {
      loadComponent();
    }
  }, [slug]);

  const loadComponent = async () => {
    setLoading(true);
    try {
      const [componentRes, relatedRes] = await Promise.all([
        publicComponentsAPI.getBySlug(slug),
        publicComponentsAPI.getRelated(slug),
      ]);

      setComponent(componentRes.data.data);
      setRelatedComponents(relatedRes.data.data);
      setSelectedImage(componentRes.data.data.thumbnail);

      // Load reviews
      loadReviews();
    } catch (error) {
      console.error("Error loading component:", error);
      toast.error("خطا در دریافت اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await publicComponentsAPI.getReviews?.(slug) || 
        { data: { data: [] } };
      setReviews(response.data.data);
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  };

  const handleDownload = async () => {
    if (!component) return;

    setDownloading(true);
    try {
      const response = await publicComponentsAPI.download(slug);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${component.slug}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("دانلود شروع شد");
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("برای دانلود ابتدا وارد شوید");
        router.push("/login");
      } else if (error.response?.status === 403) {
        toast.error("برای دانلود ابتدا خریداری کنید");
      } else {
        toast.error("خطا در دانلود فایل");
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: component?.title,
          url: url,
        });
      } catch (error) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("لینک کپی شد");
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "رایگان";
    return price.toLocaleString() + " تومان";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR");
  };

  const getAllImages = () => {
    if (!component) return [];
    const images: string[] = [];
    if (component.thumbnail) images.push(component.thumbnail);
    if (component.images) images.push(...component.images);
    return images;
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    const images = getAllImages();
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = getAllImages();
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not Found
  if (!component) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">یافت نشد</h1>
          <p className="text-gray-500 mb-4">کامپوننت مورد نظر پیدا نشد</p>
          <Link
            href="/components"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            بازگشت به لیست
          </Link>
        </div>
      </div>
    );
  }

  const allImages = getAllImages();

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">
              خانه
            </Link>
            <HiChevronLeft className="w-4 h-4" />
            <Link href="/components" className="hover:text-blue-600">
              کامپوننت‌ها
            </Link>
            <HiChevronLeft className="w-4 h-4" />
            {component.category.parent && (
              <>
                <Link
                  href={`/components?category=${component.category.parent.slug}`}
                  className="hover:text-blue-600"
                >
                  {component.category.parent.name}
                </Link>
                <HiChevronLeft className="w-4 h-4" />
              </>
            )}
            <Link
              href={`/components?categories[]=${component.category.slug}`}
              className="hover:text-blue-600"
            >
              {component.category.name}
            </Link>
            <HiChevronLeft className="w-4 h-4" />
            <span className="text-gray-900">{component.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Image */}
            <div
              className="relative aspect-video bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-zoom-in"
              onClick={() => openLightbox(allImages.indexOf(selectedImage || ""))}
            >
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={component.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">بدون تصویر</span>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {component.is_free && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    رایگان
                  </span>
                )}
                {component.is_on_sale && !component.is_free && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {component.discount_percent}% تخفیف
                  </span>
                )}
                {component.is_new && (
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    جدید
                  </span>
                )}
                {component.is_featured && (
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    ویژه
                  </span>
                )}
              </div>

              {/* Preview Button */}
              {component.preview_url && (
                <a
                  href={component.preview_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:bg-white transition-colors"
                >
                  <HiExternalLink className="w-5 h-5" />
                  پیش‌نمایش زنده
                </a>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImage === image
                        ? "border-blue-600 ring-2 ring-blue-200"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${component.title} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Tab Headers */}
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === "description"
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  توضیحات
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === "reviews"
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  نظرات ({component.reviews_count})
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "description" ? (
                  <div className="prose prose-gray max-w-none">
                    {component.description ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: component.description }}
                      />
                    ) : component.short_description ? (
                      <p>{component.short_description}</p>
                    ) : (
                      <p className="text-gray-500">توضیحاتی ثبت نشده است.</p>
                    )}
                  </div>
                ) : (
                  <ReviewsSection
                    reviews={reviews}
                    componentSlug={slug}
                    onReviewAdded={loadReviews}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Info & Actions */}
          <div className="space-y-6">
            {/* Main Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              {/* Category */}
              <Link
                href={`/components?categories[]=${component.category.slug}`}
                className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white mb-4"
                style={{ backgroundColor: component.category.color }}
              >
                {component.category.name}
              </Link>

              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {component.title}
              </h1>

              {/* Short Description */}
              {component.short_description && (
                <p className="text-gray-600 mb-4">{component.short_description}</p>
              )}

              {/* Rating & Stats */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-1">
                  <HiStar className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium">{component.rating}</span>
                  <span className="text-gray-400">({component.reviews_count} نظر)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <HiEye className="w-5 h-5" />
                  <span>{component.views_count}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <HiDownload className="w-5 h-5" />
                  <span>{component.sales_count}</span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                {component.is_on_sale && !component.is_free && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(component.price)}
                    </span>
                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-sm font-medium">
                      {component.discount_percent}% تخفیف
                    </span>
                  </div>
                )}
                <p
                  className={`text-3xl font-bold ${
                    component.is_free ? "text-green-600" : "text-gray-900"
                  }`}
                >
                  {formatPrice(component.current_price)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {component.is_free || component.can_download ? (
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {downloading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <HiDocumentDownload className="w-5 h-5" />
                    )}
                    {downloading ? "در حال دانلود..." : "دانلود فایل"}
                  </button>
                ) : (
                  <button
                    onClick={() => toast.info("به زودی...")}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    <HiShoppingCart className="w-5 h-5" />
                    افزودن به سبد خرید
                  </button>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
                      isFavorite
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {isFavorite ? (
                      <HiHeart className="w-5 h-5" />
                    ) : (
                      <HiOutlineHeart className="w-5 h-5" />
                    )}
                    علاقه‌مندی
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    <HiShare className="w-5 h-5" />
                    اشتراک‌گذاری
                  </button>
                </div>

                {component.preview_url && (
                  <a
                    href={component.preview_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  >
                    <HiExternalLink className="w-5 h-5" />
                    مشاهده پیش‌نمایش
                  </a>
                )}
              </div>
            </div>

            {/* File Info Card */}
            {component.has_file && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">اطلاعات فایل</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">حجم فایل</span>
                    <span className="font-medium">
                      {component.file_size_formatted}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">فرمت</span>
                    <span className="font-medium">ZIP</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">تاریخ آپدیت</span>
                    <span className="font-medium">
                      {formatDate(component.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tags Card */}
            {component.tags.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">تگ‌ها</h3>
                <div className="flex flex-wrap gap-2">
                  {component.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/components?${tag.type === "framework" ? "frameworks" : tag.type === "styling" ? "stylings" : "features"}[]=${tag.slug}`}
                      className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors hover:opacity-80"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                      }}
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Features Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">ویژگی‌ها</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <HiCheck className="w-5 h-5 text-green-500" />
                  <span>کد تمیز و مستند</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <HiCheck className="w-5 h-5 text-green-500" />
                  <span>ریسپانسیو</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <HiCheck className="w-5 h-5 text-green-500" />
                  <span>پشتیبانی RTL</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <HiCheck className="w-5 h-5 text-green-500" />
                  <span>بروزرسانی رایگان</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <HiCheck className="w-5 h-5 text-green-500" />
                  <span>پشتیبانی ۶ ماهه</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Components */}
        {relatedComponents.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                کامپوننت‌های مشابه
              </h2>
              <Link
                href={`/components?categories[]=${component.category.slug}`}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                مشاهده همه
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedComponents.map((item) => (
                <RelatedComponentCard key={item.id} component={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 left-4 p-2 text-white/70 hover:text-white"
          >
            <HiX className="w-8 h-8" />
          </button>

          {allImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute right-4 p-2 text-white/70 hover:text-white"
              >
                <HiChevronRight className="w-10 h-10" />
              </button>
              <button
                onClick={nextImage}
                className="absolute left-4 p-2 text-white/70 hover:text-white"
              >
                <HiChevronLeft className="w-10 h-10" />
              </button>
            </>
          )}

          <div className="relative w-full max-w-5xl h-[80vh] mx-4">
            <Image
              src={allImages[lightboxIndex]}
              alt={component.title}
              fill
              className="object-contain"
            />
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70">
            {lightboxIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </div>
  );
}

// Reviews Section Component
// Reviews Section Component
function ReviewsSection({
  reviews,
  componentSlug,
  onReviewAdded,
}: {
  reviews: Review[];
  componentSlug: string;
  onReviewAdded: () => void;
}) {
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
      // ✅ FIXED - Actually call the API!
      await publicComponentsAPI.addReview(componentSlug, {
        rating,
        comment: comment.trim() || undefined,
      });

      toast.success("نظر شما ثبت شد و پس از تایید نمایش داده می‌شود");
      setComment("");
      setRating(5);
      onReviewAdded();
    } catch (error: any) {
      console.error("Review submission error:", error);
      
      if (error.response?.status === 401) {
        toast.error("برای ثبت نظر ابتدا وارد شوید");
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
          <span className="text-sm text-gray-500 mr-2">
            ({rating} از 5)
          </span>
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
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
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

// Related Component Card
function RelatedComponentCard({ component }: { component: Component }) {
  const formatPrice = (price: number) => {
    if (price === 0) return "رایگان";
    return price.toLocaleString() + " تومان";
  };

  return (
    <Link
      href={`/components/${component.slug}`}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {component.thumbnail ? (
          <Image
            src={component.thumbnail}
            alt={component.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">بدون تصویر</span>
          </div>
        )}

        {component.is_free && (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            رایگان
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {component.title}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <HiStar className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-600">{component.rating}</span>
          </div>
          <span
            className={`font-medium ${
              component.is_free ? "text-green-600" : "text-gray-900"
            }`}
          >
            {formatPrice(component.current_price)}
          </span>
        </div>
      </div>
    </Link>
  );
}