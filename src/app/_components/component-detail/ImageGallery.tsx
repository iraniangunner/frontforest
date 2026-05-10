"use client";

import { useState } from "react";
import Image from "next/image";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { HiCube } from "react-icons/hi2";

interface ImageGalleryProps {
  thumbnail: string | null;
  images: string[] | null;
  title: string;
}

export default function ImageGallery({ thumbnail, images, title }: ImageGalleryProps) {
  const allImages = [
    ...(thumbnail ? [thumbnail] : []),
    ...(images || []),
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => setActiveIndex((i) => (i - 1 + allImages.length) % allImages.length);
  const next = () => setActiveIndex((i) => (i + 1) % allImages.length);

  if (allImages.length === 0) {
    return (
      <div className="aspect-square rounded-2xl bg-gray-100 flex items-center justify-center">
        <HiCube className="w-20 h-20 text-gray-300" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* تصویر اصلی */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
        <Image
          src={allImages[activeIndex]}
          alt={title}
          fill
          className="object-contain p-4 transition-opacity duration-200"
          priority
        />

        {allImages.length > 1 && (
          <>
            <button
              onClick={next}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:bg-white transition"
            >
              <HiChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={prev}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:bg-white transition"
            >
              <HiChevronRight className="w-5 h-5 text-gray-700" />
            </button>

            {/* شماره تصویر */}
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/40 text-white text-xs rounded-full">
              {activeIndex + 1} / {allImages.length}
            </span>
          </>
        )}
      </div>

      {/* تامبنیل‌ها */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition ${
                activeIndex === i
                  ? "border-blue-500 shadow-sm"
                  : "border-transparent hover:border-gray-200"
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
