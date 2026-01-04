// components/ResponsivePreview.tsx

"use client";

import { useState } from "react";
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

export default function ResponsivePreview({
  previewUrl,
  thumbnail,
  title,
  slug,
}: ResponsivePreviewProps) {
  const [activeDevice, setActiveDevice] = useState<DeviceSize>("desktop");
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const currentDevice = deviceOptions.find((d) => d.id === activeDevice)!;
  const browserUrl = previewUrl || (slug ? `frontforest.ir/preview/${slug}` : "preview");

  const handleRefreshPreview = () => {
    setIframeKey((prev) => prev + 1);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 bg-gray-50">
          {/* Device Selector */}
          <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-gray-200">
            {deviceOptions.map((device) => (
              <button
                key={device.id}
                onClick={() => setActiveDevice(device.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeDevice === device.id
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <device.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{device.label}</span>
              </button>
            ))}
          </div>

          {/* Actions */}
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
              title="تمام صفحه"
            >
              <HiArrowsExpand className="w-5 h-5" />
            </button>

            {previewUrl && (
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <HiExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">باز کردن</span>
              </a>
            )}
          </div>
        </div>

        {/* Preview Frame */}
        <div className="relative bg-[#f8f9fa] overflow-x-auto">
          {/* Checkered Background */}
          <div
            className="absolute inset-0 opacity-50 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #e5e7eb 25%, transparent 25%),
                linear-gradient(-45deg, #e5e7eb 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #e5e7eb 75%),
                linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)
              `,
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
            }}
          />

          {/* Content */}
          <div
            className="relative flex justify-center py-8 px-4 min-h-[500px]"
            style={{ minWidth: `${currentDevice.width + 32}px` }}
          >
            <div
              className="relative bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ease-out"
              style={{
                width: `${currentDevice.width}px`,
                minWidth: `${currentDevice.width}px`,
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

          {/* Device Size Indicator */}
          <div
            className="sticky bottom-4 left-0 right-0 flex justify-center pointer-events-none"
            style={{ minWidth: `${currentDevice.width + 32}px` }}
          >
            <div className="px-3 py-1.5 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-medium rounded-full">
              {currentDevice.label} — {currentDevice.width}px
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm" dir="rtl">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-gradient-to-b from-black/50 to-transparent z-10">
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

          {/* Preview */}
          <div className="absolute inset-0 flex items-center justify-center p-8 pt-24 pb-16 overflow-auto">
            <div
              className="bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300"
              style={{
                width: `${currentDevice.width}px`,
                minWidth: `${currentDevice.width}px`,
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

              {/* Content */}
              {previewUrl ? (
                <iframe
                  key={`fullscreen-${iframeKey}`}
                  src={previewUrl}
                  className="w-full"
                  style={{ height: "70vh" }}
                  title={title}
                />
              ) : thumbnail ? (
                <div className="relative" style={{ height: "70vh" }}>
                  <Image
                    src={thumbnail}
                    alt={title}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center bg-gray-50" style={{ height: "70vh" }}>
                  <p className="text-gray-500">پیش‌نمایش در دسترس نیست</p>
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