import { Metadata } from "next";
import { AuthGuard } from "../_components/guards";



export const metadata: Metadata = {
  title: "پروفایل | فرانت فارست",
  description: "پروفایل کاربری شما",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard requireComplete={false}>{children}</AuthGuard>;
}
