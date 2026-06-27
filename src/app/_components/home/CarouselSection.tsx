import Link from "next/link";
import { SwiperCarousel } from "../ui/SwiperCarousel";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Props {
  title: string;

  endpoint: string;

  href: string;

  linkText?: string;
}

async function getItems(endpoint: string) {
  const res = await fetch(`${API}/${endpoint}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return { data: [] };
  return res.json();
}

export default async function CarouselSection({
  title,
  endpoint,
  href,
  linkText = "مشاهده همه",
}: Props) {
  const data = await getItems(endpoint);
  const items = data?.data ?? [];

  if (!items.length) return null;

  return (
    <section dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* سرتیتر */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="w-1 h-5 bg-[#A72F3B] rounded-full" />
            <h2 className="text-lg font-semibold text-[#242424]">{title}</h2>
          </div>
          <Link
            href={href}
            className="group inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium text-[#A72F3B] bg-[#F6EAEB] hover:bg-[#EDD5D8] rounded-full transition-colors"
          >
            {linkText}
            <svg
              className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5"
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

        <SwiperCarousel products={items} />
      </div>
    </section>
  );
}
