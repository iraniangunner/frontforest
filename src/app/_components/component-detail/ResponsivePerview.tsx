// components/ResponsivePreview.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  HiDesktopComputer,
  HiDeviceTablet,
  HiDeviceMobile,
  HiExternalLink,
  HiRefresh,
  HiArrowsExpand,
  HiX,
  HiCode,
} from "react-icons/hi";

type DeviceSize = "desktop" | "tablet" | "mobile";

interface DeviceOption {
  id: DeviceSize;
  label: string;
  icon: React.ElementType;
  width: number;
}

const deviceOptions: DeviceOption[] = [
  { id: "desktop", label: "دسکتاپ", icon: HiDesktopComputer, width: 1200 },
  { id: "tablet", label: "تبلت", icon: HiDeviceTablet, width: 768 },
  { id: "mobile", label: "موبایل", icon: HiDeviceMobile, width: 375 },
];

interface ResponsivePreviewProps {
  previewUrl?: string | null;
  thumbnail?: string | null;
  title: string;
  slug?: string;
}

export function ResponsivePreview({
  previewUrl,
  thumbnail,
  title,
  slug,
}: ResponsivePreviewProps) {
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [activeDevice, setActiveDevice] = useState<DeviceSize>("desktop");
  const [iframeKey, setIframeKey] = useState(0);
  const [scale, setScale] = useState(1);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);

  const currentDevice = deviceOptions.find((d) => d.id === activeDevice)!;
  const browserUrl = previewUrl || (slug ? `frontforest.ir/preview/${slug}` : "preview");

  // Calculate scale for fullscreen responsive view
  useEffect(() => {
    if (!showFullscreen) return;

    const calculateScale = () => {
      if (fullscreenContainerRef.current) {
        const containerWidth = fullscreenContainerRef.current.offsetWidth - 64;
        const containerHeight = fullscreenContainerRef.current.offsetHeight - 64;
        const deviceWidth = currentDevice.width;
        const deviceHeight = 500;

        const scaleX = containerWidth / deviceWidth;
        const scaleY = containerHeight / deviceHeight;
        const newScale = Math.min(1, scaleX, scaleY);
        setScale(newScale);
      }
    };

    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, [showFullscreen, currentDevice.width]);

  const handleRefreshPreview = () => {
    setIframeKey((prev) => prev + 1);
  };

  return (
    <>
      {/* Normal Preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-xs text-gray-500 font-mono mr-2 truncate max-w-[200px]">
              {browserUrl}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshPreview}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="بارگذاری مجدد"
            >
              <HiRefresh className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowFullscreen(true)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="نمایش ریسپانسیو"
            >
              <HiArrowsExpand className="w-5 h-5" />
            </button>

            {previewUrl && (
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="باز کردن در تب جدید"
              >
                <HiExternalLink className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        {/* Normal Preview Content */}
        <div className="relative bg-gray-50">
          {previewUrl ? (
            <iframe
              key={iframeKey}
              src={previewUrl}
              className="w-full bg-white"
              style={{ height: "450px" }}
              title={title}
            />
          ) : thumbnail ? (
            <div className="relative" style={{ height: "300px" }}>
              <Image
                src={thumbnail}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-[450px] bg-gray-50">
              <div className="text-center">
                <HiCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">پیش‌نمایش در دسترس نیست</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Responsive Preview Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95" dir="rtl">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-10">
            {/* Device Selector */}
            <div className="flex items-center gap-1 p-1 bg-white/10 backdrop-blur-sm rounded-xl">
              {deviceOptions.map((device) => (
                <button
                  key={device.id}
                  onClick={() => setActiveDevice(device.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeDevice === device.id
                      ? "bg-white text-gray-900"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <device.icon className="w-4 h-4" />
                  <span>{device.label}</span>
                </button>
              ))}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowFullscreen(false)}
              className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>

          {/* Responsive Preview - Scaled */}
          <div 
            ref={fullscreenContainerRef}
            className="absolute inset-0 flex items-center justify-center pt-20 pb-16 px-8"
          >
            <div
              className="bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300"
              style={{
                width: `${currentDevice.width}px`,
                transform: `scale(${scale})`,
                transformOrigin: "center center",
              }}
            >
              {/* Browser Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-b">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white rounded-md px-3 py-1.5 text-xs text-gray-500 font-mono truncate border">
                    {browserUrl}
                  </div>
                </div>
              </div>

              {/* Preview Content */}
              {previewUrl ? (
                <iframe
                  key={`fullscreen-${iframeKey}`}
                  src={previewUrl}
                  className="w-full bg-white"
                  style={{ height: "450px" }}
                  title={title}
                />
              ) : thumbnail ? (
                <div className="relative" style={{ height: "300px" }}>
                  <Image
                    src={thumbnail}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-[450px] bg-gray-50">
                  <div className="text-center">
                    <HiCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">پیش‌نمایش در دسترس نیست</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Size Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-full">
              {currentDevice.label} — {currentDevice.width}px
            </div>
          </div>
        </div>
      )}
    </>
  );
}