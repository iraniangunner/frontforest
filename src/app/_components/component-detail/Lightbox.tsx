"use client";

import Image from "next/image";
import { HiX, HiChevronRight, HiChevronLeft } from "react-icons/hi";

interface LightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  title: string;
}

export function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onIndexChange,
  title,
}: LightboxProps) {
  if (!isOpen) return null;

  const nextImage = () => {
    onIndexChange((currentIndex + 1) % images.length);
  };

  const prevImage = () => {
    onIndexChange((currentIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 left-4 p-2 text-white/70 hover:text-white"
      >
        <HiX className="w-8 h-8" />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute right-4 p-2 text-white/70 hover:text-white"
          >
            <HiChevronRight className="w-10 h-10" />
          </button>
          <button
            onClick={nextImage}
            className="absolute left-4 p-2 text-white/70 hover:text-white"
          >
            <HiChevronLeft className="w-10 h-10" />
          </button>
        </>
      )}

      <div className="relative w-full max-w-5xl h-[80vh] mx-4">
        <Image
          src={images[currentIndex]}
          alt={title}
          fill
          className="object-contain"
        />
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}