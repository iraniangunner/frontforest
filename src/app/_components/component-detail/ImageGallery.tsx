"use client";

import { useState } from "react";
import Image from "next/image";
import { HiExternalLink } from "react-icons/hi";
import { Component } from "@/types";
import { Lightbox } from "./Lightbox";

interface ImageGalleryProps {
  component: Component;
}

export function ImageGallery({ component }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    component.thumbnail
  );
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const getAllImages = () => {
    const images: string[] = [];
    if (component.thumbnail) images.push(component.thumbnail);
    // if (component.images) images.push(...component.images);
    return images;
  };

  const allImages = getAllImages();

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      {/* Main Image */}
      <div
        className="relative aspect-video bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-zoom-in"
        onClick={() => openLightbox(allImages.indexOf(selectedImage || ""))}
      >
        {selectedImage ? (
          <Image
            src={selectedImage}
            alt={component.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-gray-400">بدون تصویر</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {component.is_free && (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              رایگان
            </span>
          )}
          {component.is_on_sale && !component.is_free && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {component.discount_percent}% تخفیف
            </span>
          )}
          {component.is_new && (
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              جدید
            </span>
          )}
          {component.is_featured && (
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              ویژه
            </span>
          )}
        </div>

        {/* Preview Button */}
        {component.preview_url && (
          <a
            href={component.preview_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:bg-white transition-colors"
          >
            <HiExternalLink className="w-5 h-5" />
            پیش‌نمایش زنده
          </a>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={`relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                selectedImage === image
                  ? "border-blue-600 ring-2 ring-blue-200"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <Image
                src={image}
                alt={`${component.title} - ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        images={allImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setLightboxIndex}
        title={component.title}
      />
    </>
  );
}