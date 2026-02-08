// components/home/HeroSection.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiSearch, HiCode } from "react-icons/hi";
import { Zap, Palette, Layout } from "lucide-react";

const floatingIcons = [
  { Icon: Layout, color: "text-teal-500", delay: "0s" },
  { Icon: Palette, color: "text-emerald-500", delay: "0.5s" },
  { Icon: Zap, color: "text-blue-500", delay: "1s" },
  { Icon: HiCode, color: "text-purple-500", delay: "1.5s" },
];

export default function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/components?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-teal-50/30 min-h-[85vh] sm:min-h-[90vh] flex items-center">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-gradient-to-bl from-teal-400/30 via-emerald-300/20 to-transparent rounded-full blur-3xl animate-pulse-slow -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-to-tr from-blue-400/30 via-cyan-300/20 to-transparent rounded-full blur-3xl animate-pulse-slow translate-y-1/2 -translate-x-1/3 animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse-slow -translate-x-1/2 -translate-y-1/2 animation-delay-4000" />
        
        {/* Floating Icons */}
        {floatingIcons.map((item, index) => (
          <div
            key={index}
            className="absolute animate-float"
            style={{
              top: `${20 + index * 20}%`,
              left: `${10 + index * 20}%`,
              animationDelay: item.delay,
              opacity: 0.1,
            }}
          >
            <item.Icon className={`w-16 h-16 ${item.color}`} />
          </div>
        ))}
      </div>

      {/* Animated Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 w-full">
        {/* Hero Content */}
        <div className="text-center max-w-5xl mx-auto px-2 sm:px-0">
          {/* Enhanced Title with Staggered Animation */}
          <h1
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight mb-6 sm:mb-8 transform transition-all duration-700 delay-100 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="inline-block">کامپوننت‌های </span>
            <span className="relative inline-block group">
              <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-green-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                حرفه‌ای
              </span>
              {/* Animated Underline */}
              <svg
                className="absolute -bottom-2 left-0 w-full h-4"
                viewBox="0 0 200 12"
                fill="none"
              >
                <path
                  d="M2 10C50 4 150 4 198 10"
                  stroke="url(#hero-gradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="animate-draw"
                />
                <defs>
                  <linearGradient id="hero-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Sparkle Effect */}
              <div className="absolute -top-2 -right-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
            </span>
            <br />
            <span className="inline-block mt-2">برای پروژه‌های شما</span>
          </h1>

          {/* Enhanced Subtitle */}
          <p
            className={`text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto font-medium transform transition-all duration-700 delay-200 px-4 sm:px-0 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            مجموعه‌ای از کامپوننت‌های{" "}
            <span className="text-teal-600 font-bold">آماده</span> و{" "}
            <span className="text-emerald-600 font-bold">زیبا</span> برای ساخت
            سریع‌تر وب‌سایت‌ها و اپلیکیشن‌های مدرن
          </p>

          {/* Enhanced Search Box */}
          <form
            onSubmit={handleSearch}
            className={`max-w-3xl mx-auto mb-8 sm:mb-12 px-2 sm:px-0 transform transition-all duration-700 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 rounded-xl sm:rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 group-focus-within:opacity-40 transition-opacity duration-500" />
              
              {/* Search Input Container */}
              <div className="relative flex items-center bg-white rounded-xl sm:rounded-2xl shadow-2xl shadow-gray-300/50 border-2 border-gray-100 group-hover:border-teal-200 group-focus-within:border-teal-300 transition-all overflow-hidden">
                <div className="pr-4 pl-3 sm:pr-6 sm:pl-4">
                  <HiSearch className="w-5 h-5 sm:w-7 sm:h-7 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی کامپوننت..."
                  className="flex-1 py-4 px-2 sm:py-6 text-gray-700 placeholder-gray-400 focus:outline-none text-base sm:text-lg"
                />
                <button
                  type="submit"
                  className="m-1.5 px-4 py-3 sm:m-2 sm:px-10 sm:py-4 bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 text-white font-bold rounded-lg sm:rounded-xl hover:from-teal-600 hover:via-emerald-600 hover:to-green-600 active:scale-95 transition-all shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 flex items-center gap-2 group/btn"
                >
                  <span className="hidden sm:inline">جستجو</span>
                  <HiSearch className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Enhanced Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
            className="drop-shadow-lg"
          />
        </svg>
      </div>

      {/* Custom Animations CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.2;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes draw {
          from {
            stroke-dasharray: 200;
            stroke-dashoffset: 200;
          }
          to {
            stroke-dasharray: 200;
            stroke-dashoffset: 0;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

        .animate-draw {
          animation: draw 2s ease-out forwards;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}