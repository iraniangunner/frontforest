// app/(public)/profile/favorites/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "علاقه‌مندی‌ها | نمایندگی انحصاری فانتوم پلاس در ایران",
  description: "محصولات مورد علاقه شما",
};

export default function ProfileFavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
