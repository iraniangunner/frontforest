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

        {/* ═══════════ تعهدنامه (واژه‌نامه‌ای) ═══════════ */}
        <section className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
          <div className="mb-14 max-w-xl">
            <p className="text-[13px] font-medium tracking-[0.25em] text-[#A72F3B]">
              چرا پترا
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-[1.25] tracking-tight text-[#242424] sm:text-[2.75rem] sm:leading-[1.2]">
              سه چیز که هیچ‌وقت
              <br className="hidden sm:block" /> سرش معامله نمی‌کنیم
            </h2>
          </div>

          <dl className="divide-y divide-[#F0F0F0] border-y border-[#F0F0F0]">
            {[
              {
                term: "اصالت",
                en: "Authenticity",
                desc: "هر محصول اصل است و با فاکتور رسمی و ضمانت اصالت به دست شما می‌رسد. همان که می‌بینید، همان که می‌رسد.",
              },
              {
                term: "شفافیت",
                en: "Transparency",
                desc: "قیمت‌گذاری بی‌واسطه و روشن؛ بدون هزینه‌ی پنهان و بدون فاصله بین آنچه می‌گوییم و آنچه می‌فروشیم.",
              },
              {
                term: "همراهی",
                en: "Support",
                desc: "از لحظه‌ی انتخاب تا پس از خرید کنار شماییم. پشتیبانی واقعی، نه فقط یک شماره‌ی تماس.",
              },
            ].map((row) => (
              <div
                key={row.term}
                className="group grid grid-cols-1 gap-3 py-8 sm:grid-cols-12 sm:gap-8 sm:py-10"
              >
                <div className="sm:col-span-4">
                  <h3 className="text-2xl font-bold tracking-tight text-[#242424] transition-colors group-hover:text-[#A72F3B] sm:text-3xl">
                    {row.term}
                  </h3>
                  <span className="mt-1 block text-xs font-medium uppercase tracking-[0.2em] text-[#C9A227]">
                    {row.en}
                  </span>
                </div>
                <dd className="text-base leading-8 text-[#656565] sm:col-span-8 sm:pt-1.5 sm:text-lg sm:leading-9">
                  {row.desc}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ═══════════ دعوت پایانی ═══════════ */}
        <section className="mx-auto max-w-4xl px-6 pb-24">
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-bl from-[#A72F3B] via-[#86262F] to-[#641C23] px-8 py-16 sm:px-14 sm:py-20">
            {/* بافت تزئینی */}
            <div
              aria-hidden
              className="absolute inset-0 -z-10 opacity-25"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 15% 20%, #C9A227 0, transparent 42%), radial-gradient(circle at 88% 85%, #DCACB1 0, transparent 45%)",
              }}
            />
            {/* حلقه‌ی بزرگ تزئینی */}
            <div
              aria-hidden
              className="absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-white/10"
            />

            <div className="relative max-w-lg">
              <span className="text-[12px] font-medium tracking-[0.3em] text-[#F4B740]">
                پترا، در یک قدمی شما
              </span>
              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-[2.5rem] sm:leading-[1.15]">
                چیزی را پیدا کنید
                <br /> که مناسب شماست
              </h2>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href="/search"
                  className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#A72F3B] shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 hover:bg-[#F6EAEB]"
                >
                  مشاهده محصولات
                </Link>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-1.5 rounded-full px-7 py-3.5 text-sm font-semibold text-white ring-1 ring-inset ring-white/40 transition-colors hover:bg-white/10"
                >
                  تماس با ما
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
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
