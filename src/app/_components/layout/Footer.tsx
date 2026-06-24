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

const contactInfo = [
  {
    icon: HiPhone,
    label: "شماره تماس",
    value: "021-22252875",
    href: "tel:02122252875",
    ltr: true,
    mono: true,
  },
  {
    icon: HiMail,
    label: "ایمیل",
    value: "info@petra.pmk-co.com",
    href: "mailto:info@petra.pmk-co.com",
    ltr: true,
  },
  {
    icon: HiLocationMarker,
    label: "آدرس",
    value: (
      <>
        تهران — میرداماد، میدان مادر، خیابان سنجابی
        <br />
        کوچه شریفی، پلاک ۶ واحد ۲
      </>
    ),
  },
];

export default function Footer() {
  return (
    <footer
      className="relative bg-[#1C1F2A] text-[#9CA3B4] overflow-hidden"
      dir="rtl"
    >
      {/* نوار مارونی بالای فوتر */}
      <div className="h-1 w-full bg-gradient-to-l from-[#641C23] via-[#A72F3B] to-[#641C23]" />

      {/* هاله‌ی مارونی تزئینی */}
      <div className="absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-[#A72F3B]/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8">
          {/* ستون برند */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link href="/" aria-label="صفحه اصلی فروشگاه پترا" className="block">
              <Image
                src="/images/petra-logo.png"
                alt="فروشگاه پترا"
                width={130}
                height={44}
                className="object-contain"
                priority
              />
            </Link>
            <span className="text-lg font-bold text-white">فروشگاه پترا</span>
            <p className="text-[#8B92A3] leading-relaxed text-sm max-w-xs">
              ارائه بهترین محصولات با کیفیت بالا و قیمت مناسب. رضایت شما اولویت
              ماست.
            </p>
          </div>

          {/* ستون دسترسی سریع */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            <h3 className="text-white font-bold relative inline-block pb-2">
              دسترسی سریع
              <span className="absolute right-0 bottom-0 w-10 h-0.5 rounded-full bg-[#A72F3B]" />
            </h3>
            <nav className="flex flex-col gap-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center gap-3 py-2 text-sm text-[#9CA3B4] hover:text-white transition-colors"
                  >
                    <Icon className="w-4 h-4 text-[#5E6678] group-hover:text-[#DCACB1] transition-colors" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* ستون اطلاعات تماس */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <h3 className="text-white font-bold relative inline-block pb-2">
              اطلاعات تماس
              <span className="absolute right-0 bottom-0 w-10 h-0.5 rounded-full bg-[#A72F3B]" />
            </h3>
            <div className="flex flex-col gap-3">
              {contactInfo.map((c, idx) => {
                const Icon = c.icon;
                const inner = (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-[#A72F3B]/15 group-hover:bg-[#A72F3B] flex items-center justify-center flex-shrink-0 transition-colors">
                      <Icon className="w-4 h-4 text-[#DCACB1] group-hover:text-white transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#5E6678] mb-0.5">{c.label}</p>
                      <p
                        className={`text-sm text-[#C3C9D6] group-hover:text-white transition-colors leading-relaxed ${
                          c.mono ? "font-mono" : ""
                        }`}
                        dir={c.ltr ? "ltr" : undefined}
                        style={c.ltr ? { textAlign: "right" } : undefined}
                      >
                        {c.value}
                      </p>
                    </div>
                  </>
                );
                return c.href ? (
                  <a key={idx} href={c.href} className="group flex items-start gap-3">
                    {inner}
                  </a>
                ) : (
                  <div key={idx} className="group flex items-start gap-3">
                    {inner}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* بار پایین */}
        <div className="mt-12 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#6B7385]">
              © ۱۴۰۵ فروشگاه پترا. تمامی حقوق محفوظ است.
            </p>
            <div
              className="bg-white rounded-lg p-1.5"
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
