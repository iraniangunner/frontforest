// app/about/page.tsx
import Link from "next/link";

export const metadata = {
  title: "درباره ما | فروشگاه پترا",
  description: "فروشگاه پترا - ارائه محصولات با گارانتی معتبر",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/about` },
  openGraph: {
    title: "درباره ما | فروشگاه پترا",
    description: "فروشگاه پترا - ارائه محصولات با گارانتی معتبر",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/about`,
    siteName: "فروشگاه پترا",
    locale: "fa_IR",
    type: "website",
  },
};

// Schema.org JSON-LD
function AboutJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "درباره ما",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/about`,
    description: "فروشگاه پترا - ارائه محصولات اصل با گارانتی معتبر",
    mainEntity: {
      "@type": "Organization",
      name: "فروشگاه پترا",
      url: process.env.NEXT_PUBLIC_SITE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ── آمار شناور زیر هیرو ──
const heroStats = [
  {
    title: "اصالت کالا",
    description:
      "تمام محصولات اصل و دارای فاکتور رسمی و ضمانت اصالت‌اند؛ همان که می‌بینید، همان که می‌رسد.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
        />
      </svg>
    ),
  },
  {
    title: "قیمت منصفانه",
    description:
      "قیمت‌گذاری شفاف و بی‌واسطه؛ بدون واسطه‌های اضافه، منصفانه و قابل اعتماد.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "ارسال امن",
    description:
      "بسته‌بندی ایمن و بیمه‌شده، ارسال سریع با پست پیشتاز و تیپاکس به سراسر کشور.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
        />
      </svg>
    ),
  },
];

// ── ویژگی‌ها (ردیف پایین) ──
const features = [
  {
    title: "ضمانت اصالت",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
  },
  {
    title: "فاکتور رسمی",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
        />
      </svg>
    ),
  },
  {
    title: "ضمانت بازگشت ۷ روزه",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
        />
      </svg>
    ),
  },
  {
    title: "پشتیبانی همراه",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
        />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <>
      <AboutJsonLd />
      <div className="bg-white" dir="rtl">
        {/* ═══════════ Hero با نوار رنگی + کارت‌های آمار شناور ═══════════ */}
        <section className="relative">
          {/* نوار رنگی هیرو */}
          <div className="relative overflow-hidden bg-gradient-to-bl from-[#F6EAEB] via-[#FBF3F4] to-[#FAFAFA] pb-32 pt-20 sm:pt-24">
            {/* بافت محو تزئینی */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 15% 25%, #F4B740 0, transparent 30%), radial-gradient(circle at 85% 75%, #DCACB1 0, transparent 38%)",
              }}
            />
            <div className="relative mx-auto max-w-3xl px-6 text-center">
              <div className="mb-6 flex items-center justify-center gap-3">
                <span aria-hidden className="block h-px w-12 bg-[#C9A227]/60" />
                <span className="text-[13px] font-medium tracking-[0.3em] text-[#A72F3B]">
                  فروشگاه پترا
                </span>
                <span aria-hidden className="block h-px w-12 bg-[#C9A227]/60" />
              </div>
              <h1 className="text-3xl font-bold leading-tight text-[#242424] sm:text-5xl">
                زیبایی، در جزئیاتِ کوچک
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#656565] sm:text-lg">
                پترا محصولاتی را گرد هم آورده که با دقت انتخاب شده‌اند؛ باکیفیت،
                اصل و ماندگار، برای هر روزِ شما.
              </p>
            </div>
          </div>

          {/* کارت‌های آمار شناور روی مرز نوار */}
          <div className="relative z-10 mx-auto -mt-24 max-w-6xl px-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {heroStats.map((s) => (
                <div
                  key={s.title}
                  className="group rounded-2xl border border-[#F0F0F0] bg-white p-6 shadow-lg shadow-black/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-[#DCACB1] hover:shadow-xl hover:shadow-[#A72F3B]/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#F6EAEB] text-[#A72F3B] transition-colors group-hover:bg-[#A72F3B] group-hover:text-white">
                      {s.icon}
                    </div>
                    <h3 className="text-base font-bold text-[#242424]">
                      {s.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[#656565]">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ آرمان + تصویر گرافیکی ═══════════ */}
        <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
            {/* متن */}
            <div>
              <span className="text-[13px] font-medium tracking-[0.2em] text-[#A72F3B]">
                آرمان ما
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#242424] sm:text-4xl">
                خریدی که می‌توان
                <br />
                به آن اعتماد کرد
              </h2>
              <div className="mt-6 space-y-5 text-base leading-8 text-[#656565] sm:text-lg sm:leading-9">
                <p>
                  پترا را با یک هدف ساده ساختیم: جایی که خرید کردن، آسان و
                  بی‌دغدغه باشد. هر محصول پیش از آن‌که به فروشگاه راه پیدا کند،
                  به‌دقت سنجیده و انتخاب می‌شود؛ چون باور داریم کیفیت، مهم‌تر از
                  تعداد است.
                </p>
                <p>
                  قیمت‌ها شفاف‌اند و آنچه می‌خرید دقیقاً همان است که می‌بینید؛
                  بی‌واسطه، با فاکتور رسمی و ضمانت اصالت. اینجا قرار نیست بین
                  وعده و واقعیت فاصله‌ای باشد.
                </p>
                <p className="border-r-2 border-[#C9A227]/50 pr-5 font-medium text-[#242424]">
                  ما فقط فروشنده نیستیم؛ همراهِ یک انتخاب خوبیم. از لحظه‌ی سفارش
                  تا پس از تحویل، کنار شما می‌مانیم.
                </p>
              </div>
            </div>

            {/* تصویر گرافیکی (SVG تزئینی — نقش هندسی خنثی) */}
            <div className="relative">
              <div className="relative aspect-square w-full max-w-md mx-auto overflow-hidden rounded-3xl bg-gradient-to-br from-[#F6EAEB] via-[#FAFAFA] to-[#EDD5D8]">
                {/* هاله‌ی نرم مرکزی */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 50% 45%, #F4B740 0, transparent 55%)",
                  }}
                />
                {/* نقش هندسی متقارن (الماس‌گون) — خنثی نسبت به دسته‌بندی */}
                <svg
                  className="absolute inset-0 h-full w-full p-14 text-[#A72F3B]"
                  viewBox="0 0 200 200"
                  fill="none"
                  aria-hidden
                >
                  {/* لوزی بیرونی */}
                  <path
                    d="M100 20 L165 100 L100 180 L35 100 Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    opacity="0.5"
                  />
                  {/* لوزی میانی */}
                  <path
                    d="M100 52 L140 100 L100 148 L60 100 Z"
                    stroke="#C9A227"
                    strokeWidth="1.5"
                    opacity="0.8"
                  />
                  {/* مرکز */}
                  <circle
                    cx="100"
                    cy="100"
                    r="14"
                    stroke="#C9A227"
                    strokeWidth="2"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="6"
                    fill="#C9A227"
                    opacity="0.3"
                  />
                  {/* خطوط فست‌دار از مرکز */}
                  <g stroke="currentColor" strokeWidth="1" opacity="0.35">
                    <path d="M100 52 L100 20" />
                    <path d="M140 100 L165 100" />
                    <path d="M100 148 L100 180" />
                    <path d="M60 100 L35 100" />
                  </g>
                  {/* درخشش‌های کوچک */}
                  <g fill="#F4B740">
                    <circle cx="100" cy="34" r="2.2" />
                    <circle cx="152" cy="100" r="2.2" />
                    <circle cx="100" cy="166" r="2.2" />
                    <circle cx="48" cy="100" r="2.2" />
                  </g>
                </svg>
                {/* امضای برند روی تصویر */}
                <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] font-medium tracking-[0.3em] text-[#A72F3B]/70">
                  PETRA
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ نوار «در ارتباط باشید» ═══════════ */}
        <section className="bg-[#FAFAFA]">
          <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-right">
              <div>
                <h2 className="text-2xl font-bold text-[#242424] sm:text-3xl">
                  سوالی دارید؟ کنار شماییم
                </h2>
                <p className="mt-2 text-[#656565]">
                  تیم پشتیبانی پترا آماده‌ی راهنمایی و پاسخ به پرسش‌های شماست.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-[#A72F3B] px-7 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#86262F]"
              >
                تماس با ما
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 18l-6-6 6-6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════ ویژگی‌ها ═══════════ */}
        <section className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex flex-col items-center text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F6EAEB] text-[#A72F3B]">
                  {f.icon}
                </div>
                <h3 className="mt-4 text-sm font-semibold text-[#242424] sm:text-base">
                  {f.title}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ دعوت پایانی ═══════════ */}
        <section className="mx-auto max-w-7xl px-6 pb-20 sm:pb-28 lg:px-8">
          <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-bl from-[#A72F3B] to-[#641C23] px-6 py-14 text-center sm:px-16">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 30%, #C9A227 0, transparent 40%), radial-gradient(circle at 80% 70%, #DCACB1 0, transparent 45%)",
              }}
            />
            <h2 className="mx-auto max-w-2xl text-2xl font-bold tracking-tight text-white sm:text-4xl">
              قطعه‌ای پیدا کنید که شما را روایت کند
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/80 sm:text-lg">
              مجموعه‌ی متنوع پترا را ببینید و چیزی را پیدا کنید که مناسب شماست.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/search"
                className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#A72F3B] shadow-sm transition-colors hover:bg-[#F6EAEB]"
              >
                مشاهده محصولات
              </Link>
              <Link
                href="/contact"
                className="rounded-full px-7 py-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/40 transition-colors hover:bg-white/10"
              >
                تماس با ما
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
