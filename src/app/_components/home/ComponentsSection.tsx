// components/home/ComponentsSection.tsx

"use client";

import Link from "next/link";
import {
  HiChevronLeft,
  HiTrendingUp,
  HiSparkles,
  HiGift,
} from "react-icons/hi";
import ComponentCard from "../ui/ComponentCard";
import { Component } from "@/types";

interface ComponentsSectionProps {
  title: string;
  subtitle: string;
  components: Component[];
  href: string;
  variant: "featured" | "newest" | "free";
}

const variantConfig = {
  featured: {
    icon: HiTrendingUp,
    gradient: "from-yellow-400 to-orange-500",
    shadow: "shadow-orange-500/25",
    bg: "bg-gradient-to-b from-gray-50 to-white",
    buttonBg: "bg-white",
    buttonText: "text-gray-700",
  },
  newest: {
    icon: HiSparkles,
    gradient: "from-blue-500 to-indigo-500",
    shadow: "shadow-blue-500/25",
    bg: "bg-white",
    buttonBg: "bg-white",
    buttonText: "text-gray-700",
  },
  free: {
    icon: HiGift,
    gradient: "from-emerald-500 to-green-500",
    shadow: "shadow-emerald-500/25",
    bg: "bg-gradient-to-b from-emerald-50 to-white",
    buttonBg: "bg-emerald-500",
    buttonText: "text-white",
  },
};

export default function ComponentsSection({
  title,
  subtitle,
  components,
  href,
  variant,
}: ComponentsSectionProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <section className={`py-20 ${config.bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 bg-gradient-to-br ${config.gradient} rounded-2xl flex items-center justify-center shadow-lg ${config.shadow}`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
              <p className="text-gray-500">{subtitle}</p>
            </div>
          </div>

          <Link
            href={href}
            className={`hidden sm:flex items-center gap-2 px-5 py-2.5 ${config.buttonBg} rounded-xl border border-gray-200 ${config.buttonText} font-medium hover:shadow-lg transition-all`}
          >
            مشاهده همه
            <HiChevronLeft className="w-5 h-5" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {components.map((component) => (
            <ComponentCard
              key={component.id}
              component={component}
            //   initialIsFavorite={component.is_favorite}
            //   initialInCart={component.in_cart}
            />
          ))}
        </div>

        {/* Mobile Link */}
        <div className="sm:hidden mt-8 text-center">
          <Link
            href={href}
            className={`inline-flex items-center gap-2 px-6 py-3 ${config.buttonBg} rounded-xl ${config.buttonText} font-medium`}
          >
            مشاهده همه
            <HiChevronLeft className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}