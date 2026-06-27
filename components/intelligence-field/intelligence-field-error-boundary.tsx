"use client";

import * as React from "react";

import { IntelligenceFieldFallback } from "@/components/intelligence-field/intelligence-field-fallback";
import type { IntelligenceFieldVariant } from "@/components/intelligence-field/types";

interface State {
  hasError: boolean;
}

export class IntelligenceFieldErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    variant: IntelligenceFieldVariant;
    className?: string;
    onError?: () => void;
  },
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.();
    if (process.env.NODE_ENV === "development") {
      console.warn("[IntelligenceField] WebGL fallback:", error.message);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <IntelligenceFieldFallback
          className={this.props.className}
          variant={this.props.variant}
        />
      );
    }

    return this.props.children;
  }
}
