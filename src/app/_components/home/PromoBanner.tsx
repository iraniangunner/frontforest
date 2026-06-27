// app/(public)/_components/home/PromoBanner.tsx
// بنر تبلیغاتی جذاب بین ردیف‌های محصول. سرور کامپوننت، بدون منطق.
import Link from "next/link";

interface Props {
  title: string;
  subtitle: string;
  ctaText: string;
  href: string;
}

export default function PromoBanner({ title, subtitle, ctaText, href }: Props) {
  return (
    <section dir="rtl" className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-bl from-[#A72F3B] via-[#86262F] to-[#641C23] px-6 py-12 sm:px-14 sm:py-16">
        {/* هاله‌های رنگی محو */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, #C9A227 0, transparent 42%), radial-gradient(circle at 88% 80%, #DCACB1 0, transparent 45%)",
          }}
        />

        {/* حلقه‌های تزئینی گوشه */}
        <div
          aria-hidden
          className="absolute -left-16 -top-20 h-64 w-64 rounded-full border border-white/10"
        />
        <div
          aria-hidden
          className="absolute -left-4 -top-8 h-40 w-40 rounded-full border border-white/10"
        />

        {/* نقش الماس‌گون سمت چپ (تزئینی) */}
        <svg
          aria-hidden
          className="pointer-events-none absolute -left-8 top-1/2 hidden h-56 w-56 -translate-y-1/2 text-white/[0.07] sm:block"
          viewBox="0 0 200 200"
          fill="none"
        >
          <path
            d="M100 10 L180 100 L100 190 L20 100 Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M100 45 L145 100 L100 155 L55 100 Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle
            cx="100"
            cy="100"
            r="18"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>

        <div className="relative max-w-xl">
          {/* امضای طلایی */}
          <div className="mb-4 flex items-center gap-3">
            <span aria-hidden className="block h-px w-8 bg-[#F4B740]/70" />
            <span className="text-[12px] font-medium tracking-[0.3em] text-[#F4B740]">
              فروشگاه پترا
            </span>
          </div>

          <h3 className="text-2xl font-bold leading-snug text-white sm:text-3xl">
            {title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-white/80 sm:text-base">
            {subtitle}
          </p>

          <Link
            href={href}
            className="group mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#A72F3B] shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 hover:bg-[#F6EAEB]"
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
        </div>
      </div>
    </section>
  );
}
