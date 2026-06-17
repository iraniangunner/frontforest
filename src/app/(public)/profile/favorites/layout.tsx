// app/(public)/profile/favorites/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "علاقه‌مندی‌ها | فروشگاه پترا",
  description: "محصولات مورد علاقه شما",
};

export default function ProfileFavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
