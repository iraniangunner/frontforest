// components/home/Footer.tsx
import Link from "next/link";
import { Home, Info, Phone, NewspaperIcon } from "lucide-react";
import { HiLocationMarker, HiMail, HiPhone } from "react-icons/hi";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "خانه", icon: Home },
  { href: "/posts", label: "اخبار و مقالات", icon: NewspaperIcon },
  { href: "/about", label: "درباره ما", icon: Info },
  { href: "/contact", label: "تماس با ما", icon: Phone },
];

export default function Footer() {
  return (
    <footer
      className="relative bg-gradient-to-b from-gray-900 to-gray-950 text-gray-400"
      dir="rtl"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />

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
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16 items-start">
          {/* ستون اول — برند */}
          <div className="flex flex-col gap-4">
            <Link href="/" aria-label="صفحه اصلی فانتوم پلاس" className="block">
              <Image
                src="/images/petra-logo.png"
                alt="فروشگاه پترا"
                width={120}
                height={40}
                className="object-contain"
                priority
              />
            </Link>
            <span className="text-lg font-bold text-white">فروشگاه پترا</span>
            <p className="text-gray-400 leading-relaxed text-sm">
              ارائه بهترین محصولات با کیفیت بالا و قیمت مناسب. رضایت شما اولویت
              ماست.
            </p>
          </div>

          {/* ستون دوم — دسترسی سریع */}
          <div className="flex flex-col gap-4">
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
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-bold text-lg">اطلاعات تماس</h3>
            <div className="flex flex-col gap-4">
              <a
                href="tel:02122252875"
                className="flex items-start gap-3 group p-3"
              >
                <div className="w-9 h-9 rounded-lg bg-gray-800/50 border border-gray-700/50 group-hover:border-teal-500/50 flex items-center justify-center flex-shrink-0 transition-colors">
                  <HiPhone className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">شماره تماس</p>
                  <p
                    className="text-sm text-gray-300 group-hover:text-teal-400 transition-colors font-mono"
                    dir="ltr"
                  >
                    021-22252875
                  </p>
                </div>
              </a>
              <a
                href="mailto:info@petra.pmk-co.com"
                className="flex items-start gap-3 group p-3"
              >
                <div className="w-9 h-9 rounded-lg bg-gray-800/50 border border-gray-700/50 group-hover:border-teal-500/50 flex items-center justify-center flex-shrink-0 transition-colors">
                  <HiMail className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">ایمیل</p>
                  <p
                    className="text-sm text-gray-300 group-hover:text-teal-400 transition-colors"
                    dir="ltr"
                  >
                    info@petra.pmk-co.com
                  </p>
                </div>
              </a>
              <div className="flex items-start gap-3 group p-3">
                <div className="w-9 h-9 rounded-lg bg-gray-800/50 border border-gray-700/50 group-hover:border-teal-500/50 flex items-center justify-center flex-shrink-0 transition-colors">
                  <HiLocationMarker className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">آدرس</p>
                  <p className="text-sm text-gray-300 group-hover:text-teal-400 transition-colors">
                    تهران — میرداماد میدان مادر خیابان سنجابی کوچه شریفی پلاک ۶
                    واحد ۲
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* بار پایین */}
        <div className="mt-12 pt-8 border-t border-gray-800/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © ۱۴۰۵ فروشگاه پترا. تمامی حقوق محفوظ است.
            </p>
            <div
              dangerouslySetInnerHTML={{
                __html: `<a referrerpolicy='origin' target='_blank' rel='noopener noreferrer' href='https://trustseal.enamad.ir/?id=6032091&Code=synYdfAw4LxI5IBm9pLxabTEg0pyNIyx'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=6032091&Code=synYdfAw4LxI5IBm9pLxabTEg0pyNIyx' alt='نماد اعتماد الکترونیکی' style='cursor:pointer' code='synYdfAw4LxI5IBm9pLxabTEg0pyNIyx'></a>`,
              }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
