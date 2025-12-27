'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft, Star, Eye, ShoppingCart, Heart, Download, Share2,
  Check, Play, Monitor, Smartphone, Tablet, Code, Copy, ExternalLink,
  Calendar, RefreshCw, FileCode, Box, Clock, Shield, Zap, Users,
  ChevronRight, MessageSquare, ThumbsUp, Image as ImageIcon
} from 'lucide-react';

// Example Product Data
const product = {
  id: 1,
  title: 'فرم تماس چند مرحله‌ای با reCAPTCHA',
  slug: 'multi-step-contact-form-recaptcha',
  short_description: 'فرم تماس پیشرفته با مراحل متعدد، پروگرس‌بار، اعتبارسنجی کامل و reCAPTCHA v3',
  description: `
    <h2>معرفی کامپوننت</h2>
    <p>این فرم تماس پیشرفته شامل تمام ویژگی‌های مورد نیاز برای یک فرم حرفه‌ای است. با طراحی مدرن و انیمیشن‌های روان، تجربه کاربری بی‌نظیری را ارائه می‌دهد.</p>
    
    <h2>ویژگی‌های کلیدی</h2>
    <ul>
      <li>طراحی چند مرحله‌ای با پروگرس‌بار</li>
      <li>اعتبارسنجی فرم با React Hook Form و Zod</li>
      <li>یکپارچه‌سازی با Google reCAPTCHA v3</li>
      <li>انیمیشن‌های روان با Framer Motion</li>
      <li>پشتیبانی کامل از RTL و فارسی</li>
      <li>تم تاریک و روشن</li>
      <li>کاملاً ریسپانسیو</li>
    </ul>

    <h2>نحوه استفاده</h2>
    <p>پس از خرید، فایل‌های کامپوننت را در پروژه خود کپی کنید و وابستگی‌های مورد نیاز را نصب کنید. داکیومنت کامل همراه با مثال‌های کاربردی در فایل README موجود است.</p>
  `,
  thumbnail: '/api/placeholder/800/600',
  preview_images: [
    '/api/placeholder/800/600',
    '/api/placeholder/800/600',
    '/api/placeholder/800/600',
    '/api/placeholder/800/600',
  ],
  preview_url: 'https://demo.example.com/contact-form',
  video_url: 'https://youtube.com/watch?v=example',
  price: 109000,
  sale_price: 79000,
  sale_ends_at: '2024-02-15T23:59:59',
  is_free: false,
  is_featured: true,
  rating: 4.9,
  reviews_count: 35,
  sales_count: 212,
  views_count: 2450,
  downloads_count: 198,
  file_size: 2456000, // bytes
  version: '2.1.0',
  last_update: '2024-01-15',
  component_type: { id: 201, name: 'فرم‌های تماس', slug: 'contact-forms' },
  page: { id: 2, name: 'تماس با ما', slug: 'contact-us' },
  tags: [
    { id: 1, name: 'React', slug: 'react', color: '#61DAFB' },
    { id: 4, name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
    { id: 5, name: 'Tailwind CSS', slug: 'tailwind', color: '#06B6D4' },
    { id: 10, name: 'Animated', slug: 'animated', color: '#EC4899' },
    { id: 8, name: 'RTL Support', slug: 'rtl', color: '#10B981' },
    { id: 9, name: 'Dark Mode', slug: 'dark-mode', color: '#1F2937' },
  ],
  features: [
    'Multi-step form with progress bar',
    'React Hook Form + Zod validation',
    'Google reCAPTCHA v3 integration',
    'Framer Motion animations',
    'Full RTL support',
    'Dark/Light theme',
    'Fully responsive',
    'TypeScript support',
    'Well documented',
  ],
  browsers_support: ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'],
  author: {
    id: 1,
    name: 'علی احمدی',
    avatar: '/api/placeholder/100/100',
    products_count: 24,
    rating: 4.8,
  },
};

// Related Products
const relatedProducts = [
  {
    id: 2,
    title: 'فرم تماس با reCAPTCHA v3',
    slug: 'contact-form-recaptcha-v3',
    thumbnail: '/api/placeholder/400/300',
    price: 89000,
    sale_price: 69000,
    rating: 4.8,
    sales_count: 156,
    tags: [
      { id: 1, name: 'React', color: '#61DAFB' },
      { id: 5, name: 'Tailwind', color: '#06B6D4' },
    ],
  },
  {
    id: 3,
    title: 'فرم تماس ساده با Tailwind',
    slug: 'simple-contact-form',
    thumbnail: '/api/placeholder/400/300',
    price: 0,
    sale_price: null,
    is_free: true,
    rating: 4.5,
    sales_count: 892,
    tags: [
      { id: 3, name: 'Vanilla JS', color: '#F7DF1E' },
      { id: 5, name: 'Tailwind', color: '#06B6D4' },
    ],
  },
  {
    id: 4,
    title: 'فرم تماس با آپلود فایل',
    slug: 'contact-form-file-upload',
    thumbnail: '/api/placeholder/400/300',
    price: 79000,
    sale_price: null,
    rating: 4.6,
    sales_count: 134,
    tags: [
      { id: 2, name: 'Vue.js', color: '#4FC08D' },
      { id: 5, name: 'Tailwind', color: '#06B6D4' },
    ],
  },
  {
    id: 5,
    title: 'فرم تماس RTL با Bootstrap',
    slug: 'contact-form-rtl-bootstrap',
    thumbnail: '/api/placeholder/400/300',
    price: 59000,
    sale_price: null,
    rating: 4.4,
    sales_count: 98,
    tags: [
      { id: 3, name: 'Vanilla JS', color: '#F7DF1E' },
      { id: 6, name: 'Bootstrap', color: '#7952B3' },
    ],
  },
];

// Reviews
const reviews = [
  {
    id: 1,
    user: { name: 'محمد رضایی', avatar: '/api/placeholder/50/50' },
    rating: 5,
    date: '2024-01-10',
    content: 'کیفیت کد عالی بود. داکیومنت کامل و استفاده ازش خیلی راحت بود. پشتیبانی هم سریع جواب داد.',
    likes: 12,
  },
  {
    id: 2,
    user: { name: 'سارا محمدی', avatar: '/api/placeholder/50/50' },
    rating: 5,
    date: '2024-01-08',
    content: 'دقیقاً چیزی که نیاز داشتم. انیمیشن‌ها خیلی حرفه‌ای هستن و کد تمیز نوشته شده.',
    likes: 8,
  },
  {
    id: 3,
    user: { name: 'امیر حسینی', avatar: '/api/placeholder/50/50' },
    rating: 4,
    date: '2024-01-05',
    content: 'کامپوننت خوبیه ولی کاش یه نسخه Vue هم داشت.',
    likes: 3,
  },
];

// Format file size
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'changelog'>('description');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isWishlisted, setIsWishlisted] = useState(false);

  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0;

  const allImages = [product.thumbnail, ...product.preview_images];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-primary-500">خانه</Link>
            <ChevronLeft className="w-4 h-4" />
            <Link href="/components" className="hover:text-primary-500">کامپوننت‌ها</Link>
            <ChevronLeft className="w-4 h-4" />
            <Link href={`/components?page=${product.page.slug}`} className="hover:text-primary-500">
              {product.page.name}
            </Link>
            <ChevronLeft className="w-4 h-4" />
            <Link href={`/components?type=${product.component_type.slug}`} className="hover:text-primary-500">
              {product.component_type.name}
            </Link>
            <ChevronLeft className="w-4 h-4" />
            <span className="text-slate-800 truncate max-w-[200px]">{product.title}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {/* Main Image */}
              <div className="relative aspect-video bg-slate-100">
                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                  <ImageIcon className="w-24 h-24" />
                </div>

                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  {product.is_featured && (
                    <span className="bg-amber-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <Star className="w-4 h-4 fill-white" />
                      ویژه
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg">
                      {discountPercent}% تخفیف
                    </span>
                  )}
                </div>

                {/* Preview Buttons */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <a
                    href={product.preview_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl font-medium transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    پیش‌نمایش زنده
                  </a>
                  {product.video_url && (
                    <button className="flex items-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-700 px-4 py-2 rounded-xl font-medium transition-colors">
                      <Play className="w-4 h-4" />
                      ویدیو
                    </button>
                  )}
                </div>

                {/* Device Preview Toggle */}
                <div className="absolute bottom-4 right-4 flex items-center bg-white/90 backdrop-blur-sm rounded-xl p-1">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-2 rounded-lg transition-colors ${
                      previewDevice === 'desktop' ? 'bg-primary-500 text-white' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Monitor className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('tablet')}
                    className={`p-2 rounded-lg transition-colors ${
                      previewDevice === 'tablet' ? 'bg-primary-500 text-white' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Tablet className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-2 rounded-lg transition-colors ${
                      previewDevice === 'mobile' ? 'bg-primary-500 text-white' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="p-4 border-t border-slate-100">
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-primary-500' : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-slate-300" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {/* Tab Headers */}
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'description'
                      ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/50'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  توضیحات
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'reviews'
                      ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/50'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  نظرات
                  <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                    {product.reviews_count}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('changelog')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'changelog'
                      ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/50'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  تاریخچه تغییرات
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'description' && (
                  <div className="prose prose-slate max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />

                    {/* Features List */}
                    <h3 className="text-lg font-bold text-slate-800 mt-8 mb-4">ویژگی‌ها</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-slate-600">
                          <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-emerald-600" />
                          </div>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Browser Support */}
                    <h3 className="text-lg font-bold text-slate-800 mt-8 mb-4">مرورگرهای پشتیبانی شده</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.browsers_support.map((browser, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm"
                        >
                          {browser}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {/* Rating Summary */}
                    <div className="flex items-center gap-8 p-6 bg-slate-50 rounded-xl">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-slate-800">{product.rating}</div>
                        <div className="flex items-center justify-center gap-1 mt-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= Math.round(product.rating)
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-slate-500 mt-1">
                          از {product.reviews_count} نظر
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map(rating => (
                          <div key={rating} className="flex items-center gap-2">
                            <span className="text-sm text-slate-600 w-6">{rating}</span>
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-400 rounded-full"
                                style={{ width: `${rating === 5 ? 75 : rating === 4 ? 20 : 5}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {reviews.map(review => (
                        <div key={review.id} className="p-4 border border-slate-200 rounded-xl">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-slate-400" />
                              </div>
                              <div>
                                <div className="font-medium text-slate-800">{review.user.name}</div>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                  <div className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map(star => (
                                      <Star
                                        key={star}
                                        className={`w-3.5 h-3.5 ${
                                          star <= review.rating
                                            ? 'text-amber-400 fill-amber-400'
                                            : 'text-slate-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span>•</span>
                                  <span>{review.date}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-slate-600 text-sm">{review.content}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <button className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary-500">
                              <ThumbsUp className="w-4 h-4" />
                              <span>{review.likes}</span>
                            </button>
                            <button className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary-500">
                              <MessageSquare className="w-4 h-4" />
                              <span>پاسخ</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Review Button */}
                    <button className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-primary-500 hover:text-primary-500 transition-colors">
                      + نوشتن نظر جدید
                    </button>
                  </div>
                )}

                {activeTab === 'changelog' && (
                  <div className="space-y-6">
                    <div className="relative pr-8 border-r-2 border-slate-200">
                      <div className="absolute right-0 top-0 w-4 h-4 bg-primary-500 rounded-full -translate-x-[7px]" />
                      <div className="mb-1 text-sm text-slate-500">نسخه 2.1.0 - ۱۵ دی ۱۴۰۲</div>
                      <h4 className="font-medium text-slate-800 mb-2">آخرین بروزرسانی</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• اضافه شدن تم تاریک</li>
                        <li>• بهبود انیمیشن‌ها</li>
                        <li>• رفع باگ RTL</li>
                      </ul>
                    </div>
                    <div className="relative pr-8 border-r-2 border-slate-200">
                      <div className="absolute right-0 top-0 w-4 h-4 bg-slate-300 rounded-full -translate-x-[7px]" />
                      <div className="mb-1 text-sm text-slate-500">نسخه 2.0.0 - ۱ دی ۱۴۰۲</div>
                      <h4 className="font-medium text-slate-800 mb-2">بازنویسی کامل</h4>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• مهاجرت به TypeScript</li>
                        <li>• استفاده از React Hook Form</li>
                        <li>• اضافه شدن reCAPTCHA v3</li>
                      </ul>
                    </div>
                    <div className="relative pr-8">
                      <div className="absolute right-0 top-0 w-4 h-4 bg-slate-300 rounded-full -translate-x-[7px]" />
                      <div className="mb-1 text-sm text-slate-500">نسخه 1.0.0 - ۱۵ آذر ۱۴۰۲</div>
                      <h4 className="font-medium text-slate-800 mb-2">انتشار اولیه</h4>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Purchase Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Purchase Card */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-6">
                  {/* Title */}
                  <h1 className="text-xl font-bold text-slate-800 mb-2">{product.title}</h1>
                  <p className="text-sm text-slate-500 mb-4">{product.short_description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {product.tags.map(tag => (
                      <Link
                        key={tag.id}
                        href={`/components?tag=${tag.slug}`}
                        className="text-xs px-2 py-1 rounded-md transition-colors"
                        style={{
                          backgroundColor: `${tag.color}15`,
                          color: tag.color,
                        }}
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 mb-6 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-medium text-slate-800">{product.rating}</span>
                      <span className="text-slate-400">({product.reviews_count})</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <ShoppingCart className="w-4 h-4" />
                      <span>{product.sales_count} فروش</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Eye className="w-4 h-4" />
                      <span>{product.views_count}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="p-4 bg-slate-50 rounded-xl mb-6">
                    {hasDiscount ? (
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl font-bold text-primary-600">
                            {product.sale_price?.toLocaleString()}
                          </span>
                          <span className="text-slate-400">تومان</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg text-slate-400 line-through">
                            {product.price.toLocaleString()}
                          </span>
                          <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
                            {discountPercent}% تخفیف
                          </span>
                        </div>
                        <p className="text-xs text-red-500 mt-2">
                          <Clock className="w-3 h-3 inline ml-1" />
                          تخفیف تا ۲۵ بهمن
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-slate-800">
                          {product.price.toLocaleString()}
                        </span>
                        <span className="text-slate-400">تومان</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white py-3.5 rounded-xl font-medium transition-colors">
                      <ShoppingCart className="w-5 h-5" />
                      افزودن به سبد خرید
                    </button>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setIsWishlisted(!isWishlisted)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors ${
                          isWishlisted
                            ? 'bg-red-50 text-red-500 border border-red-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
                        علاقه‌مندی
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-xl font-medium transition-colors">
                        <Share2 className="w-5 h-5" />
                        اشتراک
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="border-t border-slate-100 px-6 py-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-2">
                      <FileCode className="w-4 h-4" />
                      حجم فایل
                    </span>
                    <span className="text-slate-800">{formatFileSize(product.file_size)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Box className="w-4 h-4" />
                      نسخه
                    </span>
                    <span className="text-slate-800">{product.version}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      آخرین بروزرسانی
                    </span>
                    <span className="text-slate-800">{product.last_update}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      دانلودها
                    </span>
                    <span className="text-slate-800">{product.downloads_count}</span>
                  </div>
                </div>

                {/* Guarantees */}
                <div className="border-t border-slate-100 px-6 py-4">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Shield className="w-5 h-5 text-emerald-500" />
                    <span>ضمانت بازگشت وجه تا ۷ روز</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600 mt-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <span>دسترسی فوری پس از خرید</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600 mt-2">
                    <RefreshCw className="w-5 h-5 text-blue-500" />
                    <span>بروزرسانی‌های رایگان</span>
                  </div>
                </div>
              </div>

              {/* Author Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-slate-200 rounded-full flex items-center justify-center">
                    <Users className="w-7 h-7 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">{product.author.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span>{product.author.products_count} محصول</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{product.author.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/sellers/${product.author.id}`}
                  className="block w-full text-center py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  مشاهده پروفایل فروشنده
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">کامپوننت‌های مشابه</h2>
            <Link
              href={`/components?type=${product.component_type.slug}`}
              className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center gap-1"
            >
              مشاهده همه
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(item => (
              <Link
                key={item.id}
                href={`/components/${item.slug}`}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden group hover:shadow-lg hover:border-primary-200 transition-all"
              >
                <div className="aspect-[4/3] bg-slate-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                  {item.is_free && (
                    <span className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded">
                      رایگان
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-slate-800 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{item.rating}</span>
                    </div>
                    <span>{item.sales_count} فروش</span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-3">
                    {item.tags.slice(0, 2).map((tag: any) => (
                      <span
                        key={tag.id}
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ backgroundColor: `${tag.color}15`, color: tag.color }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    {item.is_free ? (
                      <span className="font-bold text-emerald-500">رایگان</span>
                    ) : item.sale_price ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary-600">{item.sale_price.toLocaleString()}</span>
                        <span className="text-xs text-slate-400 line-through">{item.price.toLocaleString()}</span>
                      </div>
                    ) : (
                      <span className="font-bold text-slate-800">{item.price.toLocaleString()} تومان</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
