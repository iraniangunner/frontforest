'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, Filter, Grid, List, ChevronDown, ChevronLeft, ChevronRight,
  Star, Eye, ShoppingCart, Heart, X, SlidersHorizontal,
  Home, Phone, Users, Store, FileText, Lock, LayoutDashboard,
  Rocket, Image as ImageIcon, PanelBottom, PanelTop, Check
} from 'lucide-react';

// ==================== EXAMPLE DATA ====================

const pages = [
  { id: 1, name: 'صفحه اصلی', name_en: 'Homepage', slug: 'homepage', icon: 'Home', products_count: 85 },
  { id: 2, name: 'تماس با ما', name_en: 'Contact Us', slug: 'contact-us', icon: 'Phone', products_count: 52 },
  { id: 3, name: 'درباره ما', name_en: 'About Us', slug: 'about-us', icon: 'Users', products_count: 48 },
  { id: 4, name: 'محصولات / فروشگاه', name_en: 'Products / Shop', slug: 'products-shop', icon: 'Store', products_count: 72 },
  { id: 5, name: 'بلاگ', name_en: 'Blog', slug: 'blog', icon: 'FileText', products_count: 58 },
  { id: 6, name: 'احراز هویت', name_en: 'Authentication', slug: 'authentication', icon: 'Lock', products_count: 44 },
  { id: 7, name: 'داشبورد / ادمین', name_en: 'Dashboard / Admin', slug: 'dashboard-admin', icon: 'LayoutDashboard', products_count: 68 },
  { id: 8, name: 'لندینگ پیج', name_en: 'Landing Page', slug: 'landing-page', icon: 'Rocket', products_count: 56 },
  { id: 9, name: 'پورتفولیو / گالری', name_en: 'Portfolio / Gallery', slug: 'portfolio-gallery', icon: 'ImageIcon', products_count: 42 },
  { id: 10, name: 'فوتر', name_en: 'Footer', slug: 'footer', icon: 'PanelBottom', products_count: 38 },
  { id: 11, name: 'هدر / ناوبری', name_en: 'Header / Navigation', slug: 'header-navigation', icon: 'PanelTop', products_count: 46 },
];

const componentTypes = [
  { id: 101, page_id: 1, name: 'Hero Sections', slug: 'hero-sections', products_count: 24 },
  { id: 102, page_id: 1, name: 'Feature Highlights', slug: 'feature-highlights', products_count: 18 },
  { id: 103, page_id: 1, name: 'نظرات مشتریان', slug: 'testimonials', products_count: 15 },
  { id: 201, page_id: 2, name: 'فرم‌های تماس', slug: 'contact-forms', products_count: 20 },
  { id: 202, page_id: 2, name: 'نقشه‌ها', slug: 'maps', products_count: 12 },
  { id: 701, page_id: 7, name: 'سایدبار ناوبری', slug: 'sidebar-navigation', products_count: 14 },
  { id: 702, page_id: 7, name: 'کارت‌های آماری', slug: 'stats-cards', products_count: 16 },
  { id: 703, page_id: 7, name: 'جداول داده', slug: 'data-tables', products_count: 14 },
  { id: 704, page_id: 7, name: 'نمودارها', slug: 'charts', products_count: 12 },
  { id: 705, page_id: 7, name: 'فرم‌های تنظیمات', slug: 'settings-forms', products_count: 12 },
];

const tags = [
  { id: 1, name: 'React', slug: 'react', color: '#61DAFB', products_count: 156 },
  { id: 2, name: 'Vue.js', slug: 'vue', color: '#4FC08D', products_count: 89 },
  { id: 3, name: 'Vanilla JS', slug: 'vanilla-js', color: '#F7DF1E', products_count: 124 },
  { id: 4, name: 'TypeScript', slug: 'typescript', color: '#3178C6', products_count: 98 },
  { id: 5, name: 'Tailwind CSS', slug: 'tailwind', color: '#06B6D4', products_count: 201 },
  { id: 6, name: 'Bootstrap', slug: 'bootstrap', color: '#7952B3', products_count: 67 },
  { id: 7, name: 'Next.js', slug: 'nextjs', color: '#000000', products_count: 45 },
  { id: 8, name: 'RTL Support', slug: 'rtl', color: '#10B981', products_count: 78 },
  { id: 9, name: 'Dark Mode', slug: 'dark-mode', color: '#1F2937', products_count: 92 },
  { id: 10, name: 'Animated', slug: 'animated', color: '#EC4899', products_count: 63 },
];

