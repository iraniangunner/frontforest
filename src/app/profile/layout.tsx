import { AuthGuard } from "../_components/guards";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
