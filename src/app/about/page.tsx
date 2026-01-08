// app/about/page.tsx

import Link from "next/link";

export const metadata = {
  title: "درباره ما | فرانت فارست",
  description: "با فرانت فارست آشنا شوید - مرجع کامپوننت‌های آماده فرانت‌اند",
};

const values = [
  {
    title: "کیفیت",
    description:
      "تمام کامپوننت‌ها با بالاترین استانداردهای کدنویسی توسعه داده می‌شوند.",
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
    title: "سرعت",
    description:
      "کامپوننت‌های بهینه‌سازی شده برای بهترین عملکرد و سرعت بارگذاری.",
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
    description: "تیم پشتیبانی ما همیشه آماده پاسخگویی به سوالات شماست.",
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
    title: "به‌روزرسانی",
    description:
      "کامپوننت‌ها به صورت مداوم با آخرین تکنولوژی‌ها به‌روز می‌شوند.",
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
    <div className="bg-white" dir="rtl">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-700 ring-1 ring-inset ring-teal-600/20 mb-6">
              درباره ما
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              درباره فرانت فارست
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              ما با هدف ساده‌سازی فرآیند توسعه وب، مجموعه‌ای از کامپوننت‌های
              آماده و حرفه‌ای را برای توسعه‌دهندگان فراهم کرده‌ایم.
            </p>
          </div>
        </div>

        {/* Decorative blob */}
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-teal-200 to-emerald-200 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </div>

      {/* Mission Section */}
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700 ring-1 ring-inset ring-teal-600/20 mb-4">
            ماموریت
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            ماموریت ما
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            در فرانت فارست، ما معتقدیم که توسعه‌دهندگان باید بیشتر وقت خود را
            صرف خلق ویژگی‌های جدید کنند، نه بازنویسی کامپوننت‌های تکراری.
          </p>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            به همین دلیل، مجموعه‌ای از کامپوننت‌های آماده، تست شده و
            بهینه‌سازی شده را ارائه می‌دهیم که می‌توانید به راحتی در پروژه‌های
            خود استفاده کنید.
          </p>
          <div className="mt-8">
            <Link
              href="/components"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 transition-colors"
            >
              مشاهده کامپوننت‌ها
              <svg
                className="w-4 h-4 rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700 ring-1 ring-inset ring-teal-600/20 mb-4">
              ارزش‌ها
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              ارزش‌های ما
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              اصولی که ما را در مسیر توسعه محصولات باکیفیت هدایت می‌کنند.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl lg:max-w-none">
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="group bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-100 hover:shadow-md hover:ring-teal-100 transition-all"
                >
                  <dt className="flex flex-col items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-100 transition-colors">
                      {value.icon}
                    </div>
                    <span className="text-lg font-semibold text-gray-900">
                      {value.title}
                    </span>
                  </dt>
                  <dd className="mt-2 text-gray-600 leading-7">
                    {value.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative isolate overflow-hidden bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              آماده شروع هستید؟
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              همین حالا کامپوننت‌های ما را بررسی کنید و پروژه خود را سریع‌تر
              توسعه دهید.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href="/components"
                className="rounded-xl bg-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-400 transition-colors"
              >
                مشاهده کامپوننت‌ها
              </Link>
              <Link
                href="/contact"
                className="rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
              >
                تماس با ما
              </Link>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <svg
          className="absolute left-1/2 top-0 -z-10 h-[42rem] w-[82rem] -translate-x-1/2 stroke-white/10 [mask-image:radial-gradient(closest-side,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="pattern"
              width={200}
              height={200}
              x="50%"
              y={0}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#pattern)"
          />
        </svg>
      </div>
    </div>
  );
}