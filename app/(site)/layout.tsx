import { TopBar } from "@/components/layout/top-bar";
import { SiteFooter } from "@/components/layout/site-footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <TopBar showBeta showNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
