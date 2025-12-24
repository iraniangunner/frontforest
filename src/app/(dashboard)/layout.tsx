import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const c = await cookies();
  const accessToken = c.get("access_token")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  return <>{children}</>;
}