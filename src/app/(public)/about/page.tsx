// app/about/page.tsx
import Link from "next/link";
import { HiSparkles } from "react-icons/hi";

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

const features = [
  {
    title: "اصالت کالا",
    description: "تمام محصولات اصل و دارای فاکتور رسمی و ضمانت اصالت‌اند.",
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
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
  },
  {
    title: "قیمت منصفانه",
    description: "قیمت‌گذاری شفاف و بی‌واسطه، بدون هزینه‌های اضافه.",
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
    description: "بسته‌بندی ایمن و ارسال سریع به سراسر کشور.",
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
  {
    title: "پشتیبانی همراه",
    description: "از انتخاب تا پس از خرید، کنار شما هستیم.",
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
        {/* ═══════════ Hero ═══════════ */}
        <section className="relative bg-[#FCFCFC]">
          <div className="relative overflow-hidden bg-gradient-to-b from-[#F6EAEB] to-[#FBF3F4] pb-36 pt-20 sm:pt-24">
            <div className="relative mx-auto max-w-3xl px-6 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#A72F3B] shadow-sm ring-1 ring-[#EDD5D8]">
                <HiSparkles className="h-7 w-7" />
              </div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#242424] sm:text-5xl">
                درباره ما
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#656565] sm:text-lg">
                با فروشگاه پترا و آنچه ما را متفاوت می‌کند بیشتر آشنا شوید.
              </p>
            </div>
          </div>

          {/* کارت‌های ویژگی شناور روی مرز هیرو */}
          <div className="relative z-10 mx-auto -mt-24 max-w-6xl px-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-[#F0F0F0] bg-white p-6 shadow-lg shadow-black/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-[#DCACB1] hover:shadow-xl hover:shadow-[#A72F3B]/5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F6EAEB] text-[#A72F3B]">
                    {f.icon}
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-[#242424]">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-7 text-[#656565]">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ آرمان ═══════════ */}
        <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-2 lg:gap-16">
            {/* متن */}
            <div className="flex flex-col justify-center">
              <p className="text-[13px] font-medium tracking-[0.2em] text-[#A72F3B]">
                آرمان ما
              </p>
              <h2 className="mt-4 text-2xl font-bold leading-snug tracking-tight text-[#242424] sm:text-4xl sm:leading-tight">
                همراهِ یک انتخاب خوب،
                <br />
                نه فقط یک فروشنده
              </h2>
              <p className="mt-6 text-base leading-8 text-[#656565] sm:text-lg sm:leading-9 text-justify">
                از لحظه‌ی سفارش تا پس از تحویل کنار شما می‌مانیم. هر محصول با
                وسواس انتخاب می‌شود، قیمت‌ها شفاف‌اند و آنچه می‌خرید دقیقاً همان
                است که می‌بینید — بی‌واسطه، با فاکتور رسمی و ضمانت اصالت.
              </p>

              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
                <div>
                  <p className="text-2xl font-bold text-[#A72F3B]">۱۰۰٪</p>
                  <p className="mt-0.5 text-sm text-[#898989]">
                    اصالت و فاکتور
                  </p>
                </div>
                <span aria-hidden className="w-px self-stretch bg-[#F0F0F0]" />
                <div>
                  <p className="text-2xl font-bold text-[#A72F3B]">۷ روز</p>
                  <p className="mt-0.5 text-sm text-[#898989]">ضمانت بازگشت</p>
                </div>
                <span aria-hidden className="w-px self-stretch bg-[#F0F0F0]" />
                <div>
                  <p className="text-2xl font-bold text-[#A72F3B]">۲۴/۷</p>
                  <p className="mt-0.5 text-sm text-[#898989]">
                    پشتیبانی همراه
                  </p>
                </div>
              </div>
            </div>

            {/* پنل گرافیکی */}
            <div className="relative min-h-[300px] overflow-hidden rounded-3xl bg-gradient-to-br from-[#A72F3B] to-[#641C23] p-10">
              <div
                aria-hidden
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 20%, #C9A227 0, transparent 45%), radial-gradient(circle at 80% 85%, #DCACB1 0, transparent 40%)",
                }}
              />
              {/* نقش هندسی ظریف */}
              <svg
                aria-hidden
                className="absolute inset-0 h-full w-full text-white/10"
                viewBox="0 0 400 400"
                fill="none"
                preserveAspectRatio="xMidYMid slice"
              >
                <circle
                  cx="200"
                  cy="200"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="160"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
              {/* نقل‌قول روی پنل */}
              <div className="relative flex h-full flex-col justify-end">
                <span
                  aria-hidden
                  className="text-6xl font-serif leading-none text-[#F4B740]"
                >
                  ”
                </span>
                <p className="mt-2 text-xl font-medium leading-9 text-white sm:text-2xl">
                  کیفیت برای ما شعار نیست؛ تعهد است.
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <span
                    aria-hidden
                    className="block h-px w-8 bg-[#F4B740]/70"
                  />
                  <span className="text-[13px] font-medium tracking-[0.2em] text-[#F4B740]">
                    تیم پترا
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ کارت‌های ناوبری ═══════════ */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* محصولات */}
            <Link
              href="/search"
              className="group relative overflow-hidden rounded-3xl bg-[#A72F3B] p-8 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#A72F3B]/15 sm:p-10"
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 80% 20%, #C9A227 0, transparent 45%)",
                }}
              />
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-white">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                </div>
                <h3 className="mt-5 text-xl font-bold text-white">
                  مشاهده محصولات
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-7 text-white/75">
                  مجموعه‌ی متنوع پترا را ببینید و چیزی را پیدا کنید که مناسب
                  شماست.
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                  همین حالا ببینید
                  <svg
                    className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* تماس */}
            <Link
              href="/contact"
              className="group relative overflow-hidden rounded-3xl border border-[#F0F0F0] bg-white p-8 transition-all hover:-translate-y-1 hover:border-[#DCACB1] hover:shadow-xl hover:shadow-[#A72F3B]/5 sm:p-10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F6EAEB] text-[#A72F3B]">
                <svg
                  className="h-6 w-6"
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
              </div>
              <h3 className="mt-5 text-xl font-bold text-[#242424]">
                تماس با ما
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-7 text-[#656565]">
                سوالی دارید؟ تیم پشتیبانی پترا آماده‌ی راهنمایی و پاسخ به شماست.
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#A72F3B]">
                با ما حرف بزنید
                <svg
                  className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </span>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
