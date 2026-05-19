// components/home/Footer.tsx
import Link from "next/link";
import { Home, ShoppingBag, Info, Phone, Heart } from "lucide-react";
import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "خانه", icon: Home },
  { href: "/products", label: "محصولات", icon: ShoppingBag },
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
    name: "Telegram",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.19 13.68l-2.965-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.963.879z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
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
      {/* خط بالا */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />

      {/* پترن پس‌زمینه */}
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
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
          {/* ستون اول — برند */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <Image
                src="/images/petra-logo.png" // ← فایل رو بذار توی public/logo.png
                alt="فانتوم پلاس"
                width={120}
                height={40}
                className="w-auto object-contain"
                priority
              />
              <span className="text-xl font-bold text-white">
                نمایندگی انحصاری فانتوم پلاس در ایران
              </span>
            </Link>

            <p className="text-gray-400 leading-relaxed text-sm">
              ارائه بهترین محصولات با کیفیت بالا و قیمت مناسب. رضایت شما اولویت
              ماست.
            </p>

            {/* شبکه‌های اجتماعی */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="group relative w-10 h-10 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 hover:border-teal-500/50 flex items-center justify-center transition-all duration-300"
                  aria-label={social.name}
                >
                  <span className="text-gray-400 group-hover:text-teal-400 transition-colors">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* ستون دوم — دسترسی سریع */}
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
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gray-800/50 group-hover:bg-teal-500/10 border border-gray-700/50 group-hover:border-teal-500/30 flex items-center justify-center transition-all">
                      <Icon className="w-4 h-4 text-gray-500 group-hover:text-teal-400 transition-colors" />
                    </div>
                    <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* ستون سوم — اطلاعات تماس */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg">اطلاعات تماس</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <HiPhone className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">شماره تماس</p>
                  <p className="text-sm text-gray-300 font-mono" dir="ltr">
                    021-22252875
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <HiMail className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">ایمیل</p>
                  <p className="text-sm text-gray-300" dir="ltr">
                    info@pmk-co.com
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <HiLocationMarker className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">آدرس</p>
                  <p className="text-sm text-gray-300">تهران، ...</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* بار پایین */}
        <div className="mt-12 pt-8 border-t border-gray-800/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              ©️ ۱۴۰۵ نمایندگی انحصاری فانتوم پلاس در ایران. تمامی حقوق محفوظ
              است.
            </p>

            <div className="flex items-center gap-1 text-sm text-gray-500">
              ساخته شده با <Heart className="w-4 h-4 text-red-500 mx-1" /> در
              ایران
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
