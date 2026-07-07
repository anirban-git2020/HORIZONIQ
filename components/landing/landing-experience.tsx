"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { BetaBadge } from "@/components/brand/beta-badge";
import { HorizonIQWordmark } from "@/components/brand/horizoniq-wordmark";
import { GuidedTourScenes } from "@/components/landing/guided-tour-scenes";
import { LandingScene } from "@/components/landing/landing-scene";
import { OptionCard } from "@/components/onboarding/option-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { useLandingJourney } from "@/hooks/use-landing-journey";
import {
  REGIONS,
  ROLES,
  getInterestDisplayForRole,
  getInterestsForRole,
} from "@/lib/options";
import { cn } from "@/lib/utils";

type Scene = "welcome" | "name" | "role" | "region" | "interests" | "tour";

/**
 * Landing Experience (State 1) — a single cinematic surface that sequences
 * the onboarding scenes and, on completion, hands off to the Intelligence
 * Experience (State 2) at /dashboard. Holds no persistence itself; all state
 * lives in useLandingJourney.
 */
export function LandingExperience() {
  const router = useRouter();
  const {
    hydrated,
    journey,
    setDisplayName,
    setRole,
    setRegion,
    toggleInterest,
    completeTour,
  } = useLandingJourney();

  const [scene, setScene] = useState<Scene>("welcome");
  const [nameDraft, setNameDraft] = useState("");
  const redirectingRef = useRef(false);

  // Single, guarded handoff to the Intelligence Experience. Prevents a
  // double-navigation race (tour finish + this effect both firing) that
  // could leave /dashboard blank until a manual refresh.
  const goToDashboard = useCallback(() => {
    if (redirectingRef.current) return;
    redirectingRef.current = true;
    router.replace("/dashboard");
  }, [router]);

  // Returning users within the same session skip straight to Intelligence.
  useEffect(() => {
    if (hydrated && journey.tourCompleted) {
      goToDashboard();
    }
  }, [hydrated, journey.tourCompleted, goToDashboard]);

  useEffect(() => {
    if (hydrated && journey.displayName) setNameDraft(journey.displayName);
  }, [hydrated, journey.displayName]);

  const allowedInterestCount = useMemo(() => {
    if (!journey.selectedRole) return 0;
    const allowed = new Set(
      getInterestsForRole(journey.selectedRole).map((i) => i.id)
    );
    return journey.selectedInterests.filter((id) => allowed.has(id)).length;
  }, [journey.selectedRole, journey.selectedInterests]);

  if (!hydrated || journey.tourCompleted) {
    return <div className="min-h-dvh bg-background" aria-hidden />;
  }

  const commitName = () => {
    const trimmed = nameDraft.trim();
    if (!trimmed) return;
    setDisplayName(trimmed);
    setScene("role");
  };

  const finish = () => {
    completeTour();
    goToDashboard();
  };

  return (
    <AnimatePresence mode="wait">
      {scene === "welcome" && (
        <LandingScene sceneKey="welcome">
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="mb-10 flex flex-col items-center gap-4">
              <HorizonIQWordmark
                size="inherit"
                adaptive={false}
                className="text-5xl font-bold tracking-[-0.03em] md:text-7xl"
              />
              <BetaBadge />
            </div>
            <h1 className="display-title text-balance text-4xl md:text-5xl lg:text-6xl">
              Intelligence, before it becomes obvious.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              HorizonIQ turns the world&apos;s noise into a daily brief of what
              changed, why it matters, and how it connects.
            </p>
            <Button
              size="lg"
              className="mt-12 min-w-[240px] font-bold"
              onClick={() => setScene("name")}
            >
              Enter
              <ArrowRight />
            </Button>
          </div>
        </LandingScene>
      )}

      {scene === "name" && (
        <LandingScene sceneKey="name">
          <Stage
            footer={
              <>
                <BackButton onClick={() => setScene("welcome")} />
                <Button onClick={commitName} disabled={nameDraft.trim().length === 0}>
                  Continue
                  <ArrowRight />
                </Button>
              </>
            }
          >
            <div className="mx-auto w-full max-w-xl space-y-8">
              <SceneHeading
                eyebrow="Personalize"
                title="What should we call you?"
                subtitle="We'll use your first name in greetings and your Intelligence Brief."
              />
              <label className="block">
                <span className="sr-only">Your name</span>
                <input
                  type="text"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitName();
                  }}
                  placeholder="Your first name"
                  autoFocus
                  maxLength={48}
                  className="w-full rounded-xl border border-border bg-card px-5 py-4 text-lg font-medium shadow-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                />
              </label>
            </div>
          </Stage>
        </LandingScene>
      )}

      {scene === "role" && (
        <LandingScene sceneKey="role">
          <Stage
            footer={
              <>
                <BackButton onClick={() => setScene("name")} />
                <Button
                  onClick={() => setScene("region")}
                  disabled={!journey.selectedRole}
                >
                  Continue
                  <ArrowRight />
                </Button>
              </>
            }
          >
            <SceneHeading
              eyebrow={
                journey.displayName
                  ? `Nice to meet you, ${journey.displayName}`
                  : "Personalize"
              }
              title="Who are you here as?"
              subtitle="We tailor every Signal, Brief, and recommendation to your goals."
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {ROLES.map((role) => (
                <OptionCard
                  key={role.id}
                  icon={role.icon}
                  label={role.label}
                  tagline={role.tagline}
                  description={role.description}
                  selected={journey.selectedRole === role.id}
                  onSelect={() => setRole(role.id)}
                />
              ))}
            </div>
          </Stage>
        </LandingScene>
      )}

      {scene === "region" && (
        <LandingScene sceneKey="region">
          <Stage
            footer={
              <>
                <BackButton onClick={() => setScene("role")} />
                <Button
                  onClick={() => setScene("interests")}
                  disabled={!journey.selectedRegion}
                >
                  Continue
                  <ArrowRight />
                </Button>
              </>
            }
          >
            <SceneHeading
              eyebrow="Personalize"
              title="Where are you focused?"
              subtitle="Your region shapes which shifts and opportunities surface first."
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {REGIONS.map((region) => (
                <OptionCard
                  key={region.id}
                  icon={region.icon}
                  label={region.label}
                  description={region.description}
                  selected={journey.selectedRegion === region.id}
                  onSelect={() => setRegion(region.id)}
                />
              ))}
            </div>
          </Stage>
        </LandingScene>
      )}

      {scene === "interests" && journey.selectedRole && (
        <LandingScene sceneKey="interests">
          <Stage
            footer={
              <>
                <BackButton onClick={() => setScene("region")} />
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {allowedInterestCount} selected
                  </span>
                  <Button
                    onClick={() => setScene("tour")}
                    disabled={allowedInterestCount === 0}
                  >
                    Continue
                    <ArrowRight />
                  </Button>
                </div>
              </>
            }
          >
            <SceneHeading
              eyebrow="Personalize"
              title="What should we track for you?"
              subtitle="Choose the areas that matter. Select at least one to shape your Brief."
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {getInterestsForRole(journey.selectedRole).map((interest) => {
                const display = getInterestDisplayForRole(
                  journey.selectedRole!,
                  interest
                );
                return (
                  <OptionCard
                    key={interest.id}
                    icon={interest.icon}
                    label={display.label}
                    description={display.description}
                    selected={journey.selectedInterests.includes(interest.id)}
                    onSelect={() => toggleInterest(interest.id)}
                  />
                );
              })}
            </div>
          </Stage>
        </LandingScene>
      )}

      {scene === "tour" && (
        <LandingScene sceneKey="tour">
          <GuidedTourScenes name={journey.displayName} onComplete={finish} />
        </LandingScene>
      )}
    </AnimatePresence>
  );
}

// —— Presentation helpers (local, no state) ————————————————————————————————

function Stage({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6">
      <div className="flex flex-1 flex-col justify-center py-16">{children}</div>
      <div className="flex items-center justify-between gap-4 pb-10">{footer}</div>
    </div>
  );
}

function SceneHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="space-y-3">
      <p className="label-caps text-primary">{eyebrow}</p>
      <h1 className="display-title text-3xl md:text-4xl">{title}</h1>
      <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant: "ghost", size: "md" }))}
      onClick={onClick}
    >
      <ArrowLeft />
      Back
    </button>
  );
}
