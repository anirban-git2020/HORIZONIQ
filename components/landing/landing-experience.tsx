"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { IntelligenceNetwork } from "@/components/landing/intelligence-network";
import { useAuth } from "@/components/auth/auth-provider";
import { SignInPanel } from "@/components/auth/sign-in-panel";
import { BetaBadge } from "@/components/brand/beta-badge";
import { HorizonIQWordmark } from "@/components/brand/horizoniq-wordmark";
import { GuidedTourScenes } from "@/components/landing/guided-tour-scenes";
import { LandingScene } from "@/components/landing/landing-scene";
import { OptionCard } from "@/components/onboarding/option-card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  consumeRestoredFlag,
  useLandingJourney,
} from "@/hooks/use-landing-journey";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  REGIONS,
  ROLES,
  getInterestDisplayForRole,
  getInterestsForRole,
} from "@/lib/options";
import { cn } from "@/lib/utils";

type Scene =
  | "welcome"
  | "signin"
  | "name"
  | "role"
  | "region"
  | "interests"
  | "save"
  | "tour";

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

  const { user, loading: authLoading } = useAuth();
  const [scene, setScene] = useState<Scene>("welcome");
  const [nameDraft, setNameDraft] = useState("");
  const [showRestored, setShowRestored] = useState(false);
  const redirectingRef = useRef(false);
  const reducedMotion = useReducedMotion();

  /** Auth prompts only make sense for someone without a session. */
  const signedOut = !authLoading && !user;

  // Cinematic welcome entrance — composed, sequential reveal. Calm, not theatrical.
  const stagger = {
    hidden: {},
    show: {
      transition: { staggerChildren: reducedMotion ? 0 : 0.12, delayChildren: 0.08 },
    },
  };
  const rise = reducedMotion
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.2 } } }
    : {
        hidden: { opacity: 0, y: 18 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: "easeOut" },
        },
      };

  // Single, guarded handoff to the Intelligence Experience. Prevents a
  // double-navigation race (tour finish + this effect both firing) that
  // could leave /dashboard blank until a manual refresh.
  const goToDashboard = useCallback(() => {
    if (redirectingRef.current) return;
    redirectingRef.current = true;
    router.replace("/dashboard");
  }, [router]);

  // Returning users skip straight to Intelligence — unless a sign-in just
  // restored this journey, in which case we show the welcome-back beat first.
  // Both checks live in one effect so the flag is consumed before any redirect
  // can fire (a second effect would race the state update and navigate away).
  useEffect(() => {
    if (!hydrated || !journey.tourCompleted || showRestored) return;
    if (consumeRestoredFlag()) {
      setShowRestored(true);
      return;
    }
    goToDashboard();
  }, [hydrated, journey.tourCompleted, showRestored, goToDashboard]);

  useEffect(() => {
    if (hydrated && journey.displayName) setNameDraft(journey.displayName);
  }, [hydrated, journey.displayName]);

  // Coming back from an auth redirect mid-onboarding (e.g. the "save" prompt)
  // would otherwise restart at welcome and lose the user's place. Runs once, at
  // hydration only, so selecting interests later never skips a scene.
  const resumedRef = useRef(false);
  useEffect(() => {
    if (!hydrated || resumedRef.current) return;
    resumedRef.current = true;
    if (journey.tourCompleted) return;
    if (
      journey.selectedRole &&
      journey.selectedRegion &&
      journey.selectedInterests.length > 0
    ) {
      setScene("tour");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const allowedInterestCount = useMemo(() => {
    if (!journey.selectedRole) return 0;
    const allowed = new Set(
      getInterestsForRole(journey.selectedRole).map((i) => i.id)
    );
    return journey.selectedInterests.filter((id) => allowed.has(id)).length;
  }, [journey.selectedRole, journey.selectedInterests]);

  // "Professional · Europe · Cloud Computing" — what the restore brought back.
  const focusSummary = useMemo(() => {
    const parts: string[] = [];
    const role = ROLES.find((r) => r.id === journey.selectedRole);
    if (role) parts.push(role.label);
    const region = REGIONS.find((r) => r.id === journey.selectedRegion);
    if (region) parts.push(region.label);
    if (journey.selectedRole) {
      const chosen = getInterestsForRole(journey.selectedRole).filter((i) =>
        journey.selectedInterests.includes(i.id)
      );
      for (const interest of chosen) {
        parts.push(
          getInterestDisplayForRole(journey.selectedRole, interest).label
        );
      }
    }
    return parts.join(" · ");
  }, [journey.selectedRole, journey.selectedRegion, journey.selectedInterests]);

  const showScenes = hydrated && !journey.tourCompleted;

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
    <div className="relative min-h-dvh bg-background">
      <IntelligenceNetwork />

      {showRestored && (
        <LandingScene sceneKey="restored">
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="label-caps text-primary">Signed in</p>
            <h1 className="display-title mt-4 text-balance text-4xl md:text-5xl">
              Welcome back{journey.displayName ? `, ${journey.displayName}` : ""}.
            </h1>
            {focusSummary && (
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Your focus is restored — {focusSummary}.
              </p>
            )}
            <Button
              size="lg"
              className="mt-10 min-w-[220px] font-bold"
              onClick={goToDashboard}
            >
              Continue
              <ArrowRight />
            </Button>
          </div>
        </LandingScene>
      )}

      {!showRestored && showScenes && (
        <AnimatePresence mode="wait">
      {scene === "welcome" && (
        <LandingScene sceneKey="welcome">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-1 flex-col items-center justify-center px-6 text-center"
          >
            <motion.div
              variants={rise}
              className="mb-8 inline-flex items-center gap-2"
            >
              <span className="relative flex h-2 w-2">
                {!reducedMotion && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
                )}
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="label-caps text-primary">Live Intelligence</span>
            </motion.div>
            <motion.div
              variants={rise}
              className="mb-10 flex flex-col items-center gap-4"
            >
              <HorizonIQWordmark
                size="inherit"
                adaptive={false}
                className="text-5xl font-bold tracking-[-0.03em] md:text-7xl"
              />
              <BetaBadge />
            </motion.div>
            <h1 className="display-title flex flex-wrap items-center justify-center gap-x-3 text-balance text-4xl md:text-5xl lg:text-6xl">
              {["Intelligence,", "before", "it", "becomes", "obvious."].map(
                (word) => (
                  <motion.span key={word} variants={rise} className="inline-block">
                    {word}
                  </motion.span>
                )
              )}
            </h1>
            <motion.p
              variants={rise}
              className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              HorizonIQ turns the world&apos;s noise into a daily brief of what
              changed, why it matters, and how it connects.
            </motion.p>
            <motion.div
              variants={rise}
              className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-muted-foreground/80"
            >
              <span className="label-caps text-muted-foreground/60">
                Synthesizing
              </span>
              {["GitHub", "arXiv", "Hacker News", "Wikimedia", "Product Hunt"].map(
                (source, i, arr) => (
                  <span key={source} className="inline-flex items-center gap-2">
                    <span className="text-foreground/70">{source}</span>
                    {i < arr.length - 1 && (
                      <span className="text-muted-foreground/40">·</span>
                    )}
                  </span>
                )
              )}
            </motion.div>
            <motion.div variants={rise}>
              <Button
                size="lg"
                className="mt-12 min-w-[240px] font-bold"
                onClick={() => setScene("name")}
              >
                Enter
                <ArrowRight />
              </Button>
            </motion.div>
            {signedOut && (
              <motion.p
                variants={rise}
                className="mt-6 text-sm text-muted-foreground"
              >
                Already set up?{" "}
                <button
                  type="button"
                  onClick={() => setScene("signin")}
                  className="rounded underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Sign in
                </button>{" "}
                to restore your focus.
              </motion.p>
            )}
          </motion.div>
        </LandingScene>
      )}

      {scene === "signin" && (
        <LandingScene sceneKey="signin">
          <Stage footer={<BackButton onClick={() => setScene("welcome")} />}>
            <div className="mx-auto w-full max-w-md space-y-8">
              <SceneHeading
                eyebrow="Welcome back"
                title="Sign in to restore your focus"
                subtitle="Use the email or Google account you set up with. Your role, region, and interests come back with you."
              />
              <SignInPanel nextPath="/" />
            </div>
          </Stage>
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
                    onClick={() => setScene(signedOut ? "save" : "tour")}
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

      {scene === "save" && (
        <LandingScene sceneKey="save">
          <Stage
            footer={
              <>
                <BackButton onClick={() => setScene("interests")} />
                <button
                  type="button"
                  className={cn(buttonVariants({ variant: "ghost", size: "md" }))}
                  onClick={() => setScene("tour")}
                >
                  Not now
                </button>
              </>
            }
          >
            <div className="mx-auto w-full max-w-md space-y-8">
              <SceneHeading
                eyebrow="Optional"
                title="Keep this across your devices"
                subtitle="Sign in and your focus follows you — open HorizonIQ anywhere and pick up exactly here. You can always do this later."
              />
              <SignInPanel nextPath="/" />
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
      )}
    </div>
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
