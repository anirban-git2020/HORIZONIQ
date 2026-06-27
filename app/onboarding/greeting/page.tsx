"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { FirstTimeShell } from "@/components/onboarding/first-time-shell";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/page-loader";
import { formatPersonalizedGreeting } from "@/lib/identity/greeting";
import { identityService } from "@/lib/identity";

export default function GreetingPage() {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const displayName = identityService.getDisplayName();

  useEffect(() => {
    if (!identityService.hasCompletedWelcome()) {
      setRedirecting(true);
      router.replace("/onboarding/welcome");
      return;
    }
    if (!displayName) {
      setRedirecting(true);
      router.replace("/onboarding/name");
      return;
    }
    if (identityService.hasCompletedGreeting()) {
      setRedirecting(true);
      router.replace("/onboarding/role");
    }
  }, [displayName, router]);

  const handleContinue = () => {
    identityService.markGreetingComplete();
    router.push("/onboarding/role");
  };

  if (redirecting || !displayName) {
    return <PageLoader label="Continuing…" />;
  }

  const greeting = formatPersonalizedGreeting(displayName);

  return (
    <FirstTimeShell
      footer={
        <div className="flex justify-end">
          <Button onClick={handleContinue}>
            Continue
            <ArrowRight />
          </Button>
        </div>
      }
    >
      <div className="space-y-6 text-center md:text-left">
        <p className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {greeting.salutation}
        </p>
        <h1 className="display-title text-3xl md:text-4xl">{greeting.headline}</h1>
        <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
          {greeting.subline}
        </p>
      </div>
    </FirstTimeShell>
  );
}
