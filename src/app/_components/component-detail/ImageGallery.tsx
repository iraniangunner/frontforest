"use client";

// app/_components/ui/ImageGallery.tsx
import { useState, useCallback } from "react";
import Image from "next/image";
import { HiChevronLeft, HiChevronRight, HiZoomIn, HiX } from "react-icons/hi";
import { HiCube } from "react-icons/hi2";

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

  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const prev = useCallback(
    () => setActive((i) => (i - 1 + allImages.length) % allImages.length),
    [allImages.length],
  );

  const next = useCallback(
    () => setActive((i) => (i + 1) % allImages.length),
    [allImages.length],
  );

  // keyboard navigation توی lightbox
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") next();
    if (e.key === "ArrowRight") prev();
    if (e.key === "Escape") setLightbox(false);
  };

  if (allImages.length === 0) {
    return (
      <div className="aspect-square rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center gap-3">
        <HiCube className="w-20 h-20 text-gray-200" />
        <p className="text-sm text-gray-300">تصویری موجود نیست</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3" dir="ltr">
        {/* ── تصویر اصلی ── */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group">
          <Image
            src={allImages[active]}
            alt={`${title} - تصویر ${active + 1}`}
            fill
            className="object-contain p-4 transition-all duration-300"
            priority={active === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {/* دکمه zoom */}
          <button
            onClick={() => {
              setLightbox(true);
              setZoomed(false);
            }}
            className="absolute top-3 left-3 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:shadow-md"
            title="بزرگنمایی"
          >
            <HiZoomIn className="w-4 h-4 text-gray-700" />
          </button>

          {/* ناوبری */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={next}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:shadow-md"
              >
                <HiChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={prev}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:shadow-md"
              >
                <HiChevronRight className="w-5 h-5 text-gray-700" />
              </button>

              {/* dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {allImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`rounded-full transition-all ${
                      i === active
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
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                  i === active
                    ? "border-gray-900 shadow-md scale-105"
                    : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(false)}
          onKeyDown={handleKey}
          tabIndex={0}
          role="dialog"
          aria-label="نمایش تمام صفحه تصویر"
        >
          {/* بستن */}
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 left-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-colors z-10"
          >
            <HiX className="w-5 h-5" />
          </button>

          {/* شماره تصویر */}
          <span className="absolute top-4 right-1/2 translate-x-1/2 text-white/60 text-sm">
            {active + 1} / {allImages.length}
          </span>

          {/* تصویر */}
          <div
            className={`relative transition-transform duration-200 ${
              zoomed
                ? "w-full h-full cursor-zoom-out"
                : "w-[80vw] h-[80vh] cursor-zoom-in"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setZoomed((z) => !z);
            }}
          >
            <Image
              src={allImages[active]}
              alt={title}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* ناوبری lightbox */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-colors"
              >
                <HiChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-colors"
              >
                <HiChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* تامبنیل‌ها توی lightbox */}
          {allImages.length > 1 && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
              dir="ltr"
            >
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive(i);
                  }}
                  className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    i === active
                      ? "border-white scale-110"
                      : "border-white/30 opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
