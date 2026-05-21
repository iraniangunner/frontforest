import { Metadata } from "next";
import { AuthGuard } from "@/app/_components/guards";



export const metadata: Metadata = {
  title: "پروفایل | نمایندگی انحصاری فانتوم پلاس در ایران",
  description: "پروفایل کاربری شما",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard requireComplete={false}>{children}</AuthGuard>;
}
