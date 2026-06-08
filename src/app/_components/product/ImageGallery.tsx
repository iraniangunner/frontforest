"use client";

// app/_components/ui/ImageGallery.tsx
import { useState, useRef } from "react";
import Image from "next/image";
import { HiZoomIn, HiX, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { HiCube } from "react-icons/hi2";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, FreeMode, Keyboard } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";


interface Props {
  thumbnail: string | null;
  images: string[] | null;
  title: string;
}

export default function ImageGallery({ thumbnail, images, title }: Props) {
  const allImages = [
    ...(thumbnail ? [thumbnail] : []),
    ...(images?.filter((img) => img !== thumbnail) || []),
  ];

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const mainSwiperRef = useRef<SwiperType | null>(null);
  const lightboxSwiperRef = useRef<SwiperType | null>(null);

  if (allImages.length === 0) {
    return (
      <div className="aspect-square rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center gap-3">
        <HiCube className="w-20 h-20 text-gray-200" />
        <p className="text-sm text-gray-300">تصویری موجود نیست</p>
      </div>
    );
  }

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setZoomed(false);
    setLightbox(true);
  };

  return (
    <>
      <div className="space-y-3" dir="ltr">
        {/* ── تصویر اصلی ── */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group">
          <Swiper
            modules={[Thumbs, Keyboard]}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            keyboard={{ enabled: true }}
            onSwiper={(s) => (mainSwiperRef.current = s)}
            onSlideChange={(s) => setActiveIndex(s.activeIndex)}
            className="h-full w-full"
            spaceBetween={0}
            slidesPerView={1}
          >
            {allImages.map((img, i) => (
              <SwiperSlide key={i} className="relative h-full">
                <Image
                  src={img}
                  alt={`${title} - تصویر ${i + 1}`}
                  fill
                  className="object-contain p-4"
                  priority={i === 0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* دکمه zoom */}
          <button
            onClick={() => openLightbox(activeIndex)}
            className="absolute top-3 left-3 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:shadow-md z-10"
            title="بزرگنمایی"
          >
            <HiZoomIn className="w-4 h-4 text-gray-700" />
          </button>

          {/* ناوبری */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={() => mainSwiperRef.current?.slideNext()}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:shadow-md z-10"
              >
                <HiChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => mainSwiperRef.current?.slidePrev()}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:shadow-md z-10"
              >
                <HiChevronRight className="w-5 h-5 text-gray-700" />
              </button>

              {/* dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {allImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => mainSwiperRef.current?.slideTo(i)}
                    className={`rounded-full transition-all ${
                      i === activeIndex
                        ? "w-5 h-1.5 bg-gray-800"
                        : "w-1.5 h-1.5 bg-gray-400/60 hover:bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── تامبنیل‌ها ── */}
        {allImages.length > 1 && (
          <Swiper
            modules={[Thumbs, FreeMode]}
            onSwiper={setThumbsSwiper}
            watchSlidesProgress
            freeMode
            slidesPerView="auto"
            spaceBetween={8}
            className="thumbs-swiper"
          >
            {allImages.map((img, i) => (
              <SwiperSlide
                key={i}
                style={{ width: "64px", height: "64px" }}
                className={`rounded-xl overflow-hidden border-2 transition-all cursor-pointer flex-shrink-0 ${
                  i === activeIndex
                    ? "border-gray-900 shadow-md scale-105"
                    : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                }`}
              >
                <div className="relative w-16 h-16">
                  <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          {/* بستن */}
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 left-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-colors z-10"
          >
            <HiX className="w-5 h-5" />
          </button>

          {/* شماره تصویر */}
          <span className="absolute top-4 right-1/2 translate-x-1/2 text-white/60 text-sm z-10">
            {activeIndex + 1} / {allImages.length}
          </span>

          {/* Swiper lightbox */}
          <div
            className="w-[80vw] h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Swiper
              modules={[Keyboard]}
              keyboard={{ enabled: true, onlyInViewport: false }}
              initialSlide={activeIndex}
              onSwiper={(s) => (lightboxSwiperRef.current = s)}
              onSlideChange={(s) => setActiveIndex(s.activeIndex)}
              spaceBetween={0}
              slidesPerView={1}
              className="h-full w-full"
            >
              {allImages.map((img, i) => (
                <SwiperSlide key={i} className="relative">
                  <div
                    className={`relative w-full h-full transition-transform duration-200 ${
                      zoomed ? "cursor-zoom-out scale-150" : "cursor-zoom-in scale-100"
                    }`}
                    onClick={() => setZoomed((z) => !z)}
                  >
                    <Image
                      src={img}
                      alt={title}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      priority={i === activeIndex}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* ناوبری lightbox */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); lightboxSwiperRef.current?.slideNext(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-colors z-10"
              >
                <HiChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); lightboxSwiperRef.current?.slidePrev(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-colors z-10"
              >
                <HiChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* تامبنیل‌های lightbox */}
          {allImages.length > 1 && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
              style={{ width: "min(100%, 400px)" }}
              onClick={(e) => e.stopPropagation()}
              dir="ltr"
            >
              <Swiper
                modules={[FreeMode]}
                freeMode
                slidesPerView="auto"
                spaceBetween={8}
                centeredSlides
                centeredSlidesBounds
              >
                {allImages.map((img, i) => (
                  <SwiperSlide
                    key={i}
                    style={{ width: "48px", height: "48px" }}
                    className={`rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                      i === activeIndex
                        ? "border-white scale-110"
                        : "border-white/30 opacity-50 hover:opacity-80"
                    }`}
                    onClick={() => lightboxSwiperRef.current?.slideTo(i)}
                  >
                    <div className="relative w-12 h-12">
                      <Image src={img} alt="" fill className="object-cover" sizes="48px" />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      )}
    </>
  );
}
