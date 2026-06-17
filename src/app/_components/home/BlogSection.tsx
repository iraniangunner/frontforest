// app/(public)/_components/home/BlogSection.tsx
"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useRef, useState } from "react";
import { HiChevronRight, HiChevronLeft } from "react-icons/hi";
import PostsCard from "@/app/_components/posts/PostsCard";
import type { Post } from "@/types";

interface Props {
  posts: Post[];
}

export default function BlogSection({ posts }: Props) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [showArrows, setShowArrows] = useState(false);
  const [isBegin, setIsBegin] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  if (!posts.length) return null;

  const checkArrows = (swiper: SwiperType) => {
    const w = window.innerWidth;
    const perView = w >= 1280 ? 4 : w >= 1024 ? 3 : w >= 640 ? 2 : 1;
    setShowArrows(posts.length > perView);
    setIsBegin(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <section dir="rtl" className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <span className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-600 to-purple-400 flex-shrink-0" />
            <h2 className="text-[17px] font-bold text-gray-900">
              آخرین مقالات
            </h2>
          </div>
          <Link
            href="/posts"
            className="text-[13px] font-semibold text-violet-600 hover:opacity-70 transition-opacity"
          >
            همه مقالات ←
          </Link>
        </div>

        {/* Slider */}
        <div className="relative">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="قبلی"
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10
              w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md
              items-center justify-center hover:border-violet-400 transition-all
              ${showArrows && !isBegin ? "flex" : "hidden"}`}
          >
            <HiChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="بعدی"
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10
              w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md
              items-center justify-center hover:border-violet-400 transition-all
              ${showArrows && !isEnd ? "flex" : "hidden"}`}
          >
            <HiChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="overflow-hidden" style={{ minHeight: "320px" }}>
            <Swiper
              dir="rtl"
              key="rtl"
              modules={[Navigation]}
              spaceBetween={16}
              grabCursor
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              className="pb-2"
              style={{ visibility: "hidden" }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                setTimeout(() => checkArrows(swiper), 0);
              }}
              onInit={(swiper) => {
                swiper.el.style.visibility = "visible";
              }}
              onSlideChange={(swiper) => {
                setIsBegin(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              onBreakpoint={(swiper) => checkArrows(swiper)}
            >
              {posts.map((post) => (
                <SwiperSlide key={post.id} style={{ height: "auto" }}>
                  <PostsCard post={post} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
