// components/[slug]/components/DeviceSelector.tsx

"use client";

import {
  HiDesktopComputer,
  HiDeviceTablet,
  HiDeviceMobile,
} from "react-icons/hi";

type DeviceSize = "desktop" | "tablet" | "mobile";

interface DeviceOption {
  id: DeviceSize;
  label: string;
  icon: React.ElementType;
  width: number;
}

export const deviceOptions: DeviceOption[] = [
  { id: "desktop", label: "دسکتاپ", icon: HiDesktopComputer, width: 1200 },
  { id: "tablet", label: "تبلت", icon: HiDeviceTablet, width: 768 },
  { id: "mobile", label: "موبایل", icon: HiDeviceMobile, width: 375 },
];

interface DeviceSelectorProps {
  activeDevice: DeviceSize;
  onDeviceChange: (device: DeviceSize) => void;
  variant?: "light" | "dark";
}

export default function DeviceSelector({
  activeDevice,
  onDeviceChange,
  variant = "light",
}: DeviceSelectorProps) {
  if (variant === "dark") {
    return (
      <div className="flex items-center gap-1 p-1 bg-white/10 backdrop-blur-sm rounded-xl">
        {deviceOptions.map((device) => (
          <button
            key={device.id}
            onClick={() => onDeviceChange(device.id)}
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
    );
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-gray-200">
      {deviceOptions.map((device) => (
        <button
          key={device.id}
          onClick={() => onDeviceChange(device.id)}
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
  );
}
