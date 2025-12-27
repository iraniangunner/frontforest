'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Menu, X, ChevronDown, ShoppingBag, Settings, ChevronLeft, 
  Home, Phone, Users, Store, FileText, Lock, LayoutDashboard, 
  Rocket, Image, PanelBottom, PanelTop, MapPin, Clock, Share2,
  Grid, Filter, Heart, Eye, List, MessageSquare, User, Link2,
  LogIn, UserPlus, KeyRound, Smartphone, SidebarIcon, BarChart3,
  Table, PieChart, Settings2, DollarSign, HelpCircle, Mail, Timer,
  Images, FolderOpen, Maximize, Columns, Newspaper, AlignCenter,
  MenuIcon, Search, Sparkles, MessageCircle, Calendar, Award
} from 'lucide-react';

// Categories organized by Page → Component Type → Products
const categories = [
  {
    id: 1,
    name: 'صفحه اصلی',
    nameEn: 'Homepage',
    slug: 'homepage',
    icon: 'Home',
    products_count: 85,
    children: [
      { id: 101, name: 'Hero Sections', slug: 'hero-sections', products_count: 24 },
      { id: 102, name: 'Feature Highlights', slug: 'feature-highlights', products_count: 18 },
      { id: 103, name: 'نظرات مشتریان', slug: 'testimonials', products_count: 15 },
      { id: 104, name: 'آمار و شمارنده', slug: 'stats-counters', products_count: 12 },
      { id: 105, name: 'بنرهای CTA', slug: 'cta-banners', products_count: 16 },
    ],
  },
  {
    id: 2,
    name: 'تماس با ما',
    nameEn: 'Contact Us',
    slug: 'contact-us',
    icon: 'Phone',
    products_count: 52,
    children: [
      { id: 201, name: 'فرم‌های تماس', slug: 'contact-forms', products_count: 20 },
      { id: 202, name: 'نقشه‌ها', slug: 'maps', products_count: 12 },
      { id: 203, name: 'ساعات کاری', slug: 'business-hours', products_count: 8 },
      { id: 204, name: 'لینک شبکه‌های اجتماعی', slug: 'social-links', products_count: 12 },
    ],
  },
  {
    id: 3,
    name: 'درباره ما',
    nameEn: 'About Us',
    slug: 'about-us',
    icon: 'Users',
    products_count: 48,
    children: [
      { id: 301, name: 'کارت اعضای تیم', slug: 'team-cards', products_count: 16 },
      { id: 302, name: 'تایم‌لاین شرکت', slug: 'company-timeline', products_count: 10 },
      { id: 303, name: 'بخش ماموریت/چشم‌انداز', slug: 'mission-vision', products_count: 12 },
      { id: 304, name: 'لوگوی شرکا', slug: 'partner-logos', products_count: 10 },
    ],
  },
  {
    id: 4,
    name: 'محصولات / فروشگاه',
    nameEn: 'Products / Shop',
    slug: 'products-shop',
    icon: 'Store',
    products_count: 72,
    children: [
      { id: 401, name: 'گرید محصولات', slug: 'product-grids', products_count: 18 },
      { id: 402, name: 'فیلتر محصولات', slug: 'product-filters', products_count: 14 },
      { id: 403, name: 'سبد خرید', slug: 'shopping-cart', products_count: 12 },
      { id: 404, name: 'علاقه‌مندی‌ها', slug: 'wishlist', products_count: 10 },
      { id: 405, name: 'مودال پیش‌نمایش سریع', slug: 'quick-view-modals', products_count: 18 },
    ],
  },
  {
    id: 5,
    name: 'بلاگ',
    nameEn: 'Blog',
    slug: 'blog',
    icon: 'FileText',
    products_count: 58,
    children: [
      { id: 501, name: 'لیست پست‌ها', slug: 'post-lists', products_count: 16 },
      { id: 502, name: 'صفحه تک پست', slug: 'single-post', products_count: 12 },
      { id: 503, name: 'بخش نظرات', slug: 'comments-section', products_count: 10 },
      { id: 504, name: 'بیوگرافی نویسنده', slug: 'author-bio', products_count: 8 },
      { id: 505, name: 'پست‌های مرتبط', slug: 'related-posts', products_count: 12 },
    ],
  },
  {
    id: 6,
    name: 'احراز هویت',
    nameEn: 'Authentication',
    slug: 'authentication',
    icon: 'Lock',
    products_count: 44,
    children: [
      { id: 601, name: 'صفحه ورود', slug: 'login-page', products_count: 14 },
      { id: 602, name: 'صفحه ثبت‌نام', slug: 'register-page', products_count: 12 },
      { id: 603, name: 'فراموشی رمز عبور', slug: 'forgot-password', products_count: 8 },
      { id: 604, name: 'تایید OTP', slug: 'otp-verification', products_count: 10 },
    ],
  },
  {
    id: 7,
    name: 'داشبورد / ادمین',
    nameEn: 'Dashboard / Admin',
    slug: 'dashboard-admin',
    icon: 'LayoutDashboard',
    products_count: 68,
    children: [
      { id: 701, name: 'سایدبار ناوبری', slug: 'sidebar-navigation', products_count: 14 },
      { id: 702, name: 'کارت‌های آماری', slug: 'stats-cards', products_count: 16 },
      { id: 703, name: 'جداول داده', slug: 'data-tables', products_count: 14 },
      { id: 704, name: 'نمودارها', slug: 'charts', products_count: 12 },
      { id: 705, name: 'فرم‌های تنظیمات', slug: 'settings-forms', products_count: 12 },
    ],
  },
  {
    id: 8,
    name: 'لندینگ پیج',
    nameEn: 'Landing Page',
    slug: 'landing-page',
    icon: 'Rocket',
    products_count: 56,
    children: [
      { id: 801, name: 'جداول قیمت‌گذاری', slug: 'pricing-tables', products_count: 18 },
      { id: 802, name: 'آکاردئون سوالات متداول', slug: 'faq-accordions', products_count: 14 },
      { id: 803, name: 'عضویت خبرنامه', slug: 'newsletter-signup', products_count: 12 },
      { id: 804, name: 'شمارنده معکوس', slug: 'countdown-timers', products_count: 12 },
    ],
  },
  {
    id: 9,
    name: 'پورتفولیو / گالری',
    nameEn: 'Portfolio / Gallery',
    slug: 'portfolio-gallery',
    icon: 'Image',
    products_count: 42,
    children: [
      { id: 901, name: 'گالری تصاویر', slug: 'image-galleries', products_count: 16 },
      { id: 902, name: 'نمایش پروژه‌ها', slug: 'project-showcases', products_count: 14 },
      { id: 903, name: 'لایت‌باکس', slug: 'lightbox-viewers', products_count: 12 },
    ],
  },
  {
    id: 10,
    name: 'فوتر',
    nameEn: 'Footer',
    slug: 'footer',
    icon: 'PanelBottom',
    products_count: 38,
    children: [
      { id: 1001, name: 'فوتر چند ستونه', slug: 'multi-column-footers', products_count: 16 },
      { id: 1002, name: 'فوتر + خبرنامه', slug: 'newsletter-footer', products_count: 12 },
      { id: 1003, name: 'فوتر مینیمال', slug: 'minimal-footers', products_count: 10 },
    ],
  },
  {
    id: 11,
    name: 'هدر / ناوبری',
    nameEn: 'Header / Navigation',
    slug: 'header-navigation',
    icon: 'PanelTop',
    products_count: 46,
    children: [
      { id: 1101, name: 'هدر چسبان', slug: 'sticky-headers', products_count: 14 },
      { id: 1102, name: 'مگا منو', slug: 'mega-menus', products_count: 12 },
      { id: 1103, name: 'منو همبرگری موبایل', slug: 'mobile-hamburger-menus', products_count: 10 },
      { id: 1104, name: 'نوار جستجو', slug: 'search-bars', products_count: 10 },
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
  'Image': Image,
  'PanelBottom': PanelBottom,
  'PanelTop': PanelTop,
};

type Category = typeof categories[0];
type ChildCategory = typeof categories[0]['children'][0];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<number[]>([]);

  const getIcon = (iconName: string | null) => {
    if (!iconName) return Home;
    return iconMap[iconName] || Home;
  };

  const toggleMobileCategory = (id: number) => {
    setMobileExpanded(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleMegaMenuEnter = () => {
    setMegaMenuOpen(true);
    if (!activeCategory) {
      setActiveCategory(categories[0]);
    }
  };

  const handleMegaMenuLeave = () => {
    setMegaMenuOpen(false);
    setActiveCategory(null);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white">
      {/* Top bar */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span>🎉 تخفیف ویژه تا ۵۰٪ برای کامپوننت‌های منتخب</span>
          </div>
          <Link href="/admin" className="flex items-center gap-1 hover:text-white transition-colors">
            <Settings className="w-3.5 h-3.5" />
            پنل مدیریت
          </Link>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold">کد مارکت</span>
              <span className="text-xs text-slate-400 block -mt-1">کامپوننت‌های آماده برای توسعه‌دهندگان</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/" className="px-4 py-2 text-sm font-medium hover:text-primary-400 transition-colors">
              خانه
            </Link>
            
            {/* Mega Menu Trigger */}
            <div 
              className="relative"
              onMouseEnter={handleMegaMenuEnter}
              onMouseLeave={handleMegaMenuLeave}
            >
              <button className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors ${megaMenuOpen ? 'text-primary-400' : 'hover:text-primary-400'}`}>
                دسته‌بندی‌ها
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Menu Dropdown */}
              {megaMenuOpen && (
                <div className="absolute top-full right-0 pt-4">
                  <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-100 overflow-hidden w-[800px]">
                    <div className="flex">
                      
                      {/* Categories List - Right Side */}
                      <div className="w-64 bg-slate-50 p-3 border-l border-slate-100 max-h-[500px] overflow-y-auto">
                        <div className="text-xs text-slate-400 font-medium px-3 mb-2">صفحات وب‌سایت</div>
                        
                        {categories.map(cat => {
                          const Icon = getIcon(cat.icon);
                          const isActive = activeCategory?.id === cat.id;
                          
                          return (
                            <div
                              key={cat.id}
                              onMouseEnter={() => setActiveCategory(cat)}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                                isActive 
                                  ? 'bg-white shadow-sm' 
                                  : 'hover:bg-white/50'
                              }`}
                            >
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                                isActive ? 'bg-primary-100' : 'bg-slate-100'
                              }`}>
                                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-primary-600' : 'text-slate-500'}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={`font-medium text-sm transition-colors ${isActive ? 'text-primary-600' : 'text-slate-700'}`}>
                                  {cat.name}
                                </div>
                                <div className="text-xs text-slate-400">{cat.products_count} کامپوننت</div>
                              </div>
                              <ChevronLeft className={`w-4 h-4 transition-colors ${isActive ? 'text-primary-600' : 'text-slate-300'}`} />
                            </div>
                          );
                        })}

                        {/* View All Link */}
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <Link 
                            href="/components" 
                            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium text-sm transition-colors"
                          >
                            مشاهده همه کامپوننت‌ها
                            <ChevronLeft className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>

                      {/* Subcategories - Left Side */}
                      <div className="flex-1 p-6">
                        {activeCategory && (
                          <>
                            {/* Category Header */}
                            <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
                              <div>
                                <Link 
                                  href={`/components?page=${activeCategory.slug}`}
                                  className="text-xl font-bold text-slate-900 hover:text-primary-600 transition-colors"
                                >
                                  کامپوننت‌های {activeCategory.name}
                                </Link>
                                <p className="text-sm text-slate-500 mt-1">
                                  {activeCategory.products_count} کامپوننت آماده استفاده
                                </p>
                              </div>
                              <Link
                                href={`/components?page=${activeCategory.slug}`}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                              >
                                مشاهده همه
                                <ChevronLeft className="w-4 h-4" />
                              </Link>
                            </div>

                            {/* Subcategories Grid */}
                            <div className="grid grid-cols-2 gap-2">
                              {activeCategory.children.map(child => (
                                <Link
                                  key={child.id}
                                  href={`/components?type=${child.slug}`}
                                  className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all group"
                                >
                                  <div>
                                    <div className="font-medium text-slate-800 group-hover:text-primary-600 transition-colors">
                                      {child.name}
                                    </div>
                                    <div className="text-xs text-slate-400 mt-0.5">
                                      {child.products_count} نمونه
                                    </div>
                                  </div>
                                  <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-primary-600 transition-colors" />
                                </Link>
                              ))}
                            </div>

                            {/* Quick Links */}
                            <div className="mt-6 pt-4 border-t border-slate-100">
                              <div className="text-xs text-slate-400 mb-3">فیلتر سریع</div>
                              <div className="flex flex-wrap gap-2">
                                <Link 
                                  href={`/components?page=${activeCategory.slug}&sort=popular`}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-primary-100 hover:text-primary-700 text-slate-600 rounded-lg text-xs font-medium transition-colors"
                                >
                                  🔥 پرفروش‌ترین‌ها
                                </Link>
                                <Link 
                                  href={`/components?page=${activeCategory.slug}&sort=newest`}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-primary-100 hover:text-primary-700 text-slate-600 rounded-lg text-xs font-medium transition-colors"
                                >
                                  ✨ جدیدترین‌ها
                                </Link>
                                <Link 
                                  href={`/components?page=${activeCategory.slug}&tech=react`}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-primary-100 hover:text-primary-700 text-slate-600 rounded-lg text-xs font-medium transition-colors"
                                >
                                  ⚛️ React
                                </Link>
                                <Link 
                                  href={`/components?page=${activeCategory.slug}&tech=vue`}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-primary-100 hover:text-primary-700 text-slate-600 rounded-lg text-xs font-medium transition-colors"
                                >
                                  💚 Vue
                                </Link>
                                <Link 
                                  href={`/components?page=${activeCategory.slug}&tech=vanilla`}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-primary-100 hover:text-primary-700 text-slate-600 rounded-lg text-xs font-medium transition-colors"
                                >
                                  🟨 Vanilla JS
                                </Link>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Bottom Banner */}
                    <div className="bg-gradient-to-l from-primary-500 to-emerald-500 px-6 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white">
                        <span className="text-lg">🎁</span>
                        <span className="font-medium">تخفیف ویژه!</span>
                        <span className="text-primary-100">با کد DEVELOPER تا ۳۰٪ تخفیف بگیرید</span>
                      </div>
                      <Link 
                        href="/components?is_featured=true"
                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                      >
                        مشاهده
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/components" className="px-4 py-2 text-sm font-medium hover:text-primary-400 transition-colors">
              همه کامپوننت‌ها
            </Link>

            <Link href="/components?is_featured=true" className="px-4 py-2 text-sm font-medium hover:text-primary-400 transition-colors">
              ویژه‌ها
            </Link>

            <Link href="/components?sort=popular" className="px-4 py-2 text-sm font-medium hover:text-primary-400 transition-colors">
              پرفروش‌ها
            </Link>
          </nav>

          {/* Search Button - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <Link 
              href="/components" 
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              جستجوی کامپوننت...
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900 max-h-[80vh] overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-4">
            
            {/* Search - Mobile */}
            <Link 
              href="/components"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 bg-slate-800 px-4 py-3 rounded-xl mb-4"
            >
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-slate-400">جستجوی کامپوننت...</span>
            </Link>

            {/* Main Links */}
            <Link 
              href="/" 
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-xl hover:bg-slate-800 font-medium"
            >
              خانه
            </Link>
            <Link 
              href="/components" 
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-xl hover:bg-slate-800 font-medium"
            >
              همه کامپوننت‌ها
            </Link>
            <Link 
              href="/components?is_featured=true" 
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-xl hover:bg-slate-800 font-medium"
            >
              کامپوننت‌های ویژه ⭐
            </Link>
            <Link 
              href="/components?sort=popular" 
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-xl hover:bg-slate-800 font-medium"
            >
              پرفروش‌ترین‌ها 🔥
            </Link>

            {/* Categories */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="px-4 py-2 text-xs text-slate-500 font-medium">صفحات وب‌سایت</div>
              
              {categories.map(cat => {
                const Icon = getIcon(cat.icon);
                const isExpanded = mobileExpanded.includes(cat.id);
                const hasChildren = cat.children && cat.children.length > 0;

                return (
                  <div key={cat.id} className="mb-1">
                    <div className="flex items-center">
                      <Link
                        href={`/components?page=${cat.slug}`}
                        onClick={() => setMenuOpen(false)}
                        className="flex-1 flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-xl transition-colors"
                      >
                        <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="flex-1">
                          <div className="text-slate-200 font-medium">{cat.name}</div>
                          <div className="text-xs text-slate-500">{cat.products_count} کامپوننت</div>
                        </div>
                      </Link>
                      
                      {hasChildren && (
                        <button
                          onClick={() => toggleMobileCategory(cat.id)}
                          className="p-3 hover:bg-slate-800 rounded-xl transition-colors"
                        >
                          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>

                    {/* Children - Animated */}
                    {hasChildren && isExpanded && (
                      <div className="mr-6 pr-4 border-r-2 border-slate-800 mt-1 mb-2 space-y-1">
                        {cat.children.map(child => (
                          <Link
                            key={child.id}
                            href={`/components?type=${child.slug}`}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <span>{child.name}</span>
                            <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-md text-slate-500">
                              {child.products_count}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Tech Filter - Mobile */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="px-4 py-2 text-xs text-slate-500 font-medium">فیلتر بر اساس تکنولوژی</div>
              <div className="flex flex-wrap gap-2 px-4 mt-2">
                <Link
                  href="/components?tech=react"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
                >
                  ⚛️ React
                </Link>
                <Link
                  href="/components?tech=vue"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
                >
                  💚 Vue
                </Link>
                <Link
                  href="/components?tech=vanilla"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
                >
                  🟨 Vanilla JS
                </Link>
                <Link
                  href="/components?tech=tailwind"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
                >
                  🎨 Tailwind
                </Link>
              </div>
            </div>

            {/* Promo Banner - Mobile */}
            <div className="mt-4 p-4 bg-gradient-to-l from-primary-600 to-emerald-600 rounded-xl">
              <div className="flex items-center gap-2 text-white mb-2">
                <span className="text-xl">🎁</span>
                <span className="font-bold">تخفیف ویژه!</span>
              </div>
              <p className="text-primary-100 text-sm mb-3">با کد DEVELOPER تا ۳۰٪ تخفیف بگیرید</p>
              <Link
                href="/components?is_featured=true"
                onClick={() => setMenuOpen(false)}
                className="block w-full bg-white/20 hover:bg-white/30 text-white text-center py-2 rounded-lg text-sm font-medium transition-colors"
              >
                مشاهده کامپوننت‌های ویژه
              </Link>
            </div>

            {/* Admin Link */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <Link 
                href="/admin" 
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                <Settings className="w-5 h-5" />
                <div>
                  <div className="font-medium">پنل مدیریت</div>
                  <div className="text-xs text-slate-500">مدیریت کامپوننت‌ها و دسته‌بندی‌ها</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}