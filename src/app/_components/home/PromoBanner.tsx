// app/(public)/_components/home/PromoBanner.tsx
// بنر تبلیغاتی فاخر برای صفحه‌ی اصلی. سرور کامپوننت، بدون منطق.
import Link from "next/link";

interface Props {
  /** خط بالای تیتر (eyebrow) */
  eyebrow?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  href: string;
  /** دکمه‌ی دوم اختیاری */
  secondaryText?: string;
  secondaryHref?: string;
}

export default function PromoBanner({
  eyebrow = "فروشگاه پترا",
  title,
  subtitle,
  ctaText,
  href,
  secondaryText,
  secondaryHref,
}: Props) {
  return (
    <section dir="rtl" className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-bl from-[#A72F3B] via-[#86262F] to-[#641C23] shadow-xl shadow-[#A72F3B]/20">
        {/* ── لایه‌های تزئینی پس‌زمینه ── */}
        {/* هاله‌های رنگی */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 20%, #C9A227 0, transparent 38%), radial-gradient(circle at 90% 90%, #DCACB1 0, transparent 42%)",
          }}
        />
        {/* الگوی نقطه‌چین ظریف */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative grid grid-cols-1 items-center gap-8 px-7 py-12 sm:px-12 sm:py-14 lg:grid-cols-2 lg:gap-4 lg:py-16">
          {/* ── متن (راست در RTL) ── */}
          <div className="max-w-lg">
            {/* eyebrow طلایی */}
            <div className="mb-4 flex items-center gap-3">
              <span aria-hidden className="block h-px w-8 bg-[#F4B740]/80" />
              <span className="text-[12px] font-medium tracking-[0.3em] text-[#F4B740]">
                {eyebrow}
              </span>
            </div>

            <h2 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl sm:leading-[1.2]">
              {title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/80 sm:text-base sm:leading-8">
              {subtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={href}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#A72F3B] shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 hover:bg-[#F6EAEB]"
              >
                {ctaText}
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

              {secondaryText && secondaryHref && (
                <Link
                  href={secondaryHref}
                  className="rounded-full px-6 py-3.5 text-sm font-semibold text-white ring-1 ring-inset ring-white/35 transition-colors hover:bg-white/10"
                >
                  {secondaryText}
                </Link>
              )}
            </div>
          </div>

          {/* ── المان بصری (چپ در RTL) — فقط دسکتاپ ── */}
          <div className="relative hidden h-full min-h-[180px] lg:block">
            {/* حلقه‌های هم‌مرکز + الماس */}
            <svg
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 text-white/[0.13]"
              viewBox="0 0 320 320"
              fill="none"
            >
              <circle
                cx="160"
                cy="160"
                r="150"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle
                cx="160"
                cy="160"
                r="110"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle
                cx="160"
                cy="160"
                r="70"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              {/* الماس مرکزی طلایی */}
              <path
                d="M160 95 L210 160 L160 225 L110 160 Z"
                stroke="#F4B740"
                strokeWidth="2"
                opacity="0.55"
              />
              <path
                d="M160 120 L188 160 L160 200 L132 160 Z"
                fill="#F4B740"
                opacity="0.15"
              />
            </svg>
            {/* درخشش‌های کوچک طلایی */}
            <svg
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2"
              viewBox="0 0 320 320"
              fill="#F4B740"
            >
              <circle cx="160" cy="10" r="2.5" opacity="0.7" />
              <circle cx="310" cy="160" r="2.5" opacity="0.7" />
              <circle cx="160" cy="310" r="2.5" opacity="0.7" />
              <circle cx="10" cy="160" r="2.5" opacity="0.7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
