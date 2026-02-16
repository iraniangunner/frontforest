// components/home/Footer.tsx

import Link from "next/link";
import { Trees, Home, Layout, Info, Phone, ArrowRight } from "lucide-react";

const navLinks = [
  { href: "/", label: "خانه", icon: Home },
  { href: "/components", label: "کامپوننت‌ها", icon: Layout },
  { href: "/about", label: "درباره ما", icon: Info },
  { href: "/contact", label: "تماس با ما", icon: Phone },
];

const socialLinks = [
  {
    name: "Instagram",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    ),
  },
  {
    name: "Twitter",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer
      className="relative bg-gradient-to-b from-gray-900 to-gray-950 text-gray-400"
      dir="rtl"
    >
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255 255 255) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* 2 Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Right Column - Brand & Description */}
          <div className="space-y-6">
            {/* Brand */}
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/30 transition-all duration-300 group-hover:scale-105">
                <Trees className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-white">فرانت</span>
                <span className="text-2xl font-bold text-emerald-400">
                  فارست
                </span>
              </div>
            </Link>

            <p className="text-gray-400 leading-relaxed max-w-md">
              مرجع کامپوننت‌های Next JS و Tailwind CSS برای توسعه‌دهندگان
              ایرانی. ساخت وب را ساده‌تر، سریع‌تر و حرفه‌ای‌تر کنید.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="group relative w-11 h-11 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-emerald-500/50 flex items-center justify-center transition-all duration-300 overflow-hidden"
                  aria-label={social.name}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all duration-300" />
                  <span className="relative text-gray-400 group-hover:text-emerald-400 transition-colors">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Left Column - Navigation */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg">دسترسی سریع</h3>
            <nav className="grid grid-cols-2 gap-3">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800/50 border border-transparent hover:border-gray-700/50 transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-800/50 group-hover:bg-gradient-to-br group-hover:from-emerald-500/10 group-hover:to-teal-500/10 border border-gray-700/50 group-hover:border-emerald-500/30 flex items-center justify-center transition-all duration-300">
                      <Icon className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © ۱۴۰۴ فرانت‌فارست. تمامی حقوق محفوظ است.
            </p>
            <div
              dangerouslySetInnerHTML={{
                __html: `
     <a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=707060&Code=3MblfhiXonk6BPuPWPHu76fxKqnICiMR'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=707060&Code=3MblfhiXonk6BPuPWPHu76fxKqnICiMR' alt='' style='cursor:pointer' code='3MblfhiXonk6BPuPWPHu76fxKqnICiMR'></a>
    `,
              }}
            />
            {/* <div className="flex items-center gap-6 text-sm">
              <Link href="/terms" className="text-gray-500 hover:text-emerald-400 transition-colors">
                قوانین و مقررات
              </Link>
              <Link href="/privacy" className="text-gray-500 hover:text-emerald-400 transition-colors">
                حریم خصوصی
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
