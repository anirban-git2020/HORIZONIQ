import { IntelligenceBackground } from "@/components/layout/intelligence-background";
import { TopBar } from "@/components/layout/top-bar";
import { StepProgress } from "@/components/onboarding/step-progress";
import { FadeIn } from "@/components/motion/fade-in";

export function OnboardingShell({
  step,
  title,
  subtitle,
  children,
  footer,
}: {
  step: 1 | 2 | 3;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh">
      <IntelligenceBackground variant="subtle" />
      <div className="relative">
        <TopBar />
        <main className="container max-w-4xl py-12 md:py-16 lg:py-20">
          <FadeIn>
            <div className="mb-10 flex justify-center">
              <StepProgress current={step} />
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="mb-10 text-center md:mb-12">
              <p className="label-caps mb-3 text-primary/80">
                Step {step} of 3
              </p>
              <h1 className="display-title text-3xl md:text-4xl">{title}</h1>
              <p className="body-lg mx-auto mt-4 max-w-xl text-balance">
                {subtitle}
              </p>
            </div>
          </FadeIn>

          {children}

          <FadeIn delay={0.16}>
            <div className="mt-12 flex items-center justify-between gap-4 border-t border-border/50 pt-8">
              {footer}
            </div>
          </FadeIn>
        </main>
      </div>
    </div>
  );
}
