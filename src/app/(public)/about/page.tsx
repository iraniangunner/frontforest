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

const values = [
  {
    title: "اصالت کالا",
    description:
      "تمامی محصولات دارای گارانتی اصالت و مستقیماً از کارخانه تامین می‌شوند.",
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
    title: "ارسال سریع",
    description:
      "ارسال به سراسر کشور با پست پیشتاز و تیپاکس در کمترین زمان ممکن.",
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
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
    ),
  },
  {
    title: "پشتیبانی",
    description: "تیم پشتیبانی ما آماده پاسخگویی به سوالات و رفع مشکلات شماست.",
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
  {
    title: "گارانتی",
    description: "تمامی محصولات دارای گارانتی معتبر و خدمات پس از فروش هستند.",
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
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
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
        {/* Hero */}
        <div className="relative isolate overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center rounded-full bg-[#F6EAEB] px-4 py-1.5 text-sm font-medium text-[#A72F3B] ring-1 ring-inset ring-[#A72F3B]/20 mb-6">
                درباره ما
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-[#242424] sm:text-5xl">
                فروشگاه پترا
              </h1>
              <p className="mt-6 text-lg leading-8 text-[#656565]">
                ما با افتخار بهترین محصولات را با گارانتی اصالت و خدمات پس از
                فروش معتبر ارائه می‌دهیم.
              </p>
            </div>
          </div>

          {/* Decorative blob — maroon */}
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#DCACB1] to-[#F6EAEB] opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>

        {/* Mission */}
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-[#F6EAEB] px-3 py-1 text-sm font-medium text-[#A72F3B] ring-1 ring-inset ring-[#A72F3B]/20 mb-4">
              ماموریت
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-[#242424] sm:text-4xl">
              ماموریت ما
            </h2>
            <p className="mt-6 text-lg leading-8 text-[#656565]">
              ماموریت ما ارائه محصولات اصل با بالاترین کیفیت، قیمت مناسب و خدمات
              پس از فروش قابل اطمینان است.
            </p>
            <p className="mt-4 text-lg leading-8 text-[#656565]">
              ما متعهدیم که تجربه خرید آسان، امن و رضایت‌بخشی را برای مشتریان
              سراسر ایران فراهم کنیم و با ارسال سریع و گارانتی معتبر، اعتماد شما
              را جلب کنیم.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="bg-[#FAFAFA] py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center rounded-full bg-[#F6EAEB] px-3 py-1 text-sm font-medium text-[#A72F3B] ring-1 ring-inset ring-[#A72F3B]/20 mb-4">
                ارزش‌ها
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-[#242424] sm:text-4xl">
                چرا ما را انتخاب کنید؟
              </h2>
              <p className="mt-4 text-lg text-[#656565]">
                اصولی که ما را در مسیر ارائه بهترین خدمات هدایت می‌کنند.
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-2xl lg:max-w-none">
              <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {values.map((value) => (
                  <div
                    key={value.title}
                    className="group bg-white rounded-2xl p-8 ring-1 ring-[#F0F0F0] hover:shadow-lg hover:shadow-[#A72F3B]/5 hover:ring-[#DCACB1] hover:-translate-y-1 transition-all duration-300"
                  >
                    <dt className="flex flex-col items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F6EAEB] text-[#A72F3B] group-hover:bg-[#A72F3B] group-hover:text-white transition-colors">
                        {value.icon}
                      </div>
                      <span className="text-lg font-semibold text-[#242424]">
                        {value.title}
                      </span>
                    </dt>
                    <dd className="mt-2 text-[#656565] leading-7">
                      {value.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