const products = [
  {
    id: 1,
    title: 'فرم تماس با reCAPTCHA v3',
    slug: 'contact-form-recaptcha-v3',
    short_description: 'فرم تماس امن با اعتبارسنجی Google reCAPTCHA v3 و انیمیشن‌های زیبا',
    thumbnail: '/api/placeholder/400/300',
    price: 89000,
    sale_price: 69000,
    is_free: false,
    is_featured: true,
    rating: 4.8,
    reviews_count: 24,
    sales_count: 156,
    views_count: 1820,
    component_type: { id: 201, name: 'فرم‌های تماس', slug: 'contact-forms' },
    page: { id: 2, name: 'تماس با ما', slug: 'contact-us' },
    tags: [
      { id: 1, name: 'React', slug: 'react', color: '#61DAFB' },
      { id: 5, name: 'Tailwind CSS', slug: 'tailwind', color: '#06B6D4' },
      { id: 4, name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
    ],
  },
  {
    id: 2,
    title: 'Hero Section با ویدیو پس‌زمینه',
    slug: 'hero-video-background',
    short_description: 'سکشن Hero زیبا با ویدیو پس‌زمینه و افکت‌های پارالاکس',
    thumbnail: '/api/placeholder/400/300',
    price: 129000,
    sale_price: null,
    is_free: false,
    is_featured: true,
    rating: 4.9,
    reviews_count: 42,
    sales_count: 289,
    views_count: 3450,
    component_type: { id: 101, name: 'Hero Sections', slug: 'hero-sections' },
    page: { id: 1, name: 'صفحه اصلی', slug: 'homepage' },
    tags: [
      { id: 1, name: 'React', slug: 'react', color: '#61DAFB' },
      { id: 5, name: 'Tailwind CSS', slug: 'tailwind', color: '#06B6D4' },
      { id: 10, name: 'Animated', slug: 'animated', color: '#EC4899' },
    ],
  },
  {
    id: 3,
    title: 'فرم تنظیمات پروفایل با Tab',
    slug: 'profile-settings-tabs',
    short_description: 'فرم تنظیمات کامل با تب‌های متعدد، آپلود آواتار و اعتبارسنجی',
    thumbnail: '/api/placeholder/400/300',
    price: 119000,
    sale_price: 89000,
    is_free: false,
    is_featured: true,
    rating: 4.7,
    reviews_count: 31,
    sales_count: 198,
    views_count: 2100,
    component_type: { id: 705, name: 'فرم‌های تنظیمات', slug: 'settings-forms' },
    page: { id: 7, name: 'داشبورد / ادمین', slug: 'dashboard-admin' },
    tags: [
      { id: 1, name: 'React', slug: 'react', color: '#61DAFB' },
      { id: 4, name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
      { id: 5, name: 'Tailwind CSS', slug: 'tailwind', color: '#06B6D4' },
      { id: 9, name: 'Dark Mode', slug: 'dark-mode', color: '#1F2937' },
    ],
  },
  {
    id: 4,
    title: 'جدول داده پیشرفته',
    slug: 'advanced-data-table',
    short_description: 'جدول داده با قابلیت مرتب‌سازی، فیلتر، صفحه‌بندی و انتخاب چندگانه',
    thumbnail: '/api/placeholder/400/300',
    price: 149000,
    sale_price: null,
    is_free: false,
    is_featured: false,
    rating: 4.6,
    reviews_count: 28,
    sales_count: 167,
    views_count: 1950,
    component_type: { id: 703, name: 'جداول داده', slug: 'data-tables' },
    page: { id: 7, name: 'داشبورد / ادمین', slug: 'dashboard-admin' },
    tags: [
      { id: 1, name: 'React', slug: 'react', color: '#61DAFB' },
      { id: 4, name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
      { id: 5, name: 'Tailwind CSS', slug: 'tailwind', color: '#06B6D4' },
    ],
  },
  {
    id: 5,
    title: 'فرم تماس ساده با Tailwind',
    slug: 'simple-contact-form-tailwind',
    short_description: 'فرم تماس ساده، سبک و زیبا با استایل Tailwind CSS',
    thumbnail: '/api/placeholder/400/300',
    price: 0,
    sale_price: null,
    is_free: true,
    is_featured: false,
    rating: 4.5,
    reviews_count: 56,
    sales_count: 892,
    views_count: 5600,
    component_type: { id: 201, name: 'فرم‌های تماس', slug: 'contact-forms' },
    page: { id: 2, name: 'تماس با ما', slug: 'contact-us' },
    tags: [
      { id: 3, name: 'Vanilla JS', slug: 'vanilla-js', color: '#F7DF1E' },
      { id: 5, name: 'Tailwind CSS', slug: 'tailwind', color: '#06B6D4' },
      { id: 8, name: 'RTL Support', slug: 'rtl', color: '#10B981' },
    ],
  },
  {
    id: 6,
    title: 'نقشه با React Leaflet',
    slug: 'map-react-leaflet',
    short_description: 'نقشه تعاملی با مارکر، پاپ‌آپ و استایل سفارشی',
    thumbnail: '/api/placeholder/400/300',
    price: 79000,
    sale_price: null,
    is_free: false,
    is_featured: false,
    rating: 4.4,
    reviews_count: 19,
    sales_count: 134,
    views_count: 1420,
    component_type: { id: 202, name: 'نقشه‌ها', slug: 'maps' },
    page: { id: 2, name: 'تماس با ما', slug: 'contact-us' },
    tags: [
      { id: 1, name: 'React', slug: 'react', color: '#61DAFB' },
      { id: 5, name: 'Tailwind CSS', slug: 'tailwind', color: '#06B6D4' },
    ],
  },
  {
    id: 7,
    title: 'کارت‌های آماری داشبورد',
    slug: 'dashboard-stats-cards',
    short_description: 'مجموعه کارت‌های آماری با آیکون، نمودار و انیمیشن',
    thumbnail: '/api/placeholder/400/300',
    price: 69000,
    sale_price: 49000,
    is_free: false,
    is_featured: true,
    rating: 4.8,
    reviews_count: 37,
    sales_count: 245,
    views_count: 2800,
    component_type: { id: 702, name: 'کارت‌های آماری', slug: 'stats-cards' },
    page: { id: 7, name: 'داشبورد / ادمین', slug: 'dashboard-admin' },
    tags: [
      { id: 1, name: 'React', slug: 'react', color: '#61DAFB' },
      { id: 5, name: 'Tailwind CSS', slug: 'tailwind', color: '#06B6D4' },
      { id: 10, name: 'Animated', slug: 'animated', color: '#EC4899' },
    ],
  },
  {
    id: 8,
    title: 'Hero Section گرادیانت',
    slug: 'hero-gradient',
    short_description: 'Hero Section ساده و زیبا با پس‌زمینه گرادیانت متحرک',
    thumbnail: '/api/placeholder/400/300',
    price: 0,
    sale_price: null,
    is_free: true,
    is_featured: false,
    rating: 4.3,
    reviews_count: 42,
    sales_count: 678,
    views_count: 4200,
    component_type: { id: 101, name: 'Hero Sections', slug: 'hero-sections' },
    page: { id: 1, name: 'صفحه اصلی', slug: 'homepage' },
    tags: [
      { id: 3, name: 'Vanilla JS', slug: 'vanilla-js', color: '#F7DF1E' },
      { id: 5, name: 'Tailwind CSS', slug: 'tailwind', color: '#06B6D4' },
    ],
  },
  {
    id: 9,
    title: 'سایدبار داشبورد با Collapse',
    slug: 'dashboard-sidebar-collapse',
    short_description: 'سایدبار ناوبری با منوی تو در تو و قابلیت جمع شدن',
    thumbnail: '/api/placeholder/400/300',
    price: 99000,
    sale_price: null,
    is_free: false,
    is_featured: false,
    rating: 4.7,
    reviews_count: 23,
    sales_count: 187,
    views_count: 2100,
    component_type: { id: 701, name: 'سایدبار ناوبری', slug: 'sidebar-navigation' },
    page: { id: 7, name: 'داشبورد / ادمین', slug: 'dashboard-admin' },
    tags: [
      { id: 1, name: 'React', slug: 'react', color: '#61DAFB' },
      { id: 5, name: 'Tailwind CSS', slug: 'tailwind', color: '#06B6D4' },
      { id: 9, name: 'Dark Mode', slug: 'dark-mode', color: '#1F2937' },
    ],
  },
  {
    id: 10,
    title: 'نمودارهای Chart.js',
    slug: 'chartjs-components',
    short_description: 'مجموعه نمودارهای خطی، میله‌ای، دایره‌ای و ترکیبی',
    thumbnail: '/api/placeholder/400/300',
    price: 89000,
    sale_price: null,
    is_free: false,
    is_featured: false,
    rating: 4.5,
    reviews_count: 18,
    sales_count: 145,
    views_count: 1680,
    component_type: { id: 704, name: 'نمودارها', slug: 'charts' },
    page: { id: 7, name: 'داشبورد / ادمین', slug: 'dashboard-admin' },
    tags: [
      { id: 1, name: 'React', slug: 'react', color: '#61DAFB' },
      { id: 4, name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
      { id: 5, name: 'Tailwind CSS', slug: 'tailwind', color: '#06B6D4' },
    ],
  },
  {
    id: 11,
    title: 'فرم تماس چند مرحله‌ای',
    slug: 'multi-step-contact-form',
    short_description: 'فرم تماس پیشرفته با مراحل متعدد، پروگرس‌بار و انیمیشن',
    thumbnail: '/api/placeholder/400/300',
    price: 109000,
    sale_price: 79000,
    is_free: false,
    is_featured: true,
    rating: 4.9,
    reviews_count: 35,
    sales_count: 212,
    views_count: 2450,
    component_type: { id: 201, name: 'فرم‌های تماس', slug: 'contact-forms' },
    page: { id: 2, name: 'تماس با ما', slug: 'contact-us' },
    tags: [
      { id: 1, name: 'React', slug: 'react', color: '#61DAFB' },
      { id: 4, name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
      { id: 5, name: 'Tailwind CSS', slug: 'tailwind', color: '#06B6D4' },
      { id: 10, name: 'Animated', slug: 'animated', color: '#EC4899' },
    ],
  },
  {
    id: 12,
    title: 'Feature Cards با آیکون',
    slug: 'feature-cards-icons',
    short_description: 'کارت‌های معرفی ویژگی با آیکون، انیمیشن هاور و طرح‌های متنوع',
    thumbnail: '/api/placeholder/400/300',
    price: 59000,
    sale_price: null,
    is_free: false,
    is_featured: false,
    rating: 4.6,
    reviews_count: 27,
    sales_count: 178,
    views_count: 1920,
    component_type: { id: 102, name: 'Feature Highlights', slug: 'feature-highlights' },
    page: { id: 1, name: 'صفحه اصلی', slug: 'homepage' },
    tags: [
      { id: 2, name: 'Vue.js', slug: 'vue', color: '#4FC08D' },
      { id: 5, name: 'Tailwind CSS', slug: 'tailwind', color: '#06B6D4' },
      { id: 10, name: 'Animated', slug: 'animated', color: '#EC4899' },
    ],
  },
];

// Icon mapping
const iconMap: Record<string, any> = {
  'Home': Home,
  'Phone': Phone,
  'Users': Users,
  'Store': Store,
  'FileText': FileText,
  'Lock': Lock,
  'LayoutDashboard': LayoutDashboard,
  'Rocket': Rocket,
  'ImageIcon': ImageIcon,
  'PanelBottom': PanelBottom,
  'PanelTop': PanelTop,
};

// Sort options
const sortOptions = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'popular', label: 'پرفروش‌ترین' },
  { value: 'most_viewed', label: 'پربازدیدترین' },
  { value: 'price_low', label: 'ارزان‌ترین' },
  { value: 'price_high', label: 'گران‌ترین' },
  { value: 'rating', label: 'بالاترین امتیاز' },
];

// ==================== COMPONENTS ====================

// Product Card Component
function ProductCard({ product }: { product: typeof products[0] }) {
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden group hover:shadow-xl hover:border-primary-200 transition-all duration-300">
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-emerald-500/10" />
        
        {/* Placeholder for image */}
        <div className="absolute inset-0 flex items-center justify-center text-slate-300">
          <ImageIcon className="w-16 h-16" />
        </div>

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {product.is_free && (
            <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
              رایگان
            </span>
          )}
          {hasDiscount && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
              {discountPercent}% تخفیف
            </span>
          )}
          {product.is_featured && !product.is_free && !hasDiscount && (
            <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
              ویژه
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-slate-600 hover:text-red-500 hover:bg-white transition-colors shadow-sm">
            <Heart className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-slate-600 hover:text-primary-500 hover:bg-white transition-colors shadow-sm">
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Preview Button */}
        <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link 
            href={`/components/${product.slug}`}
            className="block w-full bg-primary-500 hover:bg-primary-600 text-white text-center py-2.5 rounded-xl font-medium text-sm transition-colors"
          >
            مشاهده جزئیات
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="flex items-center gap-2 mb-2">
          <Link 
            href={`/components?page=${product.page.slug}`}
            className="text-xs text-slate-400 hover:text-primary-500 transition-colors"
          >
            {product.page.name}
          </Link>
          <ChevronLeft className="w-3 h-3 text-slate-300" />
          <Link 
            href={`/components?type=${product.component_type.slug}`}
            className="text-xs text-slate-400 hover:text-primary-500 transition-colors"
          >
            {product.component_type.name}
          </Link>
        </div>

        {/* Title */}
        <Link href={`/components/${product.slug}`}>
          <h3 className="font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-slate-500 mb-3 line-clamp-2">
          {product.short_description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.tags.slice(0, 3).map(tag => (
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
          {product.tags.length > 3 && (
            <span className="text-xs px-2 py-1 bg-slate-100 text-slate-500 rounded-md">
              +{product.tags.length - 3}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-slate-600 font-medium">{product.rating}</span>
            <span>({product.reviews_count})</span>
          </div>
          <div className="flex items-center gap-1">
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{product.sales_count} فروش</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            {product.is_free ? (
              <span className="text-lg font-bold text-emerald-500">رایگان</span>
            ) : hasDiscount ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary-600">
                  {product.sale_price?.toLocaleString()}
                </span>
                <span className="text-sm text-slate-400 line-through">
                  {product.price.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400">تومان</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-slate-800">
                  {product.price.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400">تومان</span>
              </div>
            )}
          </div>
          <button className="w-10 h-10 bg-primary-500 hover:bg-primary-600 text-white rounded-xl flex items-center justify-center transition-colors">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Filter Sidebar Component
function FilterSidebar({ 
  selectedPage,
  setSelectedPage,
  selectedType,
  setSelectedType,
  selectedTags,
  setSelectedTags,
  priceRange,
  setPriceRange,
  showFreeOnly,
  setShowFreeOnly,
  showFeaturedOnly,
  setShowFeaturedOnly,
  showOnSaleOnly,
  setShowOnSaleOnly,
}: {
  selectedPage: string | null;
  setSelectedPage: (page: string | null) => void;
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  showFreeOnly: boolean;
  setShowFreeOnly: (show: boolean) => void;
  showFeaturedOnly: boolean;
  setShowFeaturedOnly: (show: boolean) => void;
  showOnSaleOnly: boolean;
  setShowOnSaleOnly: (show: boolean) => void;
}) {
  const [expandedPages, setExpandedPages] = useState<number[]>([]);

  const togglePage = (pageId: number) => {
    setExpandedPages(prev => 
      prev.includes(pageId) ? prev.filter(id => id !== pageId) : [...prev, pageId]
    );
  };

  const toggleTag = (tagSlug: string) => {
    setSelectedTags(
      selectedTags.includes(tagSlug)
        ? selectedTags.filter(t => t !== tagSlug)
        : [...selectedTags, tagSlug]
    );
  };

  const filteredTypes = selectedPage 
    ? componentTypes.filter(t => t.page_id === pages.find(p => p.slug === selectedPage)?.id)
    : componentTypes;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sticky top-24">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          فیلترها
        </h3>
        <button 
          onClick={() => {
            setSelectedPage(null);
            setSelectedType(null);
            setSelectedTags([]);
            setShowFreeOnly(false);
            setShowFeaturedOnly(false);
            setShowOnSaleOnly(false);
          }}
          className="text-xs text-primary-500 hover:text-primary-600"
        >
          پاک کردن همه
        </button>
      </div>

      {/* Quick Filters */}
      <div className="mb-6 pb-6 border-b border-slate-100">
        <h4 className="text-sm font-medium text-slate-700 mb-3">فیلتر سریع</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={showFreeOnly}
              onChange={(e) => setShowFreeOnly(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-slate-600 group-hover:text-slate-800">فقط رایگان‌ها</span>
            <span className="text-xs text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full mr-auto">🎁</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={showFeaturedOnly}
              onChange={(e) => setShowFeaturedOnly(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-slate-600 group-hover:text-slate-800">فقط ویژه‌ها</span>
            <span className="text-xs text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full mr-auto">⭐</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={showOnSaleOnly}
              onChange={(e) => setShowOnSaleOnly(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-slate-600 group-hover:text-slate-800">فقط تخفیف‌دار</span>
            <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full mr-auto">🔥</span>
          </label>
        </div>
      </div>

      {/* Pages Filter */}
      <div className="mb-6 pb-6 border-b border-slate-100">
        <h4 className="text-sm font-medium text-slate-700 mb-3">صفحات</h4>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {pages.map(page => {
            const Icon = iconMap[page.icon] || Home;
            const pageTypes = componentTypes.filter(t => t.page_id === page.id);
            const isExpanded = expandedPages.includes(page.id);
            const isSelected = selectedPage === page.slug;

            return (
              <div key={page.id}>
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      setSelectedPage(isSelected ? null : page.slug);
                      setSelectedType(null);
                    }}
                    className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isSelected
                        ? 'bg-primary-50 text-primary-600'
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="flex-1 text-right">{page.name}</span>
                    <span className="text-xs text-slate-400">{page.products_count}</span>
                  </button>
                  {pageTypes.length > 0 && (
                    <button
                      onClick={() => togglePage(page.id)}
                      className="p-2 hover:bg-slate-50 rounded-lg"
                    >
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>

                {/* Component Types */}
                {isExpanded && pageTypes.length > 0 && (
                  <div className="mr-6 mt-1 space-y-1 border-r-2 border-slate-100 pr-3">
                    {pageTypes.map(type => (
                      <button
                        key={type.id}
                        onClick={() => {
                          setSelectedPage(page.slug);
                          setSelectedType(selectedType === type.slug ? null : type.slug);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          selectedType === type.slug
                            ? 'bg-primary-50 text-primary-600'
                            : 'hover:bg-slate-50 text-slate-500'
                        }`}
                      >
                        <span>{type.name}</span>
                        <span className="text-xs text-slate-400">{type.products_count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tags Filter */}
      <div className="mb-6 pb-6 border-b border-slate-100">
        <h4 className="text-sm font-medium text-slate-700 mb-3">تکنولوژی‌ها</h4>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => {
            const isSelected = selectedTags.includes(tag.slug);
            return (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.slug)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'ring-2 ring-offset-1'
                    : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: `${tag.color}15`,
                  color: tag.color,
                  ringColor: isSelected ? tag.color : 'transparent',
                }}
              >
                {isSelected && <Check className="w-3 h-3" />}
                {tag.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-medium text-slate-700 mb-3">محدوده قیمت</h4>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="number"
              placeholder="از"
              value={priceRange[0] || ''}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <span className="text-slate-400">-</span>
          <div className="flex-1">
            <input
              type="number"
              placeholder="تا"
              value={priceRange[1] || ''}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2">قیمت به تومان</p>
      </div>
    </div>
  );
}

// ==================== MAIN PAGE ====================

export default function ComponentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showOnSaleOnly, setShowOnSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter products
  const filteredProducts = products.filter(product => {
    if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedPage && product.page.slug !== selectedPage) {
      return false;
    }
    if (selectedType && product.component_type.slug !== selectedType) {
      return false;
    }
    if (selectedTags.length > 0 && !selectedTags.some(tag => product.tags.some(t => t.slug === tag))) {
      return false;
    }
    if (showFreeOnly && !product.is_free) {
      return false;
    }
    if (showFeaturedOnly && !product.is_featured) {
      return false;
    }
    if (showOnSaleOnly && !product.sale_price) {
      return false;
    }
    if (priceRange[0] > 0 && product.price < priceRange[0]) {
      return false;
    }
    if (priceRange[1] > 0 && product.price > priceRange[1]) {
      return false;
    }
    return true;
  });

  // Active filters count
  const activeFiltersCount = [
    selectedPage,
    selectedType,
    selectedTags.length > 0,
    showFreeOnly,
    showFeaturedOnly,
    showOnSaleOnly,
    priceRange[0] > 0 || priceRange[1] > 0,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link href="/" className="hover:text-primary-500">خانه</Link>
            <ChevronLeft className="w-4 h-4" />
            <span className="text-slate-800">کامپوننت‌ها</span>
            {selectedPage && (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-slate-800">
                  {pages.find(p => p.slug === selectedPage)?.name}
                </span>
              </>
            )}
            {selectedType && (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-slate-800">
                  {componentTypes.find(t => t.slug === selectedType)?.name}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
            {selectedType 
              ? componentTypes.find(t => t.slug === selectedType)?.name
              : selectedPage 
                ? `کامپوننت‌های ${pages.find(p => p.slug === selectedPage)?.name}`
                : 'همه کامپوننت‌ها'
            }
          </h1>
          <p className="text-slate-500">
            {filteredProducts.length} کامپوننت یافت شد
          </p>
        </div>
      </div>

      {/* Search & Sort Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="جستجو در کامپوننت‌ها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span>فیلترها</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none px-4 py-3 pr-10 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>

              {/* View Mode */}
              <div className="hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-primary-500' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-primary-500' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Tags */}
          {(selectedTags.length > 0 || selectedPage || selectedType || showFreeOnly || showFeaturedOnly || showOnSaleOnly) && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">
              <span className="text-sm text-slate-500">فیلترهای فعال:</span>
              
              {selectedPage && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-600 text-sm rounded-full">
                  {pages.find(p => p.slug === selectedPage)?.name}
                  <button onClick={() => { setSelectedPage(null); setSelectedType(null); }} className="hover:text-primary-800">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {selectedType && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-600 text-sm rounded-full">
                  {componentTypes.find(t => t.slug === selectedType)?.name}
                  <button onClick={() => setSelectedType(null)} className="hover:text-primary-800">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {selectedTags.map(tagSlug => {
                const tag = tags.find(t => t.slug === tagSlug);
                return tag ? (
                  <span 
                    key={tagSlug}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full"
                    style={{ backgroundColor: `${tag.color}15`, color: tag.color }}
                  >
                    {tag.name}
                    <button onClick={() => setSelectedTags(selectedTags.filter(t => t !== tagSlug))}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ) : null;
              })}

              {showFreeOnly && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 text-sm rounded-full">
                  رایگان
                  <button onClick={() => setShowFreeOnly(false)}><X className="w-3.5 h-3.5" /></button>
                </span>
              )}

              {showFeaturedOnly && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-600 text-sm rounded-full">
                  ویژه
                  <button onClick={() => setShowFeaturedOnly(false)}><X className="w-3.5 h-3.5" /></button>
                </span>
              )}

              {showOnSaleOnly && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 text-sm rounded-full">
                  تخفیف‌دار
                  <button onClick={() => setShowOnSaleOnly(false)}><X className="w-3.5 h-3.5" /></button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-72 shrink-0">
            <FilterSidebar
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              showFreeOnly={showFreeOnly}
              setShowFreeOnly={setShowFreeOnly}
              showFeaturedOnly={showFeaturedOnly}
              setShowFeaturedOnly={setShowFeaturedOnly}
              showOnSaleOnly={showOnSaleOnly}
              setShowOnSaleOnly={setShowOnSaleOnly}
            />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  {[1, 2, 3, 4, 5].map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-primary-500 text-white'
                          : 'border border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <span className="px-2 text-slate-400">...</span>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors">
                    12
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              // Empty State
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  کامپوننتی یافت نشد
                </h3>
                <p className="text-slate-500 mb-6">
                  فیلترهای خود را تغییر دهید یا عبارت جستجوی دیگری امتحان کنید
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedPage(null);
                    setSelectedType(null);
                    setSelectedTags([]);
                    setShowFreeOnly(false);
                    setShowFeaturedOnly(false);
                    setShowOnSaleOnly(false);
                    setPriceRange([0, 0]);
                  }}
                  className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors"
                >
                  پاک کردن فیلترها
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">فیلترها</h3>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar
                selectedPage={selectedPage}
                setSelectedPage={setSelectedPage}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                showFreeOnly={showFreeOnly}
                setShowFreeOnly={setShowFreeOnly}
                showFeaturedOnly={showFeaturedOnly}
                setShowFeaturedOnly={setShowFeaturedOnly}
                showOnSaleOnly={showOnSaleOnly}
                setShowOnSaleOnly={setShowOnSaleOnly}
              />
            </div>
            <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors"
              >
                نمایش {filteredProducts.length} کامپوننت
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
