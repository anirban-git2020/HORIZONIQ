import { AccountMenu } from "@/components/auth/account-menu";
import { Logo } from "@/components/brand/logo";
import { SiteNav } from "@/components/layout/site-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

export function TopBar({
  className,
  right,
  showBeta = false,
  showNav = false,
}: {
  className?: string;
  right?: React.ReactNode;
  showBeta?: boolean;
  showNav?: boolean;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-sm hairline-top",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4 md:h-[4.25rem]">
        <Logo showBeta={showBeta} />
        {showNav && (
          <div className="relative flex flex-1 justify-end md:justify-center">
            <SiteNav />
          </div>
        )}
        <div className="flex items-center gap-1 sm:gap-2">
          {right}
          <AccountMenu />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
