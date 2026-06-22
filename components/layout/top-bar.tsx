import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

export function TopBar({
  className,
  right,
}: {
  className?: string;
  right?: React.ReactNode;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md",
        className
      )}
    >
      <div className="container flex h-[4.25rem] items-center justify-between gap-4">
        <Logo />
        <div className="flex items-center gap-1 sm:gap-2">
          {right}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
