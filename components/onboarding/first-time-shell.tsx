import { TopBar } from "@/components/layout/top-bar";
import { FadeIn } from "@/components/motion/fade-in";

export function FirstTimeShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh bg-background">
      <TopBar />
      <main className="container flex min-h-[calc(100dvh-4rem)] max-w-2xl flex-col justify-center py-12 md:py-16">
        <FadeIn>{children}</FadeIn>
        {footer && (
          <FadeIn delay={0.12}>
            <div className="mt-10 border-t border-border/50 pt-8">{footer}</div>
          </FadeIn>
        )}
      </main>
    </div>
  );
}
